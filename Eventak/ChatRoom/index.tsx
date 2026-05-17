import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar 
} from 'react-native';

const ChatRoom = ({ route, navigation }: any) => {
 
  const { sellerName, eventTitle } = route.params || { sellerName: 'Seller', eventTitle: 'Event Ticket' };
  
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', text: `Hi, is the ${eventTitle} ticket still available?`, sender: 'me' },
    { id: '2', text: `Yes, it is! I have one VIP ticket left.`, sender: 'other' },
    { id: '3', text: 'Great! Is the price negotiable?', sender: 'me' },
  ]);

  const sendMessage = () => {
    if (message.trim().length === 0) return;
    const newMessage = {
      id: Math.random().toString(),
      text: message,
      sender: 'me',
    };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
  };

  const renderItem = ({ item }: any) => (
    <View style={[
      styles.bubble, 
      item.sender === 'me' ? styles.myBubble : styles.otherBubble
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.sellerNameText}>{sellerName}</Text>
          <Text style={styles.eventLabel}>{eventTitle}</Text>
        </View>
        <View style={{ width: 45 }} />
      </View>

      
      <View style={styles.safetyBanner}>
        <Text style={styles.safetyText}>
          Only payments inside Eventak are protected by our blockchain verification.
        </Text>
      </View>

      <FlatList
        data={chatHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendIcon}></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(176, 160, 208, 0.1)'
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: '#FFF', fontSize: 30, fontWeight: '300' },
  headerInfo: { alignItems: 'center' },
  sellerNameText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  eventLabel: { color: '#B0A0D0', fontSize: 11, marginTop: 2 },

  safetyBanner: { 
    backgroundColor: 'rgba(176, 160, 208, 0.05)', 
    padding: 12, 
    margin: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(176, 160, 208, 0.1)' 
  },
  safetyText: { color: 'rgba(176, 160, 208, 0.6)', fontSize: 10, textAlign: 'center', lineHeight: 15 },

  chatList: { padding: 20, paddingBottom: 30 },
  bubble: { 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 12, 
    maxWidth: '80%',
    elevation: 2
  },
  myBubble: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#4B2A85', 
    borderBottomRightRadius: 2 
  },
  otherBubble: { 
    alignSelf: 'flex-start', 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderBottomLeftRadius: 2 
  },
  messageText: { color: '#FFF', fontSize: 14, lineHeight: 20 },

  inputContainer: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: 'rgba(26, 8, 49, 0.9)', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)'
  },
  input: { 
    flex: 1, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    color: '#FFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(176, 160, 208, 0.2)'
  },
  sendBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: '#B0A0D0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendIcon: { color: '#1A0831', fontSize: 20, fontWeight: 'bold' }
});

export default ChatRoom;