import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BotMenu = ({ visible, onClose, navigation }: any) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      
      <TouchableOpacity 
        style={styles.blurArea} 
        activeOpacity={1} 
        onPress={onClose} 
      />
      
      <View style={styles.menuCard}>
        <View style={styles.botHeader}>
          <Text style={styles.menuTitle}>Eventak Support Bot</Text>
          <Text style={styles.menuSub}>How can I help you today?</Text>
        </View>

        <View style={styles.optionsContainer}>
          
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { 
              onClose(); 
              navigation.navigate('MyTicketsList', { activeTab: 'gifted' }); 
            }}
          >
            <Text style={styles.menuText}> Check My Gifts</Text>
          </TouchableOpacity>

          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => { 
              onClose(); 
              navigation.navigate('MyTicketsList', { activeTab: 'purchased' }); 
            }}
          >
            <Text style={styles.menuText}> My Tickets</Text>
          </TouchableOpacity>

          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => { 
              onClose(); 
              navigation.navigate('Support'); 
            }}
          >
            <Text style={styles.menuText}> Support & FAQ</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  blurArea: {
    ...StyleSheet.absoluteFill,
  },
  menuCard: {
    width: width * 0.8,
    backgroundColor: '#2D144B',
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(176, 160, 208, 0.3)',
    elevation: 10,
  },
  botHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    color: '#B0A0D0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 5,
  },
  optionsContainer: {
    marginVertical: 10,
  },
  menuItem: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  closeBtn: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'rgba(255, 75, 75, 0.15)',
    borderRadius: 15,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FF4B4B',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BotMenu;