import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ImageBackground, 
  ScrollView, 
  StatusBar, 
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { API_BASE_URL } from '../config'; 

const { width } = Dimensions.get('window');
const backgroundImage = require('../Assets/Saudi.png'); 

const BookingScreen = ({ route, navigation }: any) => {

  const { eventId = 1, eventTitle = 'Featured Event', eventImage = require('../Assets/leap.png') } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);

const [ticketTypes, setTicketTypes] = useState<any[]>([]);
const [selectedTicket, setSelectedTicket] = useState<any>(null);
  
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [isUserVerified, setIsUserVerified] = useState(true); 
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 3, 1)); 


  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/ticket-types`);
 

        const data = await response.json() as any[];

        if (data && data.length > 0) {
          setTicketTypes(data);
          setSelectedTicket(data[0]); 
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        Alert.alert('خطأ', 'تعذر جلب التذاكر المتاحة لهذه الفعالية.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketTypes();
  }, [eventId]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonthDate);
    newDate.setMonth(currentMonthDate.getMonth() + offset);
    setCurrentMonthDate(newDate);
  };

  const monthDisplay = currentMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonthDate.getFullYear(), currentMonthDate.getMonth());
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

const handleConfirmBooking = () => {
    if (!selectedTicket) {
      Alert.alert('تنبيه', 'الرجاء اختيار نوع التذكرة أولاً.');
      return;
    }

    if (!isUserVerified) {
      navigation.navigate('Verification');
    } else {
      navigation.navigate('Payment', {
        eventId: eventId,
        eventTitle: eventTitle,
        eventImage: eventImage,
        selectedType: selectedTicket.value, // تم تعديل الاسم هنا ليطابق شاشة الدفع
        totalPrice: selectedTicket.price * ticketCount, 
        currency: selectedTicket.currency,
        ticketCount: ticketCount,
        selectedDate: `${selectedDate} ${monthDisplay}`
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#B0A0D0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} blurRadius={12}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircleBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EVENTAK</Text>
          <View style={{ width: 45 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.topSection}>
            <View style={styles.imageWrapper}>
              <Image source={eventImage} style={styles.eventImg} />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ 4.9</Text>
              </View>
            </View>
            
            <View style={styles.selectionArea}>
              <Text style={styles.eventMainTitle}>{eventTitle}</Text>
              <Text style={styles.sectionHint}>*Select ticket type:</Text>
              
              
              {ticketTypes.length === 0 ? (
                <Text style={{color: '#FF4B4B'}}>Sold Out</Text>
              ) : (
                ticketTypes.map((type, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.typeRow} 
                    onPress={() => setSelectedTicket(type)}
                  >
                    <View>
                      <Text style={[styles.typeLabel, selectedTicket?.value === type.value && styles.activeLabel]}>
                        {type.label}
                      </Text>
                      <Text style={styles.typeDesc}>{type.price} {type.currency}</Text>
                    </View>
                    <View style={[styles.checkbox, selectedTicket?.value === type.value && styles.checkboxActive]} />
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.calendarNav}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Text style={styles.navArrow}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthText}>{monthDisplay}</Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Text style={styles.navArrow}>›</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
              {daysArray.map(date => (
                <TouchableOpacity 
                  key={date} 
                  style={[styles.dateCircle, selectedDate === date && styles.activeDateCircle]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dateNumber, selectedDate === date && styles.activeDateText]}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.resaleBtn} onPress={() => navigation.navigate('Listing')}>
            <Text style={styles.resaleText}>View Resale Tickets</Text>
          </TouchableOpacity>

          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Number of tickets :</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity onPress={() => ticketCount > 1 && setTicketCount(ticketCount - 1)}>
                <Text style={styles.stepperIcon}>−</Text>
              </TouchableOpacity>
              <View style={styles.countBadge}>
                <Text style={styles.countNumber}>{ticketCount}</Text>
              </View>
              <TouchableOpacity onPress={() => setTicketCount(ticketCount + 1)}>
                <Text style={styles.stepperIcon}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryHeader}>Booking Summary:</Text>
            <View style={styles.summaryRow}>
               <Text style={styles.summaryKey}>Ticket Type</Text>
               <Text style={styles.summaryVal}>{selectedTicket ? selectedTicket.label : '-'}</Text>
            </View>
            <View style={styles.summaryRow}>
               <Text style={styles.summaryKey}>Selected Date</Text>
               <Text style={styles.summaryVal}>{selectedDate} {monthDisplay}</Text>
            </View>
            <View style={styles.summaryRow}>
               <Text style={styles.summaryKey}>Total Amount</Text>
               {/* حساب السعر الإجمالي: السعر ضرب العدد */}
               <Text style={[styles.summaryVal, {color: '#FFF'}]}>
                 {selectedTicket ? (selectedTicket.price * ticketCount) : 0} {selectedTicket ? selectedTicket.currency : 'SAR'}
               </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.confirmBtn} 
            activeOpacity={0.8}
            onPress={handleConfirmBooking}
          >
            <Text style={styles.confirmBtnText}>Confirm Booking</Text>
          </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  headerCircleBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  backIcon: { color: '#FFF', fontSize: 28 },
  headerTitle: { color: '#B0A0D0', fontSize: 22, fontWeight: 'bold' },
  scrollContent: { padding: 25, paddingBottom: 100 }, 
  topSection: { flexDirection: 'row', marginBottom: 30 },
  imageWrapper: { position: 'relative' },
  eventImg: { width: 140, height: 140, borderRadius: 20 },
  ratingBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  selectionArea: { flex: 1, marginLeft: 20 },
  eventMainTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  sectionHint: { color: '#B0A0D0', fontSize: 10, marginBottom: 15 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  typeDesc: { color: '#B0A0D0', fontSize: 10, marginTop: 2, fontWeight: 'bold' },
  activeLabel: { color: '#FFF', fontWeight: 'bold' },
  checkbox: { width: 14, height: 14, borderRadius: 4, borderWidth: 1, borderColor: '#B0A0D0' },
  checkboxActive: { backgroundColor: '#B0A0D0' },
  calendarContainer: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingVertical: 20, marginVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  calendarNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  monthText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  navArrow: { color: '#B0A0D0', fontSize: 24, paddingHorizontal: 10 },
  daysScroll: { paddingHorizontal: 15 },
  dateCircle: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginHorizontal: 5 },
  activeDateCircle: { backgroundColor: '#B0A0D0' },
  dateNumber: { color: '#FFF', fontSize: 14 },
  activeDateText: { color: '#1A0831', fontWeight: 'bold' },
  resaleBtn: { backgroundColor: 'rgba(176, 160, 208, 0.2)', alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: 20 },
  resaleText: { color: '#B0A0D0', fontSize: 12, fontWeight: '600' },
  quantitySection: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 30 },
  quantityLabel: { color: '#FFF', marginRight: 15 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 5 },
  stepperIcon: { color: '#B0A0D0', fontSize: 22, paddingHorizontal: 15 },
  countBadge: { backgroundColor: '#FFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  countNumber: { color: '#1A0831', fontWeight: 'bold', fontSize: 14 },
  summaryCard: { marginTop: 40, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingTop: 20 },
  summaryHeader: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryKey: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  summaryVal: { color: '#B0A0D0', fontSize: 14, fontWeight: '600' },
  confirmBtn: { backgroundColor: '#000', padding: 20, borderRadius: 30, alignItems: 'center', marginTop: 20, marginBottom: 10, borderWidth: 1, borderColor: '#B0A0D0' },
  confirmBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default BookingScreen;