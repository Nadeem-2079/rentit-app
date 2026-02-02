import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, StatusBar, Image, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { getOrCreateChatSession, addMessageToChat, Message } from '../utils/chatStore'; // <--- IMPORT THIS

export default function ChatScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const params = useLocalSearchParams();

  // 1. Identify User & Item
  const displayName = params.lenderName || params.name || 'Lender';
  const itemTitle = params.itemTitle || null;

  // 2. Load Chat History from Brain
  const session = getOrCreateChatSession(displayName as string);
  const [messages, setMessages] = useState<Message[]>(session.messages);
  
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // 3. Handle Auto-Message (Only if coming from Payment)
  useEffect(() => {
    if (itemTitle) {
      const autoText = `Hi! I just completed the payment for "${itemTitle}". When can I pick it up?`;
      
      // Check if this specific message already exists in history
      const alreadySent = session.messages.some(m => m.text === autoText);
      
      if (!alreadySent) {
        // Add to Store
        addMessageToChat(displayName as string, autoText, 'me');
        // Update Local State
        setMessages([...session.messages]);
      }
    }
  }, [itemTitle]);

  // 4. Send Function
  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Save to Brain
    addMessageToChat(displayName as string, inputText, 'me');
    
    // Update UI
    setMessages([...session.messages]); 
    setInputText('');
    
    // Scroll down
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* HEADER */}
      <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
               <Image source={{ uri: session.avatar }} style={styles.avatar} />
               <View style={styles.onlineDot} />
            </View>
            <View>
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userStatus}>Online now</Text>
            </View>
          </View>
        </View>

        {/* Context Bar */}
        {itemTitle && (
            <View style={styles.contextBar}>
                <Ionicons name="cube" size={12} color="#000" style={{marginRight:6}} />
                <Text style={styles.contextText}>Topic: {itemTitle}</Text>
            </View>
        )}
      </LinearGradient>

      {/* MESSAGES LIST */}
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.msgList}
          renderItem={({ item }) => {
            const isMe = item.sender === 'me';
            return (
              <View style={[
                styles.msgBubble, 
                isMe ? styles.myMsg : styles.theirMsg,
                { backgroundColor: isMe ? (isDark ? '#FFF' : '#000') : theme.cardBg }
              ]}>
                <Text style={[styles.msgText, { color: isMe ? (isDark ? '#000' : '#FFF') : theme.text }]}>
                  {item.text}
                </Text>
                <Text style={[styles.timeText, { color: isMe ? 'rgba(150,150,150,1)' : theme.textSub }]}>
                    {item.time}
                </Text>
              </View>
            );
          }}
        />

        {/* INPUT BAR */}
        <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
            <TextInput
                style={[styles.input, { backgroundColor: theme.cardBg, color: theme.text }]}
                placeholder="Type a message..."
                placeholderTextColor={theme.textSub}
                value={inputText}
                onChangeText={setInputText}
                multiline
            />
            
            <TouchableOpacity 
                style={[styles.sendBtn, { backgroundColor: inputText.trim() ? (isDark ? '#FFF' : '#000') : theme.cardBg }]}
                disabled={!inputText.trim()}
                onPress={handleSend}
            >
                <Ionicons name="arrow-up" size={20} color={inputText.trim() ? (isDark ? '#000' : '#FFF') : theme.textSub} />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, zIndex: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#000' },
  userName: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  userStatus: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  contextBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'center', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  contextText: { color: '#000', fontSize: 12, fontWeight: '700' },
  keyboardContainer: { flex: 1 },
  msgList: { padding: 20, paddingBottom: 20 },
  msgBubble: { maxWidth: '75%', padding: 14, borderRadius: 20, marginBottom: 12 },
  myMsg: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirMsg: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 22 },
  timeText: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end', fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', padding: 16, paddingBottom: Platform.OS === 'ios' ? 30 : 16, borderTopWidth: 1 },
  input: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12, marginHorizontal: 10, fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
});