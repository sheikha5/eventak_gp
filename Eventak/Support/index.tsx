import React from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, 
  TouchableOpacity, ScrollView, StatusBar, Alert, Clipboard 
} from 'react-native';

const Support = ({ navigation }: any) => {
  
  const faqData = [
    {
      question: "How do I receive my gift?",
      answer: "Once someone gifts you a ticket, you will receive a link via SMS or Email. Open the link and log in to Eventak to see it in your wallet."
    },
    {
      question: "Can I refund my ticket?",
      answer: "Yes, you can request a refund directly from the ticket details page. Please note that refunds are only available up to 24 hours before the event starts."
    },
    {
      question: "Is the QR code secure?",
      answer: "Yes, Eventak uses dynamic QR codes that refresh every 10 seconds to prevent unauthorized copying."
    }
  ];

  
  const handleContactSupport = () => {
    
    Alert.alert(
      "Contact Support",
      "You can reach us at:\nsupport@eventak.sa",
      [
        {
          text: "OK",
          onPress: () => console.log("Alert Closed"),
          style: "default"
        }
      ],
      { cancelable: true } 
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support & FAQ</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {faqData.map((item, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.questionText}>{item.question}</Text>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerNote}>Didn't find what you're looking for?</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={handleContactSupport}>
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
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
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', alignItems: 'center' 
  },
  backIcon: { color: '#B0A0D0', fontSize: 35, fontWeight: '300', marginTop: -5 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionTitle: { color: '#B0A0D0', fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  faqCard: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 15, padding: 20, marginBottom: 15 
  },
  questionText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  answerText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 20 },
  footer: { marginTop: 30, alignItems: 'center' },
  footerNote: { color: '#B0A0D0', marginBottom: 15, fontSize: 14 },
  contactBtn: { 
    backgroundColor: '#B0A0D0', 
    width: '100%', padding: 18, 
    borderRadius: 15, alignItems: 'center' 
  },
  contactBtnText: { color: '#1A0831', fontWeight: 'bold', fontSize: 16 }
});

export default Support;