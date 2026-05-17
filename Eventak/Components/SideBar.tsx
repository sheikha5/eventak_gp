import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SideBar = ({ visible, onClose, navigation }: any) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      
      
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose} 
      />
      
      <SafeAreaView style={styles.drawer}>
        <View style={styles.drawerContent}>
          
          <TouchableOpacity onPress={() => { onClose(); navigation.navigate('Main'); }}>
            <Text style={styles.logoText}>EVENTAK</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <View style={styles.navLinks}>
            
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => { onClose(); navigation.navigate('Main'); }}
            >
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => { onClose(); navigation.navigate('Profile'); }}
            >
              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => { 
                onClose(); 
                navigation.navigate('MyTicketsList'); 
              }}
            >
              <Text style={styles.navText}>My Tickets</Text> 
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => { 
                onClose(); 
                navigation.navigate('Support'); 
              }}
            >
              <Text style={styles.navText}>Contact Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => { 
                onClose(); 
                navigation.navigate('Settings'); 
              }}
            >
              <Text style={styles.navText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => { onClose(); navigation.navigate('Login'); }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, zIndex: 2000, flexDirection: 'row' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  drawer: { 
    width: width * 0.75, 
    backgroundColor: '#1A0831', 
    height: '100%', 
    borderRightWidth: 1, 
    borderRightColor: 'rgba(176, 160, 208, 0.2)' 
  },
  drawerContent: { flex: 1, padding: 25 },
  logoText: { 
    color: '#B0A0D0', 
    fontSize: 26, 
    fontWeight: 'bold', 
    letterSpacing: 2, 
    marginTop: 40, 
    textAlign: 'center' 
  },
  divider: { 
    height: 1, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    marginVertical: 35 
  },
  navLinks: { flex: 1 },
  navItem: { 
    paddingVertical: 18, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(255,255,255,0.05)' 
  },
  navText: { color: '#FFF', fontSize: 16, fontWeight: '400' },
  logoutBtn: { 
    padding: 16, 
    backgroundColor: 'rgba(255, 75, 75, 0.1)', 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  logoutText: { color: '#FF4B4B', fontWeight: 'bold' },
});

export default SideBar;