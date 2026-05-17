import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, 
  ActivityIndicator, SafeAreaView, StatusBar 
} from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

const StripePayment = ({ navigation, route }: any) => {
  const { confirmPayment, loading } = useConfirmPayment();
  const [isCardValid, setIsCardValid] = useState(false);

  
  const amount = route.params?.totalAmount || "0.00";

  const handlePayment = async () => {
    if (!isCardValid) {
      Alert.alert('تنبيه', 'الرجاء إدخال بيانات البطاقة بشكل صحيح');
      return;
    }

    
    Alert.alert(
      "تمت العملية بنجاح",
      `تم خصم ${amount} ريال من بطاقتك لتذاكر Eventak`,
      [{ text: "ممتاز", onPress: () => navigation.navigate('Main') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.header}>دفع آمن عبر Stripe</Text>
        <View style={{ width: 45 }} /> 
      </View>

      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <Text style={styles.label}>تفاصيل البطاقة (مدى / Visa)</Text>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: '#### #### #### ####',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#1A0831',
              placeholderColor: '#A0A0A0',
            }}
            style={styles.cardField}
            onCardChange={(cardDetails) => {
              setIsCardValid(cardDetails.complete);
            }}
          />
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>إجمالي المبلغ:</Text>
          <Text style={styles.amountText}>{amount} SAR</Text>
        </View>

        <TouchableOpacity 
          style={[styles.payButton, !isCardValid && styles.disabledButton]} 
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.payButtonText}>ادفع الآن</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    marginTop: 10
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
  header: { fontSize: 20, color: '#B0A0D0', fontWeight: 'bold' },
  cardContainer: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  label: { color: '#B0A0D0', marginBottom: 15, fontSize: 14 },
  cardField: { width: '100%', height: 50, marginVertical: 10 },
  summaryContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 40, 
    paddingHorizontal: 10 
  },
  summaryText: { color: '#FFF', fontSize: 18 },
  amountText: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' }, // اللون الذهبي للمبلغ
  payButton: { 
    backgroundColor: '#5A4C91', 
    paddingVertical: 16, 
    borderRadius: 30, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  disabledButton: { backgroundColor: '#333', opacity: 0.5 },
  payButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default StripePayment;