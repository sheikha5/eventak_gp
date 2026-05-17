import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, SafeAreaView, Platform, StatusBar, ImageBackground
} from 'react-native';

const backgroundImage = require('../Assets/Saudi.png'); 

const ManageUsers = ({ navigation }: any) => {

    const users = [
    { id: '1', name: 'Ali Ahmed', email: 'ali@test.com', role: 'CLIENT' },
    { id: '2', name: 'Sara Khalid', email: 'sara@test.com', role: 'CLIENT' },
    { id: '7', name: 'shy', email: 'sh@test.com', role: 'CLIENT' },
    { id: '8', name: 'nora m', email: 'nora@test.com', role: 'CLIENT' },
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
          <Text style={styles.headerTitle}>USERS</Text>
          <View style={[styles.headerCircleBtn, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            
            {users.map((user) => (
              <View key={user.id} style={styles.listCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={[styles.cardInfo, { flex: 1, marginLeft: 15 }]}>
                  <Text style={styles.itemTitle}>{user.name}</Text>
                  <Text style={styles.itemSubtitle}>{user.email} • {user.role}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>Block</Text>
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
  cardInfo: { flex: 1 },
  itemTitle: { color: '#FFF', fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  itemSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(176, 160, 208, 0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#B0A0D0'
  },
  avatarText: { color: '#B0A0D0', fontSize: 18, fontWeight: 'bold' },
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
  editBtnText: { color: '#B0A0D0', fontSize: 11, fontWeight: 'bold' },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    borderWidth: 1,
    borderColor: '#FF4B4B',
  },
  deleteBtnText: { color: '#FF4B4B', fontSize: 11, fontWeight: 'bold' },
});

export default ManageUsers;