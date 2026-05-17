const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51TLJPyFk8UWYyKQwuqRQ3txRuloHpNjkwO6348uxZtALsY082V1H1FrN4OYkUM7YqriGgJGgLqhBgpJ5rMzRaGHj00V7A3pFAW');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa12345',
    database: 'myappdb'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database: myappdb');
});

// ==========================================
// Stripe Payment Intent
// ==========================================
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; 
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'sar',
            automatic_payment_methods: { enabled: true },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// مسارات المستخدمين (تسجيل الدخول، التسجيل، والبروفايل)
// ==========================================
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE BINARY email = ? AND BINARY password_hash = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false });
        if (results.length > 0) {
            res.json({ success: true, user: { id: results[0].id, full_name: results[0].full_name }});
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    });
});

app.post('/register', (req, res) => {
    const { full_name, email, phone, password } = req.body;
    const sql = "INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)";
    db.query(sql, [full_name, email, phone, password], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.get('/user-profile/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT full_name, email, phone FROM users WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length > 0) res.json(result[0]);
        else res.status(404).json({ message: "User not found" });
    });
});

app.post('/update-profile', (req, res) => {
    const { userId, full_name, email, phone } = req.body;
    const sql = "UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?";
    db.query(sql, [full_name, email, phone, userId], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "Profile updated successfully" });
    });
});

