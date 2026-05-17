import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Alert, ScrollView, SafeAreaView, StatusBar 
} from 'react-native';

const Installments = ({ route, navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  
  const provider = route.params?.provider || "Tabby"; 
  const amount = route.params?.totalAmount || "200.00";
  const installmentAmount = (parseFloat(amount) / 4).toFixed(2);

  const handleNext = () => {
    if (phoneNumber.length < 9) {
      Alert.alert("خطأ", "الرجاء إدخال رقم جوال صحيح");
      return;
    }
    setStep(2);
  };

  const confirmPayment = () => {
    Alert.alert("نجحت العملية", `تم تأكيد طلبك عبر ${provider} بنجاح!`, [
      { text: "تم", onPress: () => navigation.navigate('Main') }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" />
      
      
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
           {provider === 'Tabby' ? 'تابي | tabby' : 'تمارا | tamara'}
        </Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.infoText}>قسم فاتورتك على 4 دفعات بقيمة {installmentAmount} ريال</Text>
            <View style={styles.divider} />
            
            <Text style={styles.label}>أدخل رقم الجوال المسجل في {provider}</Text>
            <View style={styles.inputRow}>
              <Text style={styles.prefix}>+966</Text>
              <TextInput 
                style={styles.input} 
                placeholder="5xxxxxxxx" 
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                maxLength={9}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: provider === 'Tabby' ? '#31f296' : '#ff9d76' }]} 
              onPress={handleNext}
            >
              <Text style={styles.btnText}>متابعة</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>أدخل رمز التحقق (OTP) المرسل لجوالك</Text>
            <TextInput 
              style={styles.otpInput} 
              placeholder="- - - -" 
              placeholderTextColor="#888"
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#000' }]} 
              onPress={confirmPayment}
            >
              <Text style={[styles.btnText, { color: '#FFF' }]}>تأكيد الدفع</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#1A0831' },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20
  },
  backBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backIcon: { color: '#FFF', fontSize: 35, fontWeight: '300' },
  headerTitle: { fontSize: 24, color: '#FFF', fontWeight: 'bold' },
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 25, width: '100%' },
  infoText: { color: '#1A0831', fontSize: 16, textAlign: 'center', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC', marginBottom: 30 },
  prefix: { fontSize: 18, color: '#000', paddingRight: 10 },
  input: { flex: 1, height: 50, fontSize: 18, color: '#000' },
  otpInput: { fontSize: 30, textAlign: 'center', letterSpacing: 20, marginVertical: 30, color: '#000', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  btn: { paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});

export default Installments;