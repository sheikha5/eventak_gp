import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, StatusBar, ImageBackground, Platform , Alert
} from 'react-native';

import { API_BASE_URL } from '../config.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('../Assets/Saudi.png'); 

const TicketLogo = () => (
  <View style={styles.ticketIcon}>
    <View style={styles.ticketMain}>
      <View style={styles.ticketLineShort} />
      <View style={styles.ticketLineLong} />
    </View>
    <View style={styles.ticketNotch} />
  </View>
);

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const lowerEmail = email.trim().toLowerCase();

    // --- بداية دمج شرط الـ Admin ---
    if (lowerEmail === "admin@eventak.com" && password === "1111") {
        console.log("Navigating to Admin...");
        navigation.navigate('AdminDashboard');
        return; 
    }
    // --- نهاية دمج شرط الـ Admin ---

    if (!email || !password) {
      Alert.alert("Please enter both email and password");
      return; 
    }
    
    if (password !== password.trim()) {
      Alert.alert("Error", "Password should not contain leading or trailing spaces");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          password: password
        }),
      });

      const data: any = await response.json();

      if (response.ok && data.success) {
        try {
          await AsyncStorage.setItem('userId', data.user.id.toString());
          console.log("Login Success & ID Saved:", data.user.id);
          
          navigation.navigate('Main', {
            screen: 'Profile', 
            params: { userId: data.user.id }, 
          });
        } catch (storageError) {
          console.error("AsyncStorage Error:", storageError);
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Connection error", "Check your server connection.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.logoHeaderContainer}>
            <TicketLogo />
            <View style={styles.titleContainer}>
              <Text style={styles.brandE}>E</Text>
              <Text style={styles.headerTitle}>VENTAK</Text>
            </View>
          </View>
          
          <Text style={styles.subHeader}>
            Welcome to Eventak, your smart ticketing app for events in Saudi Arabia.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Enter your email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="example@email.com" 
              placeholderTextColor="#888" 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Enter password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              placeholderTextColor="#888" 
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.centerBtnContainer}>
            <TouchableOpacity 
              style={styles.loginButton} 
              activeOpacity={0.7}
              onPress={handleLogin} 
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.skipBtn} 
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  scrollContent: { padding: 25, backgroundColor: 'rgba(26, 8, 49, 0.75)', flexGrow: 1, justifyContent: 'center' },
  logoHeaderContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 10, justifyContent: 'center' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: -5 },
  brandE: { fontSize: 36, color: '#FFF', fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  headerTitle: { fontSize: 34, color: '#FFF', fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  subHeader: { color: '#B0A0D0', textAlign: 'center', marginTop: 15, fontSize: 13, lineHeight: 18, paddingHorizontal: 15, width: '100%' },
  form: { width: '100%', marginTop: 30, marginBottom: 10 },
  label: { color: '#FFF', fontSize: 16, marginBottom: 10, marginTop: 15, fontWeight: '500' },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderBottomWidth: 1.5, borderBottomColor: '#6C63FF', color: '#FFF', padding: 15, borderRadius: 10, fontSize: 16 },
  centerBtnContainer: { width: '100%', alignItems: 'center', marginTop: 30 },
  loginButton: { backgroundColor: '#5A4C91', paddingVertical: 14, width: '100%', alignItems: 'center', borderRadius: 25 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'center' },
  footerText: { color: '#888', fontSize: 14 },
  signUpLink: { color: '#FFF', fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 14 },
  skipBtn: { marginTop: 40, alignItems: 'center' },
  skipText: { color: '#888', fontSize: 12, textDecorationLine: 'underline' },
  ticketIcon: { flexDirection: 'row', alignItems: 'center' },
  ticketMain: { width: 45, height: 30, backgroundColor: '#421a71', borderRadius: 4, padding: 4, justifyContent: 'center' },
  ticketLineShort: { width: '70%', height: 2, backgroundColor: '#FFF', marginBottom: 3, borderRadius: 1 },
  ticketLineLong: { width: '40%', height: 2, backgroundColor: '#FFF', borderRadius: 1 },
  ticketNotch: { width: 14, height: 14, backgroundColor: '#1A0831', borderRadius: 7, marginLeft: -7 }
});

export default LoginScreen;