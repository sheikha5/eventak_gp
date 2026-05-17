import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, SafeAreaView, Platform, StatusBar, ImageBackground
} from 'react-native';

const backgroundImage = require('../Assets/Saudi.png'); 

const AdminDashboard = ({ navigation }: any) => {
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
            <Text style={styles.menuIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>ADMIN PANEL</Text>

          <View style={[styles.headerCircleBtn, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* قسم الإحصائيات */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.categoriesGrid}>
              
              <View style={styles.card}>
                <View style={[styles.cardTouch, { height: 130, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={styles.statNumber}>120</Text>
                  <Text style={styles.cardText}>Active Events</Text>
                </View>
              </View>

              <View style={styles.card}>
                <View style={[styles.cardTouch, { height: 130, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={styles.statNumber}>850</Text>
                  <Text style={styles.cardText}>Total Users</Text>
                </View>
              </View>

            </View>
          </View>

          {/* قسم الإدارة مع تفعيل التنقل */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Management</Text>
            <View style={styles.categoriesGrid}>

              {/* زر إدارة الفعاليات */}
              <View style={styles.card}>
                <TouchableOpacity 
                  style={[styles.cardTouch, { height: 130, justifyContent: 'center', alignItems: 'center' }]}
                  onPress={() => navigation.navigate('ManageEvents')}
                >
                  <Text style={styles.cardText}>Manage{'\n'}Events</Text>
                </TouchableOpacity>
              </View>

              {/* زر إدارة المستخدمين */}
              <View style={styles.card}>
                <TouchableOpacity 
                  style={[styles.cardTouch, { height: 130, justifyContent: 'center', alignItems: 'center' }]}
                  onPress={() => navigation.navigate('ManageUsers')}
                >
                  <Text style={styles.cardText}>Manage{'\n'}Users</Text>
                </TouchableOpacity>
              </View>

              {/* زر مراجعة التذاكر */}
              <View style={styles.card}>
                <TouchableOpacity 
                  style={[styles.cardTouch, { height: 130, justifyContent: 'center', alignItems: 'center' }]}
                  onPress={() => navigation.navigate('ReviewTickets')}
                >
                  <Text style={styles.cardText}>Review{'\n'}Tickets</Text>
                </TouchableOpacity>
              </View>

            </View>
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
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 40 },
  headerCircleBtn: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  menuIcon: { color: '#FFF', fontSize: 22 },
  
  headerTitle: { color: '#B0A0D0', fontSize: 24, fontWeight: 'bold', letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  
  sectionContainer: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', marginBottom: 20 },
  cardTouch: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  
  statNumber: { color: '#B0A0D0', fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  cardText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});

export default AdminDashboard