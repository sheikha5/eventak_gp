import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, StatusBar, ImageBackground, Platform, Alert
} from 'react-native';

import { API_BASE_URL } from '../config';

const backgroundImage = require('../Assets/Saudi.png'); 

const RegisterScreen = ({ navigation }: any) => {
  const [nationalId, setNationalId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
const handleSignUp = async () => {
  
    if (!firstName || !lastName || !email || !password || !phone) {
      Alert.alert("Required Fields", "Please fill in all the basic information.");
      return;
    }

    try {
    
    const response = await fetch(`${API_BASE_URL}/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          full_name: `${firstName} ${lastName}`, 
          email: email, 
          phone: phone,
          password: password 
        }),
      });

      const data: any = await response.json();

      if (response.ok) {
        Alert.alert("Success!", "Your account has been created successfully.");
        navigation.navigate('Login'); 
      } else {
        Alert.alert("Registration Failed", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Please make sure your Backend server is running.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.subHeader}>Join Eventak to secure your tickets with Blockchain technology.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>National ID / IQAMA (Optional)</Text>
            <TextInput style={styles.input} placeholder="1XXXXXXXXX" placeholderTextColor="#888" keyboardType="number-pad" maxLength={10} value={nationalId} onChangeText={setNationalId} />

            <View style={styles.row}>
              <View style={[styles.inputGroup, { marginRight: 10 }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} placeholder="Ahmed" placeholderTextColor="#888" value={firstName} onChangeText={setFirstName} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} placeholder="Al-Saud" placeholderTextColor="#888" value={lastName} onChangeText={setLastName} />
              </View>
            </View>

            <Text style={styles.label}>Mobile Number</Text>
            <TextInput style={styles.input} placeholder="05XXXXXXXX" placeholderTextColor="#888" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} placeholder="example@email.com" placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput style={styles.input} placeholder="DD/MM/YYYY" placeholderTextColor="#888" value={dob} onChangeText={setDob} />

            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            activeOpacity={0.7}
            onPress={handleSignUp}>
              
            <Text style={styles.registerButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  scrollContent: { padding: 25, alignItems: 'center', backgroundColor: 'rgba(26, 8, 49, 0.85)', flexGrow: 1 },
  headerTitle: { fontSize: 32, color: '#FFF', fontWeight: 'bold', marginTop: 40, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  subHeader: { color: '#B0A0D0', textAlign: 'center', marginTop: 10, fontSize: 13, paddingHorizontal: 20 },
  form: { width: '100%', marginTop: 10 },
  row: { flexDirection: 'row', width: '100%' },
  inputGroup: { flex: 1 },
  label: { color: '#FFF', fontSize: 14, marginBottom: 8, marginTop: 15, fontWeight: '500' },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderBottomWidth: 1.5, borderBottomColor: '#6C63FF', color: '#FFF', padding: 12, borderRadius: 10, fontSize: 14 },
  registerButton: { backgroundColor: '#5A4C91', paddingVertical: 15, width: '100%', borderRadius: 25, marginTop: 35, alignItems: 'center' },
  registerButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', marginTop: 25, marginBottom: 40 },
  footerText: { color: '#888', fontSize: 14 },
  loginLink: { color: '#FFF', fontWeight: 'bold', textDecorationLine: 'underline' }
});

export default RegisterScreen;