import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, SafeAreaView, Platform, StatusBar, ImageBackground 
} from 'react-native';

const backgroundImage = require('../Assets/Saudi.png'); 

const ManageEvents = ({ navigation }: any) => {
  const events = [
    { id: '1', title: 'LEAP 2026', date: 'Oct 15, 2026', status: 'Active' },
    { id: '2', title: 'Blackhat 2026', date: 'Nov 20, 2026', status: 'Active' },
    { id: '3', title: 'Riyadh Season', date: 'Dec 01, 2026', status: 'Draft' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} resizeMode="cover" blurRadius={4}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerCircleBtn} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerIconText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EVENTS</Text>
          <TouchableOpacity style={styles.headerCircleBtn}>
            <Text style={styles.headerIconText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            
            {events.map((event) => (
              <View key={event.id} style={styles.listCard}>
                <View style={styles.cardInfo}>
                  <Text style={styles.itemTitle}>{event.title}</Text>
                  <Text style={styles.itemSubtitle}>
                    {event.date} • <Text style={event.status === 'Active' ? styles.activeText : styles.draftText}>{event.status}</Text>
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  {/* زر التعديل - نص بدلاً من إيموجي */}
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  
                  {/* زر الحذف - نص بدلاً من إيموجي */}
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>Del</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          </View>
        </ScrollView>

      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 25, 
    paddingTop: Platform.OS === 'android' ? 40 : 20 
  },
  headerCircleBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)'
  },
  headerIconText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { 
    color: '#B0A0D0', 
    fontSize: 24, 
    fontWeight: 'bold', 
    letterSpacing: 2, 
    fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' 
  },
  sectionContainer: { paddingHorizontal: 20, marginTop: 10 },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardInfo: { flex: 1 },
  itemTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  itemSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  activeText: { color: '#4CAF50', fontWeight: 'bold' },
  draftText: { color: '#FFB300', fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row' },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(176, 160, 208, 0.2)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#B0A0D0',
  },
  editBtnText: { color: '#B0A0D0', fontSize: 12, fontWeight: 'bold' },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    borderWidth: 1,
    borderColor: '#FF4B4B',
  },
  deleteBtnText: { color: '#FF4B4B', fontSize: 12, fontWeight: 'bold' },
});

export default ManageEvents;