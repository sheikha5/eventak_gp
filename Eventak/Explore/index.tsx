import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, ImageBackground, StatusBar 
} from 'react-native';

const backgroundImage = require('../Assets/Saudi.png'); 

// تم إضافة eventId لكل فعالية لربطها بالداتابيس
const allEvents: any = {
  'Technology': [
    { eventId: 4, title: 'AI Summit 2026', date: '20-22 Oct', location: 'KAFD', img: require('../Assets/tech.png') },
    { eventId: 2, title: 'Tech Conference', date: '05 Nov', location: 'Riyadh Front', img: require('../Assets/leap.png') },
  ],
  'Riyadh Season': [
    { eventId: 3, title: 'The Boulevard', date: 'Dec 2025', location: 'Hittin', img: require('../Assets/riyadh.png') },
    { eventId: 5, title: 'Wonder Garden', date: 'Jan 2026', location: 'Al-Malqa', img: require('../Assets/riyadh.png') },
  ],
  'Gaming': [
    { eventId: 6, title: 'Gamers8 Finals', date: '15 Aug', location: 'Boulevard City', img: require('../Assets/gamer.png') },
    { eventId: 7, title: 'Retro Gaming', date: '01 Sep', location: 'VIA Riyadh', img: require('../Assets/blackhat.png') },
  ],
  'Saudi Culture': [
    { eventId: 8, title: 'Souq Okaz', date: 'Aug 2025', location: 'Taif', img: require('../Assets/saudia.png') },
    { eventId: 9, title: 'Art Gallery', date: 'Sep 2025', location: 'Jeddah Al-Balad', img: require('../Assets/saudia.png') },
  ],
};

const ExploreScreen = ({ route, navigation }: any) => {
  
  const { categoryName } = route.params || { categoryName: 'Technology' };
  const events = allEvents[categoryName] || allEvents['Technology'];
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} blurRadius={4}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircleBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <View style={{ width: 45 }} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.filterContainer}>
            {['All', 'Upcoming', 'Top Rated'].map((filter) => (
              <TouchableOpacity 
                key={filter} 
                style={[styles.filterBtn, selectedFilter === filter && styles.activeFilter]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.resultsText}>{events.length} Amazing Events</Text>

          {events.map((event: any) => (
            <TouchableOpacity 
              key={event.title} 
              style={styles.eventCard}
              activeOpacity={0.8}
              // التعديل الأهم: إرسال eventId هنا
              onPress={() => navigation.navigate('Booking', { 
                eventId: event.eventId,
                eventTitle: event.title, 
                eventImage: event.img 
              })} 
            >
              <View style={styles.cardContent}>
                <View style={styles.textGroup}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventInfo}>{event.location}  •  {event.date}</Text>
                </View>
                <View style={styles.arrowCircle}>
                  <Text style={styles.arrowIcon}>›</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: 40,
    paddingBottom: 10
  },
  headerCircleBtn: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  backIcon: { color: '#FFF', fontSize: 30, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#B0A0D0', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 40 },
  filterContainer: { flexDirection: 'row', marginBottom: 25 },
  filterBtn: { 
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  activeFilter: { backgroundColor: '#B0A0D0' },
  filterText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  activeFilterText: { color: '#1A0831' },
  resultsText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 15 },
  eventCard: { 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderRadius: 20, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textGroup: { flex: 1 },
  eventTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  eventInfo: { color: '#B0A0D0', fontSize: 13, marginTop: 5, opacity: 0.8 },
  arrowCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(176, 160, 208, 0.2)', justifyContent: 'center', alignItems: 'center' },
  arrowIcon: { color: '#B0A0D0', fontSize: 20, fontWeight: 'bold' }
});

export default ExploreScreen;