// ==========================================
// مسارات الفعاليات وشراء التذاكر
// ==========================================
app.get('/featured-events', (req, res) => {
    const sql = "SELECT id, title, descript as details FROM events WHERE estate = 'PUBLISHED' LIMIT 3";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.get('/api/events/:eventId/ticket-types', (req, res) => {
    const eventId = req.params.eventId;
    const sql = "SELECT ttype AS value, ttype AS label, price, currency FROM tickets WHERE event_id = ? AND tstate = 'issued' GROUP BY ttype, price, currency";
    db.query(sql, [eventId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.post('/purchase-ticket', (req, res) => {
    const { userId, eventId, ticketType, amount, provider, blockchain_tx_hash } = req.body;
    const serialCode = 'TKT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const insertTicket = "INSERT INTO tickets (serial_code, event_id, ttype, price, current_owner_user_id, tstate) VALUES (?, ?, ?, ?, ?, 'issued')";
    
    db.query(insertTicket, [serialCode, eventId, ticketType, amount, userId], (err, ticketResult) => {
        if (err) return res.status(500).json({ error: "Failed to create ticket" });
        const newTicketId = ticketResult.insertId;
        const insertTrans = "INSERT INTO transactions (ticket_id, to_user_id, transaction_type, amount) VALUES (?, ?, 'purchase', ?)";
        
        db.query(insertTrans, [newTicketId, userId, amount], (err, transResult) => {
            if (transResult) {
                const transId = transResult.insertId;
                const insertPayment = "INSERT INTO payments (transaction_id, provider, provider_txn_id, amount, pstate, paid_at) VALUES (?, ?, ?, ?, 'SUCCESS', NOW())";
                db.query(insertPayment, [transId, provider, blockchain_tx_hash, amount], () => {});
            }
            const insertHistory = "INSERT INTO ticket_ownership_history (ticket_id, to_user_id, ownerstate, blockchain_tx_hash) VALUES (?, ?, 'purchased', ?)";
            db.query(insertHistory, [newTicketId, userId, blockchain_tx_hash], () => {});
            res.json({ success: true, ticketId: newTicketId, message: "Ticket purchased!" });
        });
    });
});

// ==========================================
// مسارات تذاكري (القائمة، التفاصيل، الـ QR Code، والاسترجاع)
// ==========================================
app.get('/my-tickets/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT t.id, e.title, DATE_FORMAT(e.start_datetime, '%d %b') as date, 
               t.ttype as type, t.price as price, IF(t.tstate = 'issued', 'Active', t.tstate) as status
        FROM tickets t
        JOIN events e ON t.event_id = e.id
        WHERE t.current_owner_user_id = ? AND t.id NOT IN (
            SELECT ticket_id FROM transactions WHERE transaction_type = 'gift' AND to_user_id = ?
        )
    `;
    db.query(sql, [userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.get('/gifted-tickets/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT t.id, e.title, DATE_FORMAT(e.start_datetime, '%d %b') as date, 
               t.ttype as type, '0' as price, 'Gift' as status, u.full_name as \`from\`
        FROM tickets t
        JOIN events e ON t.event_id = e.id
        JOIN transactions tr ON tr.ticket_id = t.id
        LEFT JOIN users u ON tr.from_user_id = u.id
        WHERE t.current_owner_user_id = ? AND tr.transaction_type = 'gift' AND tr.to_user_id = ?
        GROUP BY t.id, e.title, e.start_datetime, t.ttype, u.full_name
    `;
    db.query(sql, [userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.get('/api/tickets/:id', (req, res) => {
    const ticketId = req.params.id;
    const sql = `
        SELECT e.title AS event_name, DATE_FORMAT(e.start_datetime, '%b %d, %Y - %h:%i %p') AS date,
               t.id AS ticket_id, t.ttype AS class, CONCAT('ETK-', t.id) AS qr_code
        FROM tickets t
        JOIN events e ON t.event_id = e.id
        WHERE t.id = ?
    `;
    db.query(sql, [ticketId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length === 0) return res.status(404).json({ message: "Ticket not found" });
        res.json(result[0]);
    });
});

app.get('/api/tickets/:id/qr', (req, res) => {
    const ticketId = req.params.id;
    const newQR = 'ETK-' + Math.random().toString(36).substring(7).toUpperCase();
    const sql = "INSERT INTO qr_sessions (ticket_id, qr_token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 SECOND))";
    db.query(sql, [ticketId, newQR], (err) => {
        if (err) return res.status(500).json({ error: "QR error" });
        res.json({ qr_code: newQR });
    });
});

app.post('/api/refund/:id', (req, res) => {
    const ticketId = req.params.id;
    const sql = "UPDATE tickets SET tstate = 'cancelled' WHERE id = ?";
    db.query(sql, [ticketId], (err) => {
        if (err) return res.status(500).json({ error: "Refund failed" });
        res.json({ success: true });
    });
});

app.post('/api/gift-ticket', (req, res) => {
    const { ticketId, senderId, recipientPhone } = req.body;
    const findRecipientSql = "SELECT id FROM users WHERE phone = ?";
    db.query(findRecipientSql, [recipientPhone], (err, recipientResults) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (recipientResults.length === 0) return res.status(404).json({ success: false, message: "Recipient not found" });
        
        const recipientId = recipientResults[0].id;
        const updateTicketSql = "UPDATE tickets SET current_owner_user_id = ? WHERE id = ? AND current_owner_user_id = ?";
        db.query(updateTicketSql, [recipientId, ticketId, senderId], (updateErr, updateResults) => {
            if (updateErr) return res.status(500).json({ success: false, message: "Database error" });
            if (updateResults.affectedRows === 0) return res.status(400).json({ success: false, message: "Ticket transfer failed." });
            
            const recordTransactionSql = "INSERT INTO transactions (ticket_id, from_user_id, to_user_id, transaction_type, amount) VALUES (?, ?, ?, 'gift', 0)";
            db.query(recordTransactionSql, [ticketId, senderId, recipientId], () => {});
            res.json({ success: true, message: "Ticket gifted successfully!" });
        });
    });
});

// ==========================================
// مسارات الإعدادات
// ==========================================
app.get('/user-settings/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT u.notifications_enabled, u.preferred_language, u.preferred_currency,
               (SELECT is_enabled FROM user_mfa_methods WHERE user_id = u.id AND method = 'FACE_ID' LIMIT 1) AS face_id_enabled
        FROM users u WHERE u.id = ?
    `;
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length > 0) {
            const settings = result[0];
            res.json({
                notifications_enabled: !!settings.notifications_enabled,
                preferred_language: settings.preferred_language,
                preferred_currency: settings.preferred_currency,
                face_id_enabled: !!settings.face_id_enabled
            });
        } else res.status(404).json({ message: "User not found" });
    });
});

app.post('/update-mfa', (req, res) => {
    const { userId, method, isEnabled } = req.body;
    const sql = "INSERT INTO user_mfa_methods (user_id, method, is_enabled) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_enabled = VALUES(is_enabled)";
    db.query(sql, [userId, method, isEnabled], (err) => {
        if (err) return res.status(500).json({ success: false, error: "Database error" });
        res.json({ success: true });
    });
});

app.post('/update-preferences', (req, res) => {
    const { userId, notifications_enabled } = req.body;
    const sql = "UPDATE users SET notifications_enabled = ? WHERE id = ?";
    db.query(sql, [notifications_enabled, userId], (err) => {
        if (err) return res.status(500).json({ success: false, error: "Database error" });
        res.json({ success: true });
    });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ Stripe Payment endpoint ready at /create-payment-intent`);
});