import React, { useState, useCallback } from 'react'; // أضفت useCallback هنا
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  Image, SafeAreaView, StatusBar, ImageBackground, ActivityIndicator, Alert, RefreshControl 
} from 'react-native';

import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // أضفت استيراد useFocusEffect

const backgroundImage = require('../Assets/Saudi.png'); 

const MyTicketsList = ({ navigation, route }: any) => {
  const [activeTab, setActiveTab] = useState('purchased');
  // تعريف الأنواع لمنع أخطاء TypeScript
  const [purchasedTickets, setPurchasedTickets] = useState<any[]>([]);
  const [giftedTickets, setGiftedTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // استخدام useFocusEffect بدلاً من useEffect
  useFocusEffect(
    useCallback(() => {
      if (route.params?.activeTab) {
        setActiveTab(route.params.activeTab);
      }
      fetchTickets();
    }, [route.params?.activeTab])
  );

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert("Error", "User ID not found, please login again.");
        return;
      }

      // Fetch Purchased Tickets
      const purchasedRes = await fetch(`${API_BASE_URL}/my-tickets/${userId}`);
      const purchasedData = await purchasedRes.json() as any[];

      // Fetch Gifted Tickets
      const giftedRes = await fetch(`${API_BASE_URL}/gifted-tickets/${userId}`);
      const giftedData = await giftedRes.json() as any[];

      if (purchasedRes.ok) setPurchasedTickets(purchasedData);
      if (giftedRes.ok) setGiftedTickets(giftedData);
      
    } catch (error) {
      console.error("Fetch Tickets Error:", error);
      Alert.alert("Connection Error", "Could not load tickets from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const renderTicketItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.ticketCard} 
      onPress={() => navigation.navigate('MyTicketDetail', { ticketId: item.id })} 
    >
      <Image 
        source={item.img_url ? { uri: item.img_url } : require('../Assets/leap.png')} 
        style={styles.eventImg} 
      />
      
      <View style={{ flex: 1 }}>
        <View style={styles.ticketHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, activeTab === 'purchased' ? styles.activeBg : styles.giftedBg]}>
            <Text style={styles.statusText}>{item.status || 'Active'}</Text>
          </View>
        </View>
        
        <Text style={styles.eventDate}>{item.date} | 08:00 PM</Text>
        
        <View style={styles.ticketFooter}>
          <Text style={styles.ticketType}>{item.type || 'Standard'} Class</Text>
          {item.from ? (
            <Text style={styles.fromText}>From: {item.from}</Text>
          ) : (
            <Text style={styles.priceText}>{item.price} SAR</Text>
          )}
        </View>
      </View>
      <Text style={styles.arrowIcon}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} blurRadius={10}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>≡</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Tickets</Text>
          <View style={{ width: 45 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.mainHeading}>Digital Tickets</Text>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'purchased' && styles.activeTab]} 
              onPress={() => setActiveTab('purchased')}
            >
              <Text style={[styles.tabText, activeTab === 'purchased' && styles.activeTabText]}>Purchased</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'gifted' && styles.activeTab]} 
              onPress={() => setActiveTab('gifted')}
            >
              <Text style={[styles.tabText, activeTab === 'gifted' && styles.activeTabText]}>Received Gifts</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#B0A0D0" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={activeTab === 'purchased' ? purchasedTickets : giftedTickets}
              renderItem={renderTicketItem}
              keyExtractor={(item: any) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B0A0D0" />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No tickets found in this section.</Text>
              }
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  menuBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  menuIcon: { color: '#FFF', fontSize: 32 },
  headerTitle: { color: '#B0A0D0', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  mainHeading: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 25 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 5, marginBottom: 25 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#B0A0D0' },
  tabText: { color: '#B0A0D0', fontWeight: '600', fontSize: 14 },
  activeTabText: { color: '#1A0831' },
  ticketCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 15, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(176, 160, 208, 0.1)' },
  eventImg: { width: 60, height: 60, borderRadius: 12, marginRight: 15 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  activeBg: { backgroundColor: 'rgba(75, 210, 150, 0.2)' },
  giftedBg: { backgroundColor: 'rgba(176, 160, 208, 0.2)' },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  eventDate: { color: '#B0A0D0', fontSize: 12, marginTop: 4 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  ticketType: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  priceText: { color: '#FFD700', fontWeight: 'bold', fontSize: 13 },
  fromText: { color: '#B0A0D0', fontSize: 11, fontStyle: 'italic' },
  arrowIcon: { color: '#B0A0D0', fontSize: 24, marginLeft: 10 },
  emptyText: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 50 }
});

export default MyTicketsList;