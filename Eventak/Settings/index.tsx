import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, 
  TouchableOpacity, ScrollView, Switch, StatusBar, Alert, ActivityIndicator 
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { API_BASE_URL } from '../config'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ route, navigation }: any) => {
  const isFocused = useIsFocused();
  const routeUserId = route.params?.userId; 

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const [language, setLanguage] = useState('English (US)');
  const [currency, setCurrency] = useState('SAR');

  useEffect(() => {
    const loadSettings = async () => {
      let id = routeUserId;
      if (!id) {
        id = await AsyncStorage.getItem('userId');
      }
      
      setCurrentUserId(id); 

      if (isFocused && id) {
        setIsLoading(true); 
        fetch(`${API_BASE_URL}/user-settings/${id}`) 
          .then(res => res.json())
 
          .then((data: any) => {
              if (data && !data.message) {

              setIsFaceIDEnabled(data.face_id_enabled || false);
              setIsNotificationsEnabled(data.notifications_enabled || false);
              setLanguage(data.preferred_language === 'ar-SA' ? 'العربية' : 'English (US)');
              setCurrency(data.preferred_currency || 'SAR');
            }
          })
          .catch(err => {
            console.error("Fetch settings error:", err);

          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (isFocused && !id) {
        setIsLoading(false);

      }
    };

    loadSettings();
  }, [isFocused, routeUserId]);


  const toggleFaceID = async (value: boolean) => {
    if (!currentUserId) return; 
    
    setIsFaceIDEnabled(value); 
    try {
      const response = await fetch(`${API_BASE_URL}/update-mfa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId, 
          method: 'FACE_ID',
          isEnabled: value
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
      console.error(error);
      setIsFaceIDEnabled(!value); 
      Alert.alert('Error', 'Failed to update Face ID settings.');
    }
  };

  const toggleNotifications = async (value: boolean) => {
    if (!currentUserId) return;

    setIsNotificationsEnabled(value);
    try {
      const response = await fetch(`${API_BASE_URL}/update-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId, 
          notifications_enabled: value
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
      console.error(error);
      setIsNotificationsEnabled(!value);
      Alert.alert('Error', 'Failed to update push notifications.');
    }
  };


  const SettingItem = ({ title, subtitle, type, value, onValueChange, onPress }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress} 
      disabled={type === 'switch'}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: "#3E3E3E", true: "#B0A0D0" }}
          thumbColor={value ? "#FFF" : "#F4F3F4"}
        />
      ) : (
        <Text style={styles.arrowIcon}>›</Text>
      )}
    </TouchableOpacity>
  );


  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#B0A0D0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionLabel}>Account Security</Text>
        <View style={styles.section}>
          <SettingItem 
            title="Face ID / Touch ID" 
            type="switch" 
            value={isFaceIDEnabled} 
            onValueChange={toggleFaceID} 
          />
          <SettingItem title="Change Password" onPress={() => Alert.alert("Security", "Password reset link sent to your email.")} />
          <SettingItem title="Two-Factor Authentication" subtitle="Extra layer of security" onPress={() => {}} />
        </View>

        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.section}>
          <SettingItem 
            title="Push Notifications" 
            type="switch" 
            value={isNotificationsEnabled} 
            onValueChange={toggleNotifications} 
          />
          <SettingItem 
            title="Language" 
            subtitle={language} 
            onPress={() => Alert.alert("Language", "Feature coming soon!")} 
          />
          <SettingItem 
            title="Currency" 
            subtitle={currency} 
            onPress={() => Alert.alert("Currency", "Feature coming soon!")} 
          />
        </View>

        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.section}>
          <SettingItem title="Privacy Policy" onPress={() => {}} />
          <SettingItem title="Terms of Service" onPress={() => {}} />
          <SettingItem title="Version" subtitle="1.0.4 (Build 2026)" />
        </View>

        {/* زر حذف الحساب */}
        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => Alert.alert("Delete Account", "Are you sure? This action cannot be undone.")}
        >
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backIcon: { color: '#B0A0D0', fontSize: 35, fontWeight: '300', marginTop: -5 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionLabel: { 
    color: '#B0A0D0', 
    fontSize: 13, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    marginLeft: 5, 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  section: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 20, 
    marginBottom: 25, 
    overflow: 'hidden' 
  },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(255,255,255,0.05)' 
  },
  settingTitle: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  settingSubtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  arrowIcon: { color: '#B0A0D0', fontSize: 24, fontWeight: '300' },
  deleteBtn: { marginTop: 10, padding: 20, alignItems: 'center' },
  deleteText: { color: '#FF4B4B', fontWeight: 'bold', fontSize: 14 }
});

export default Settings;