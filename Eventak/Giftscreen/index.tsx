import React from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, StatusBar, ImageBackground, Alert, Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');
const backgroundImage = require('../Assets/Saudi.png'); 

const GiftScreen = ({ navigation }: any) => {

  const handleSendGift = () => {
    Alert.alert(
      'Gift Sent Successfully', 
      'The ticket has been secured and transferred to the recipient via Blockchain.',
      [{ text: 'Great', onPress: () => navigation.navigate('Main') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} blurRadius={10}>
        
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gift Center</Text>
          <View style={{ width: 45 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.mainTitle}>Send as a Gift</Text>
          <Text style={styles.subTitle}>Transfer your digital ticket securely to a friend or family member</Text>

          
          <View style={styles.giftCard}>
            
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Recipient Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                placeholderTextColor="rgba(26, 8, 49, 0.3)" 
              />

              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="05XXXXXXXX" 
                keyboardType="phone-pad" 
                placeholderTextColor="rgba(26, 8, 49, 0.3)" 
              />

              <View style={styles.dashedDivider} />

              <Text style={styles.inputLabel}>Gift Message</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Write your message here..." 
                multiline={true}
                placeholderTextColor="rgba(26, 8, 49, 0.3)" 
              />
            </View>

            
            <View style={styles.footerSection}>
              <Text style={styles.blockchainNote}>Blockchain Verified Transfer</Text>
            </View>
          </View>

          
          <TouchableOpacity 
            style={styles.mainSendBtn} 
            activeOpacity={0.8}
            onPress={handleSendGift}
          >
            <Text style={styles.mainSendBtnText}>Confirm Gift Transfer</Text>
          </TouchableOpacity>

          <Text style={styles.legalNote}>
            Once confirmed, this action cannot be undone. The ticket will be removed from your wallet immediately.
          </Text>

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
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  backBtn: { 
    width: 45, 
    height: 45, 
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  backIcon: { color: '#B0A0D0', fontSize: 35, fontWeight: '300' },
  headerTitle: { color: '#B0A0D0', fontSize: 18, fontWeight: 'bold' },

  scrollContent: { alignItems: 'center', padding: 25 },
  mainTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  subTitle: { color: '#B0A0D0', fontSize: 13, textAlign: 'center', marginTop: 10, marginBottom: 30, paddingHorizontal: 20, lineHeight: 20 },

  giftCard: { 
    backgroundColor: '#FFF', 
    width: '100%', 
    borderRadius: 30, 
    overflow: 'hidden', 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 10 
  },
  formSection: { padding: 25 },
  inputLabel: { color: '#999', fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginTop: 15 },
  input: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    padding: 15, 
    color: '#1A0831', 
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  dashedDivider: { 
    height: 1, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderStyle: 'dashed', 
    borderRadius: 1, 
    marginVertical: 25 
  },

  footerSection: { backgroundColor: '#F0EBFF', padding: 15, alignItems: 'center' },
  blockchainNote: { color: '#4B2A85', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  mainSendBtn: { 
    backgroundColor: '#B0A0D0', 
    width: '100%', 
    padding: 20, 
    borderRadius: 25, 
    alignItems: 'center', 
    marginTop: 35,
    shadowColor: "#B0A0D0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  mainSendBtnText: { color: '#1A0831', fontSize: 18, fontWeight: 'bold' },
  legalNote: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 25, textAlign: 'center', lineHeight: 18 }
});

export default GiftScreen;