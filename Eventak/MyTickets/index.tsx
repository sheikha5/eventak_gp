import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, 
  TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { API_BASE_URL } from '../config'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyTickets = ({ navigation, route }: any) => {
  const ticketIdFromRoute = route.params?.ticketId || "1"; // وضعنا 1 كقيمة افتراضية للتجربة
  
  const [ticketData, setTicketData] = useState<any>(null);
  const [qrValue, setQrValue] = useState('LOADING-SECURE-HASH');
  const [seconds, setSeconds] = useState(15); // العداد 15 ثانية للتحديث
  const [loading, setLoading] = useState(true);

  const fetchTicketDetails = async () => {
    try {
      // 1. تصحيح المسار ليتطابق مع السيرفر
      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketIdFromRoute}`);
      const data = await response.json();
      
      if (response.ok) {
        setTicketData(data);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDynamicHash = async () => {
    try {
      // 2. تصحيح مسار الـ QR Code ليتطابق مع السيرفر
      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketIdFromRoute}/qr`);
      const data: any = await response.json();
      
      // السيرفر يرسل المتغير باسم qr_code
      if (response.ok && data.qr_code) {
        setQrValue(data.qr_code);
      }
    } catch (error) {
      setQrValue(`OFFLINE-MODE-${ticketIdFromRoute}`);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchDynamicHash();

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          fetchDynamicHash(); 
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ticketIdFromRoute]);

  const handleRefund = () => {
    Alert.alert(
      "Confirm Refund",
      "Are you sure? This will burn the ticket on the Blockchain and refund your money.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Refund", 
          style: "destructive",
          onPress: async () => {
            try {
              // 3. تصحيح مسار الاسترجاع ليتطابق مع السيرفر
              const response = await fetch(`${API_BASE_URL}/api/refund/${ticketIdFromRoute}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              
              if (response.ok) {
                Alert.alert("Success", "Ticket refunded and burned on Blockchain.");
                navigation.navigate('MyTicketsList');
              } else {
                Alert.alert("Error", "Refund policy expired or server error.");
              }
            } catch (error) {
              Alert.alert("Error", "Check your connection.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#B0A0D0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circularBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EVENTAK</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Your Ticket is Confirmed</Text>
        
        <View style={styles.ticketCard}>
          <View style={styles.qrSection}>
            <View style={styles.qrWrapper}>
              <QRCode 
                value={qrValue} 
                size={180} 
                color="#1A0831" 
                backgroundColor="white" 
              />
            </View>
            
            <View style={styles.timerContainer}>
              <View style={styles.timerTrack}>
                <View style={[styles.timerBar, { width: `${(seconds / 15) * 100}%` }]} />
              </View>
              <Text style={styles.timerText}>Security Code Refreshing in {seconds}s</Text>
            </View>
            
            <Text style={styles.blockchainBadge}>Secured by Blockchain: {ticketData?.blockchain_tx || "Confirmed"}</Text>
          </View>

          <View style={styles.detailsSection}>
             <View style={styles.infoRow}>
                <View>
                  <Text style={styles.label}>Event</Text>
                  <Text style={styles.value}>{ticketData?.event_name || "Loading..."}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.label}>Ticket ID (Token)</Text>
                  {/* تصحيح اسم المتغير إلى ticket_id */}
                  <Text style={styles.value}>#{ticketData?.ticket_id || ticketIdFromRoute}</Text>
                </View>
             </View>

             <View style={styles.divider} />

             <View style={styles.infoRow}>
                <View>
                  <Text style={styles.label}>Date & Time</Text>
                  {/* تصحيح اسم المتغير إلى date */}
                  <Text style={styles.value}>{ticketData?.date || "Loading..."}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.label}>Class</Text>
                  {/* تصحيح اسم المتغير إلى class */}
                  <Text style={[styles.value, {color: '#4B2A85'}]}>{ticketData?.class || "VIP"}</Text>
                </View>
             </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.giftBtnColor]}
            onPress={() => navigation.navigate('Gift', { ticketId: ticketIdFromRoute })}
          >
            <Text style={styles.giftBtnText}>Gift Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.refundBtnColor]}
            onPress={handleRefund}
          >
            <Text style={styles.refundBtnText}>Refund</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  circularBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: '#B0A0D0', fontSize: 35, fontWeight: '300', marginTop: -5 },
  headerTitle: { color: '#B0A0D0', fontSize: 20, fontWeight: 'bold', letterSpacing: 3 },
  scrollContent: { alignItems: 'center', padding: 25 },
  mainTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  ticketCard: { backgroundColor: '#FFF', width: '100%', borderRadius: 30, overflow: 'hidden' },
  qrSection: { alignItems: 'center', padding: 30 },
  qrWrapper: { padding: 10, borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 20 },
  timerContainer: { marginTop: 15, width: '100%', alignItems: 'center' },
  timerTrack: { width: '80%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 5, overflow: 'hidden' },
  timerBar: { height: '100%', backgroundColor: '#B0A0D0', borderRadius: 2 },
  timerText: { color: '#1A0831', fontSize: 10, opacity: 0.6, fontWeight: '600' },
  blockchainBadge: { marginTop: 15, color: '#4B2A85', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  detailsSection: { backgroundColor: '#F8F9FA', padding: 25 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#999', fontSize: 11, marginBottom: 4 },
  value: { color: '#1A0831', fontSize: 14, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 15, borderStyle: 'dashed', borderWidth: 0.5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 },
  actionBtn: { flex: 1, paddingVertical: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  giftBtnColor: { backgroundColor: '#B0A0D0', marginRight: 10 },
  refundBtnColor: { backgroundColor: 'rgba(255, 75, 75, 0.1)', borderWidth: 1, borderColor: '#FF4B4B' },
  giftBtnText: { color: '#1A0831', fontWeight: 'bold', fontSize: 15 },
  refundBtnText: { color: '#FF4B4B', fontWeight: 'bold', fontSize: 15 }
});

export default MyTickets;