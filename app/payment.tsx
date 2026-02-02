import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, StatusBar, 
  ScrollView, Image, ActivityIndicator, Alert, Dimensions 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; 
import { addMessageToChat } from '../utils/chatStore'; // <--- FIXED IMPORT

const { width } = Dimensions.get('window');

export default function PaymentScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const params = useLocalSearchParams();

  // 1. ROBUST DATA PARSING
  const item = useMemo(() => {
    try {
        return params.item ? JSON.parse(params.item as string) : {};
    } catch (e) {
        return {};
    }
  }, [params.item]);
  
  // State
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi'); 

  // Price Logic
  const priceString = item.price ? item.price.toString() : '0';
  const basePrice = parseInt(priceString.replace(/[^0-9]/g, '') || '0');
  const serviceFee = 25; 
  const securityDeposit = 500; 
  const total = basePrice + serviceFee + securityDeposit;
  
  const transactionId = useMemo(() => 'PAY-' + Math.floor(Math.random() * 100000000).toString(), []);

  // --- ACTIONS ---

  const handlePayment = () => {
    setProcessing(true);
    // Simulate Network Request
    setTimeout(() => {
        setProcessing(false);
        setPaymentSuccess(true);
    }, 2000);
  };

  const handleOpenChat = () => {
    const lenderName = item.lender || 'Verified User';
    const itemTitle = item.title || 'Item';

    // 1. SAVE TO BRAIN IMMEDIATELY (Fixes "Not Fetching" issue)
    // We create the message here so it exists before you even open the chat.
    const autoMsg = `Hi! I just completed the payment for "${itemTitle}". When can I pick it up?`;
    addMessageToChat(lenderName, autoMsg, 'me');

    // 2. NAVIGATE TO CHAT
    const encodedLender = encodeURIComponent(lenderName);
    const encodedTitle = encodeURIComponent(itemTitle);
    
    router.replace(`/chat?lenderName=${encodedLender}&itemTitle=${encodedTitle}`);
  };

  // ---------------------------------------------------------
  // SUCCESS VIEW (RECEIPT STYLE)
  // ---------------------------------------------------------
  if (paymentSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F2F2F7' }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        
        <ScrollView contentContainerStyle={styles.receiptScroll} showsVerticalScrollIndicator={false}>
            
            {/* Success Animation */}
            <View style={styles.successIconContainer}>
                <View style={styles.successRing}>
                    <Ionicons name="checkmark" size={50} color="#FFF" />
                </View>
                <Text style={[styles.successText, { color: theme.text }]}>Payment Successful!</Text>
                <Text style={{ color: theme.textSub, marginTop: 4 }}>Ref: {transactionId}</Text>
            </View>

            {/* TICKET CARD */}
            <View style={styles.ticketContainer}>
                {/* Top Half */}
                <View style={[styles.ticketTop, { backgroundColor: theme.cardBg }]}>
                    <View style={styles.ticketHeader}>
                        <Text style={{color: theme.textSub, fontWeight:'700', fontSize:10, letterSpacing:1}}>TOTAL PAID</Text>
                        <Text style={{color: theme.text, fontWeight:'900', fontSize:32}}>₹{total}</Text>
                    </View>

                    <View style={styles.ticketRow}>
                        <View style={{flex:1}}>
                            <Text style={styles.ticketLabel}>ITEM</Text>
                            <Text style={[styles.ticketValue, {color: theme.text}]} numberOfLines={1}>{item.title}</Text>
                        </View>
                        <View style={{flex:1, alignItems:'flex-end'}}>
                            <Text style={styles.ticketLabel}>LENDER</Text>
                            <Text style={[styles.ticketValue, {color: theme.text}]}>{item.lender || 'User'}</Text>
                        </View>
                    </View>

                    <View style={styles.ticketRow}>
                        <View style={{flex:1}}>
                            <Text style={styles.ticketLabel}>DATE</Text>
                            <Text style={[styles.ticketValue, {color: theme.text}]}>{new Date().toLocaleDateString()}</Text>
                        </View>
                        <View style={{flex:1, alignItems:'flex-end'}}>
                            <Text style={styles.ticketLabel}>METHOD</Text>
                            <Text style={[styles.ticketValue, {color: theme.text}]}>{selectedMethod === 'upi' ? 'UPI' : 'Card'}</Text>
                        </View>
                    </View>
                </View>

                {/* Tear-off Line */}
                <View style={styles.tearLineContainer}>
                    <View style={[styles.circleLeft, { backgroundColor: isDark ? '#000' : '#F2F2F7' }]} />
                    <View style={[styles.dashedLine, { borderColor: theme.border }]} />
                    <View style={[styles.circleRight, { backgroundColor: isDark ? '#000' : '#F2F2F7' }]} />
                </View>

                {/* Bottom Half (QR) */}
                <View style={[styles.ticketBottom, { backgroundColor: theme.cardBg }]}>
                    <Text style={{textAlign:'center', color: theme.textSub, fontSize:12, marginBottom: 15}}>
                        Scan to verify pickup
                    </Text>
                    <Image 
                        source={{uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${transactionId}`}} 
                        style={{width: 100, height: 100, alignSelf:'center', opacity: 0.8}} 
                    />
                </View>
            </View>

            {/* ACTION BUTTONS */}
            <TouchableOpacity 
                style={[styles.bigChatBtn, { backgroundColor: theme.text }]} 
                onPress={handleOpenChat}
            >
                <Ionicons name="chatbubbles" size={24} color={theme.background} />
                <Text style={{ color: theme.background, fontWeight: 'bold', fontSize: 16 }}>Message Lender</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{marginTop: 25}} onPress={() => router.push('/(tabs)')}>
                <Text style={{color: theme.textSub, fontWeight:'600'}}>Return Home</Text>
            </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }

  // ---------------------------------------------------------
  // CHECKOUT VIEW
  // ---------------------------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Checkout</Text>
        <View style={{ width: 40 }} /> 
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* 1. Item Card */}
        <View style={[styles.itemCard, { backgroundColor: theme.cardBg }]}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
            ) : (
                <View style={[styles.itemImage, { backgroundColor: '#EEE', alignItems:'center', justifyContent:'center' }]}>
                    <Ionicons name="image" size={24} color="#999" />
                </View>
            )}
            <View style={{flex: 1}}>
                <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={2}>{item.title || 'Item'}</Text>
                
                <View style={{flexDirection:'row', alignItems:'center', marginTop: 4}}>
                    <Ionicons name="person-circle" size={16} color={theme.textSub} />
                    <Text style={{ color: theme.textSub, fontSize: 12, marginLeft: 4 }}>{item.lender || 'Verified User'}</Text>
                </View>
                
                <View style={styles.secureBadge}>
                    <Ionicons name="shield-checkmark" size={10} color="#059669" />
                    <Text style={{color: '#059669', fontSize: 10, fontWeight: '700', marginLeft: 4}}>VERIFIED LENDER</Text>
                </View>
            </View>
        </View>

        {/* 2. Payment Methods */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Method</Text>
        
        <TouchableOpacity 
            style={[styles.methodItem, selectedMethod === 'upi' && styles.methodSelected, { borderColor: selectedMethod === 'upi' ? theme.primary : theme.border, backgroundColor: theme.cardBg }]}
            onPress={() => setSelectedMethod('upi')}
        >
            <View style={{flexDirection:'row', alignItems:'center', gap: 15}}>
                <View style={[styles.iconBox, {backgroundColor: '#FFF'}]}>
                    <MaterialCommunityIcons name="contactless-payment" size={24} color="#000" />
                </View>
                <View>
                    <Text style={[styles.methodName, { color: theme.text }]}>UPI / GPay</Text>
                    <Text style={{ color: theme.textSub, fontSize: 12 }}>Instant Transfer</Text>
                </View>
            </View>
            <View style={[styles.radioOuter, { borderColor: theme.text }]}>
                {selectedMethod === 'upi' && <View style={[styles.radioInner, { backgroundColor: theme.text }]} />}
            </View>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.methodItem, selectedMethod === 'card' && styles.methodSelected, { borderColor: selectedMethod === 'card' ? theme.primary : theme.border, backgroundColor: theme.cardBg }]}
            onPress={() => setSelectedMethod('card')}
        >
            <View style={{flexDirection:'row', alignItems:'center', gap: 15}}>
                <View style={[styles.iconBox, {backgroundColor: '#FFF'}]}>
                    <Ionicons name="card" size={24} color="#000" />
                </View>
                <View>
                    <Text style={[styles.methodName, { color: theme.text }]}>Credit / Debit Card</Text>
                    <Text style={{ color: theme.textSub, fontSize: 12 }}>Visa, MasterCard</Text>
                </View>
            </View>
            <View style={[styles.radioOuter, { borderColor: theme.text }]}>
                {selectedMethod === 'card' && <View style={[styles.radioInner, { backgroundColor: theme.text }]} />}
            </View>
        </TouchableOpacity>

        {/* 3. Summary */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Summary</Text>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
            <View style={styles.summaryRow}>
                <Text style={{color: theme.textSub}}>Rental Fee</Text>
                <Text style={{color: theme.text}}>₹{basePrice}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={{color: theme.textSub}}>Platform Fee</Text>
                <Text style={{color: theme.text}}>₹{serviceFee}</Text>
            </View>
            <View style={styles.summaryRow}>
                <View style={{flexDirection:'row', alignItems:'center', gap: 4}}>
                    <Text style={{color: theme.textSub}}>Security Deposit</Text>
                    <Ionicons name="information-circle-outline" size={14} color={theme.textSub} />
                </View>
                <Text style={{color: theme.text}}>₹{securityDeposit}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryRow}>
                <Text style={{color: theme.text, fontWeight:'800', fontSize: 16}}>Total Payable</Text>
                <Text style={{color: theme.text, fontWeight:'900', fontSize: 20}}>₹{total}</Text>
            </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
         <TouchableOpacity 
            style={[styles.payBtn, { backgroundColor: '#000' }]} 
            onPress={handlePayment}
            disabled={processing}
         >
             {processing ? (
                 <ActivityIndicator color="#FFF" />
             ) : (
                 <View style={{flexDirection:'row', alignItems:'center', gap: 10}}>
                     <Text style={[styles.payBtnText, { color: '#FFF' }]}>Pay ₹{total}</Text>
                     <Ionicons name="arrow-forward" size={20} color="#FFF" />
                 </View>
             )}
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  
  content: { padding: 20 },
  
  // Item Card
  itemCard: { flexDirection: 'row', padding: 12, borderRadius: 20, gap: 15, marginBottom: 30 },
  itemImage: { width: 70, height: 70, borderRadius: 14, backgroundColor: '#EEE' },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  secureBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8 },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },

  // Methods
  methodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  methodSelected: { borderWidth: 2 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  methodName: { fontWeight: '700', fontSize: 15 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },

  // Summary
  summaryCard: { padding: 20, borderRadius: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  divider: { height: 1, marginVertical: 12, opacity: 0.1 },

  // Footer
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 40, borderTopWidth: 1 },
  payBtn: { height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: {width:0, height:4}, shadowOpacity: 0.3, shadowRadius: 5 },
  payBtnText: { fontWeight: '800', fontSize: 18 },

  // --- RECEIPT STYLES ---
  receiptScroll: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  successIconContainer: { alignItems: 'center', marginBottom: 30 },
  successRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: "#10B981", shadowOpacity: 0.4, shadowRadius: 10 },
  successText: { fontSize: 24, fontWeight: '800' },
  
  ticketContainer: { width: '100%', borderRadius: 20, overflow: 'hidden', marginBottom: 30 },
  ticketTop: { padding: 25 },
  ticketHeader: { alignItems: 'center', marginBottom: 25 },
  ticketRow: { flexDirection: 'row', marginBottom: 20 },
  ticketLabel: { fontSize: 10, color: '#888', fontWeight: '700', marginBottom: 4 },
  ticketValue: { fontSize: 15, fontWeight: '600' },

  tearLineContainer: { height: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', backgroundColor: 'transparent' },
  circleLeft: { width: 20, height: 20, borderRadius: 10, marginLeft: -10 },
  dashedLine: { flex: 1, borderWidth: 1, borderStyle: 'dashed', borderRadius: 1 },
  circleRight: { width: 20, height: 20, borderRadius: 10, marginRight: -10 },

  ticketBottom: { padding: 25, alignItems: 'center' },

  bigChatBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 30, paddingVertical: 18, borderRadius: 30, width: '100%', justifyContent: 'center', elevation: 5 },
});