import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, Image, TouchableOpacity, 
  SafeAreaView, ImageBackground, FlatList, Alert 
} from 'react-native';

const backgroundImage = require('../Assets/Saudi.png'); 

const RESALE_LISTINGS = [
  {
    id: '1',
    eventTitle: 'Boulevard World 2026',
    eventImage: require('../Assets/leap.png'), 
    eventLocation: 'Riyadh, Boulevard',
    eventDate: '15 April 2026',
    sellerName: 'Sarah Ahmed',
    ticketClass: 'Standard Class',
    price: '320 SAR',
  },
  {
    id: '2',
    eventTitle: 'LEAP 2026 Tech Conference',
    eventImage: require('../Assets/leap.png'), 
    eventLocation: 'Riyadh Front',
    eventDate: '20 April 2026',
    sellerName: 'Abdulaziz Khaled',
    ticketClass: 'VIP Class',
    price: '1800 SAR',
  },
];

const ListingScreen = ({ navigation }: any) => {
  
  const [isUserVerified, setIsUserVerified] = useState(true); 

  const handleConnect = (item: any) => {
    if (!isUserVerified) {
      navigation.navigate('Verification');
    } else {
      
      navigation.navigate('ChatRoom', { 
        sellerName: item.sellerName, 
        eventTitle: item.eventTitle 
      });
    }
  };

  const renderListingCard = ({ item }: any) => (
    <View style={styles.ticketCard}>
      <Image source={item.eventImage} style={styles.eventImg} />
      <View style={styles.cardInfoContainer}>
        <View style={styles.ticketHeader}>
          <Text style={styles.eventTitle}>{item.eventTitle}</Text>
          <Text style={styles.ticketPrice}>{item.price}</Text>
        </View>
        <Text style={styles.eventSub}>{item.eventLocation} | {item.eventDate}</Text>
        <View style={styles.sellerRow}>
          <Text style={styles.sellerLabel}>Seller: <Text style={styles.sellerName}>{item.sellerName}</Text></Text>
          <View style={styles.ticketBadge}>
            <Text style={styles.ticketBadgeText}>{item.ticketClass}</Text>
          </View>
        </View>
        
        
        <TouchableOpacity 
          style={styles.connectBtn} 
          onPress={() => handleConnect(item)}
        >
          <Text style={styles.connectBtnText}>Contact User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.bgImage} blurRadius={10}>
        
        
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backBtn}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>Resale Hub</Text>
          </View>
          <View style={{ width: 45 }} /> 
        </View>

        
        <View style={styles.disclaimerBanner}>
          <Text style={styles.disclaimerTitle}>Secure Connection Notice</Text>
          <Text style={styles.disclaimerText}>
            Eventak facilitates the connection between users but payments are handled externally. Eventak is not liable for any external transactions. Please be careful.
          </Text>
        </View>

        <FlatList
          data={RESALE_LISTINGS}
          renderItem={renderListingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingTop: 20,
    paddingBottom: 10
  },
  backBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backIcon: { color: '#FFF', fontSize: 35, fontWeight: '300', marginTop: -5 },
  headerTextWrapper: { alignItems: 'center' },
  headerTitle: { color: '#B0A0D0', fontSize: 22, fontWeight: 'bold' },
  disclaimerBanner: { 
    backgroundColor: 'rgba(26, 8, 49, 0.95)', 
    marginHorizontal: 15, 
    marginVertical: 10,
    padding: 18, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#4B2A85',
  },
  disclaimerTitle: { color: '#B0A0D0', fontWeight: 'bold', fontSize: 14, marginBottom: 6 },
  disclaimerText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, lineHeight: 18 },
  listContent: { padding: 15, paddingBottom: 30 },
  ticketCard: { 
    backgroundColor: 'rgba(255,255,255,0.04)', 
    padding: 15, 
    borderRadius: 25, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(176, 160, 208, 0.15)',
    flexDirection: 'row', 
    alignItems: 'center'
  },
  eventImg: { width: 90, height: 120, borderRadius: 18, marginRight: 15 },
  cardInfoContainer: { flex: 1 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  eventTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15, flex: 1, marginRight: 5 },
  ticketPrice: { color: '#FFD700', fontWeight: 'bold', fontSize: 16 },
  eventSub: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 12 },
  sellerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sellerLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  sellerName: { color: '#FFF', fontWeight: 'bold' },
  ticketBadge: { backgroundColor: 'rgba(176, 160, 208, 0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  ticketBadgeText: { color: '#B0A0D0', fontSize: 10, fontWeight: 'bold' },
  connectBtn: { backgroundColor: '#4B2A85', padding: 15, borderRadius: 18, alignItems: 'center' },
  connectBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});

export default ListingScreen;