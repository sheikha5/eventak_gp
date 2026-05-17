import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, SafeAreaView, Platform, StatusBar, ImageBackground
} from 'react-native';

const backgroundImage = require('../Assets/Saudi.png'); 

const ReviewTickets = ({ navigation }: any) => {

    const tickets = [
    { id: '#TK-1042', event: 'LEAP 2026', buyer: 'Ali Ahmed', status: 'Pending' },
    { id: '#TK-1043', event: 'Blackhat 2026', buyer: 'Sara Khalid', status: 'Flagged' },
    { id: '#TK-1044', event: 'Riyadh Season', buyer: 'shy', status: 'Verified' },
    { id: '#TK-1045', event: 'LEAP 2026', buyer: 'nora m', status: 'Pending' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} resizeMode="cover" blurRadius={4}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerCircleBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.menuIconText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>TICKETS</Text>
          <View style={[styles.headerCircleBtn, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            
            {tickets.map((ticket) => (
              <View key={ticket.id} style={styles.listCard}>
                <View style={styles.iconContainer}>
                  <Text style={styles.ticketStaticIcon}>T</Text>
                </View>
                <View style={[styles.cardInfo, { flex: 1, marginLeft: 15 }]}>
                  <Text style={styles.itemTitle}>{ticket.id}</Text>
                  <Text style={styles.itemSubtitle}>{ticket.event}</Text>
                  <Text style={[styles.itemSubtitle, { color: '#B0A0D0', marginTop: 2 }]}>Buyer: {ticket.buyer}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.approveBtn}>
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>Reject</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  headerCircleBtn: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  menuIconText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { color: '#B0A0D0', fontSize: 24, fontWeight: 'bold', letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
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
  iconContainer: {
    width: 45, height: 45, borderRadius: 10,
    backgroundColor: 'rgba(176, 160, 208, 0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(176, 160, 208, 0.3)'
  },
  ticketStaticIcon: { color: '#B0A0D0', fontWeight: 'bold', fontSize: 18 },
  cardInfo: { flex: 1 },
  itemTitle: { color: '#FFF', fontSize: 17, fontWeight: 'bold', marginBottom: 2 },
  itemSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  approveBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.15)', marginRight: 8,
    borderWidth: 1, borderColor: '#4CAF50',
  },
  approveBtnText: { color: '#4CAF50', fontSize: 11, fontWeight: 'bold' },
  deleteBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: 'rgba(255, 75, 75, 0.15)',
    borderWidth: 1, borderColor: '#FF4B4B',
  },
  deleteBtnText: { color: '#FF4B4B', fontSize: 11, fontWeight: 'bold' },
});

export default ReviewTickets;