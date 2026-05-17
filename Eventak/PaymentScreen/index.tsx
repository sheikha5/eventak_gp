import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, Image, TouchableOpacity, 
  SafeAreaView, ImageBackground, ScrollView, StatusBar, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

//import { buyTicketOnBlockchain } from '../src/blockchain/services/BlockchainManager';

const backgroundImage = require('../Assets/Saudi.png'); 

const PaymentScreen = ({ route, navigation }: any) => {
  const [selectedMethod, setSelectedMethod] = useState('apple');
  const [loading, setLoading] = useState(false);

  const { eventTitle, eventImage, selectedType, ticketCount, selectedDate, eventId } = route.params || {
    eventTitle: 'Event Name',
    eventImage: require('../Assets/leap.png'),
    selectedType: 'Standard',
    ticketCount: 1,
    selectedDate: '2026-04-10',
    eventId: 1 
  };

  const ticketPrice = selectedType === 'VIP' ? 1500 : selectedType === 'Premium' ? 800 : 300;
  const subtotal = ticketPrice * ticketCount;
  const tax = subtotal * 0.15; 
  const total = subtotal + tax;
  const totalAmountString = total.toFixed(2);
  const splitPayment = (total / 4).toFixed(2); 

  const handlePayment = async () => {
    // 1. Apple Pay option (Simulated / محاكاة للدفع)
    if (selectedMethod === 'apple') {
        setLoading(true);
        
        // إنشاء هاش بلوكشين وهمي للتجربة لتجاوز المحفظة
        const fakeTxHash = '0x' + Math.random().toString(16).substring(2, 15) + Date.now().toString(16);

        // محاكاة وقت المعالجة (ثانيتين)
        setTimeout(async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                
                const dbResponse = await fetch(`${API_BASE_URL}/purchase-ticket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        eventId: eventId,
                        ticketType: selectedType,
                        amount: total,
                        provider: 'APPLE_PAY',
                        blockchain_tx_hash: fakeTxHash 
                    })
                });

                if (dbResponse.ok) {
                    Alert.alert(
                        'Success', 
                        'Payment Successful! Your ticket has been registered on the Blockchain.\nHash: ' + fakeTxHash.substring(0,15) + '...'
                    );
                    navigation.navigate('MyTicketsList');
                } else {
                    Alert.alert('Error', 'Ticket secured on blockchain but failed to update database.');
                }
            } catch (error) {
                console.error("Database update error:", error);
                Alert.alert('Error', 'Network error while updating the database.');
            } finally {
                setLoading(false);
            }
        }, 2000); 
    } 
    // 2. خيار الفيزا (Stripe + Simulated Blockchain)
    else if (selectedMethod === 'visa') {
      navigation.navigate('CardPayment', { 
        totalAmount: totalAmountString,
        eventTitle: eventTitle,
        onSuccess: async () => {
            setLoading(true);
            
            // إنشاء هاش بلوكشين وهمي للتجربة لتجاوز المحفظة
            const fakeTxHash = '0x' + Math.random().toString(16).substring(2, 15) + Date.now().toString(16);

            try {
                const userId = await AsyncStorage.getItem('userId');
                
                const dbResponse = await fetch(`${API_BASE_URL}/purchase-ticket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        eventId: eventId,
                        ticketType: selectedType,
                        amount: total,
                        provider: 'MADA', 
                        blockchain_tx_hash: fakeTxHash
                    })
                });

                if (dbResponse.ok) {
                    Alert.alert("تم بنجاح", "تم الدفع وإصدار التذكرة في البلوكشين وحفظها في سجلك!");
                    navigation.navigate('MyTicketsList');
                } else {
                    Alert.alert("خطأ", "تم الدفع لكن فشل تحديث السجل في قاعدة البيانات.");
                }
            } catch (error) {
                console.error("Database update error:", error);
                Alert.alert("خطأ", "حدثت مشكلة في الاتصال بالسيرفر.");
            } finally {
                setLoading(false);
            }
        }
      });
    } 
    // 3. خيارات الأقساط (Tabby & Tamara)
    else if (selectedMethod === 'tabby' || selectedMethod === 'tamara') {
      navigation.navigate('Installments', { 
        provider: selectedMethod === 'tabby' ? 'Tabby' : 'Tamara', 
        totalAmount: totalAmountString 
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} blurRadius={15}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Summary</Text>
          <View style={{ width: 45 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.miniEventCard}>
            <Image source={eventImage} style={styles.miniImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.miniTitle}>{eventTitle}</Text>
              <Text style={styles.miniSub}>{selectedDate} | 08:00 PM</Text>
              <View style={styles.ticketBadge}>
                 <Text style={styles.ticketBadgeText}>{selectedType} Class</Text>
              </View>
            </View>
          </View>

          <View style={styles.invoiceCard}>
            <Text style={styles.invoiceHeader}>Invoice Details</Text>
            <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>Tickets</Text><Text style={styles.invoiceValue}>{ticketCount}</Text></View>
            <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>Subtotal</Text><Text style={styles.invoiceValue}>{subtotal.toFixed(2)} SAR</Text></View>
            <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>VAT (15%)</Text><Text style={styles.invoiceValue}>{tax.toFixed(2)} SAR</Text></View>
            <View style={[styles.invoiceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{totalAmountString} SAR</Text>
            </View>
          </View>

          <View style={styles.paymentSection}>
            <Text style={styles.sectionLabel}>Select Payment Method</Text>
            
            {/* Apple Pay / Blockchain */}
            <TouchableOpacity 
              style={selectedMethod === 'apple' ? styles.payOptionActive : styles.payOption}
              onPress={() => setSelectedMethod('apple')}
            >
              <Text style={styles.optionTextMain}>Apple Pay (Test Blockchain)</Text>
              <View style={selectedMethod === 'apple' ? styles.radioFilled : styles.radioEmpty} />
            </TouchableOpacity>

            {/* Visa / Stripe */}
            <TouchableOpacity 
              style={selectedMethod === 'visa' ? styles.payOptionActive : styles.payOption}
              onPress={() => setSelectedMethod('visa')}
            >
              <View>
                <Text style={styles.optionTextMain}>Visa / Mada</Text>
                <Text style={styles.splitText}>Secure payment via Stripe + Blockchain</Text>
              </View>
              <View style={selectedMethod === 'visa' ? styles.radioFilled : styles.radioEmpty} />
            </TouchableOpacity>

            {/* Tabby */}
            <TouchableOpacity 
              style={selectedMethod === 'tabby' ? styles.payOptionActive : styles.payOption}
              onPress={() => setSelectedMethod('tabby')}
            >
              <View>
                <Text style={styles.optionTextMain}>Tabby</Text>
                <Text style={styles.splitText}>Split in 4 interest-free payments of {splitPayment} SAR</Text>
              </View>
              <View style={selectedMethod === 'tabby' ? styles.radioFilled : styles.radioEmpty} />
            </TouchableOpacity>

            {/* Tamara */}
            <TouchableOpacity 
              style={selectedMethod === 'tamara' ? styles.payOptionActive : styles.payOption}
              onPress={() => setSelectedMethod('tamara')}
            >
              <View>
                <Text style={styles.optionTextMain}>Tamara</Text>
                <Text style={styles.splitText}>Flexible payments over time</Text>
              </View>
              <View style={selectedMethod === 'tamara' ? styles.radioFilled : styles.radioEmpty} />
            </TouchableOpacity>

          </View>

          <TouchableOpacity 
            style={[styles.mainPayBtn, loading && { opacity: 0.7 }]} 
            onPress={handlePayment}
            disabled={loading}
          >
            <Text style={styles.mainPayBtnText}>
                {loading ? "Processing..." : `Pay ${totalAmountString} SAR`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: { flex: 1, width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#fff', fontSize: 30, lineHeight: 35 },
  scrollContent: { padding: 20 },
  miniEventCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 15, marginBottom: 20 },
  miniImg: { width: 80, height: 80, borderRadius: 15, marginRight: 15 },
  miniTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  miniSub: { color: '#ccc', fontSize: 14, marginTop: 5 },
  ticketBadge: { backgroundColor: '#6200ee', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  ticketBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  invoiceCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20 },
  invoiceHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  invoiceLabel: { color: '#666', fontSize: 15 },
  invoiceValue: { color: '#333', fontSize: 15, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15, marginTop: 5 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#6200ee' },
  paymentSection: { marginBottom: 30 },
  sectionLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  payOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: 18, borderRadius: 15, marginBottom: 12 },
  payOptionActive: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(98, 0, 238, 0.2)', padding: 18, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: '#6200ee' },
  optionTextMain: { color: '#fff', fontSize: 16, fontWeight: '600' },
  splitText: { color: '#aaa', fontSize: 12, marginTop: 4 },
  radioEmpty: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff' },
  radioFilled: { width: 20, height: 20, borderRadius: 10, borderWidth: 6, borderColor: '#6200ee', backgroundColor: '#fff' },
  mainPayBtn: { backgroundColor: '#6200ee', padding: 20, borderRadius: 15, alignItems: 'center' },
  mainPayBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default PaymentScreen;