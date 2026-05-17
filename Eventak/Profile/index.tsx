import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  SafeAreaView, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';

import { useIsFocused } from '@react-navigation/native'; 
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const ProfileScreen = ({ route, navigation }: any) => {
  const isFocused = useIsFocused(); 
  const userId = route.params?.userId; 

  const [name, setName] = useState('Loading...');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      let id = userId;
      if (!id) {
        id = await AsyncStorage.getItem('userId');
      }

      if (isFocused && id) { 
        fetch(`${API_BASE_URL}/user-profile/${id}`)
          .then(res => res.json())
          .then((data: any) => {
              if (data && !data.message) {
              setName(data.full_name);
              setEmail(data.email);
              setPhone(data.phone);
            } else {
              setName('User not found');
            }
          })
          .catch(err => {
            console.error("Fetch error:", err);
            setName('Error loading profile');
          });
      } else if (isFocused && !id) {
          setName('Please Login first');
          setEmail('');
          setPhone('');
      }
    };

    loadProfile();
  }, [isFocused, userId]); 


  const handleUpdateProfile = async () => {
    try {
      let id = userId;
      if (!id) id = await AsyncStorage.getItem('userId');

      if (!id) return;

      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          full_name: name,
          email: email,
          phone: phone
        })
      });

const data: any = await response.json();

      if (data.success) {

        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {name && name !== 'Loading...' && name !== 'User not found' ? name.charAt(0).toUpperCase() : '?'}
                </Text>
                <TouchableOpacity style={styles.editPhotoBadge}>
                  <Text style={{ fontSize: 12 }}>📷</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.userStatus}>Silver Member</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                  style={styles.input} 
                  value={name} 
                  onChangeText={setName} 
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput 
                  style={styles.input} 
                  value={email} 
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput 
                  style={styles.input} 
                  value={phone} 
                  keyboardType="phone-pad"
                  onChangeText={setPhone}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>
            </View>

           
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
              <Text style={styles.saveBtnText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutBtn} 
              onPress={async () => {
                await AsyncStorage.removeItem('userId');
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  mainWrapper: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: '#FFF', fontSize: 30 },
  headerTitle: { color: '#B0A0D0', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 25, paddingTop: 30 },
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#B0A0D0', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' },
  avatarInitial: { fontSize: 40, fontWeight: 'bold', color: '#1A0831' },
  editPhotoBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  userName: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  userStatus: { color: '#B0A0D0', fontSize: 14, marginTop: 5 },
  infoContainer: { marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 15, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  saveBtn: { backgroundColor: '#B0A0D0', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  saveBtnText: { color: '#1A0831', fontSize: 18, fontWeight: 'bold' },
  logoutBtn: { padding: 10, alignItems: 'center' },
  logoutText: { color: '#FF4B4B', fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;