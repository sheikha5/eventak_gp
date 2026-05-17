import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ImageBackground, 
  StatusBar, 
  Alert 
} from 'react-native';

const backgroundImage = require('../Assets/Saudi.png'); 

const VerificationScreen = ({ navigation }: any) => {

  
  const handleVerifySuccess = (method: string) => {
    Alert.alert(
      "Verified *",
      `Your account is verified via ${method}. You can proceed now.`,
      [
        { 
          text: "Continue", 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} blurRadius={15}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Identity Verification</Text>
          <Text style={styles.subtitle}>
            Required only once to ensure a secure environment for buying and selling.
          </Text>

          <View style={styles.optionsContainer}>
            
            <TouchableOpacity 
              style={styles.optionCard} 
              onPress={() => handleVerifySuccess('SMS')}
            >
              <Text style={styles.optionIcon}></Text>
              <View>
                <Text style={styles.optionTitle}>SMS Verification</Text>
                <Text style={styles.optionDesc}>Quick code via text message</Text>
              </View>
            </TouchableOpacity>

            
            <TouchableOpacity 
              style={styles.optionCard} 
              onPress={() => handleVerifySuccess('Face ID')}
            >
              <Text style={styles.optionIcon}></Text>
              <View>
                <Text style={styles.optionTitle}>Face ID / Touch ID</Text>
                <Text style={styles.optionDesc}>Secure biometric verification</Text>
              </View>
            </TouchableOpacity>

            
            <TouchableOpacity 
              style={styles.optionCard} 
              onPress={() => handleVerifySuccess('Microsoft')}
            >
              <Text style={styles.optionIcon}></Text>
              <View>
                <Text style={styles.optionTitle}>Microsoft Auth</Text>
                <Text style={styles.optionDesc}>Verify with Microsoft Authenticator</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { 
    width: '85%', 
    padding: 25, 
    backgroundColor: 'rgba(26, 8, 49, 0.95)', 
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(176, 160, 208, 0.3)',
    elevation: 20,
  },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#B0A0D0', fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 18 },
  optionsContainer: { marginTop: 25 },
  optionCard: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(176, 160, 208, 0.2)' 
  },
  optionIcon: { fontSize: 22, marginRight: 15 },
  optionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  optionDesc: { color: '#B0A0D0', fontSize: 11, marginTop: 2 },
  cancelBtn: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 }
});

export default VerificationScreen;