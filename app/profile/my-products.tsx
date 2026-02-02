import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, 
  Modal, StatusBar, Alert, Dimensions, TextInput, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg'; 
import { useTheme } from '../../context/ThemeContext'; 
import { GlobalInventory } from '../../utils/memoryStore'; 

const { width } = Dimensions.get('window');
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const TOTAL_DAYS = 28; 

export default function MyProductsScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  
  // Data
  const [items, setItems] = useState<any[]>([]);
  
  // State
  const [selectedItem, setSelectedItem] = useState<any>(null); 
  const [editingItem, setEditingItem] = useState<any>(null);   
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // Edit Form
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [blockedDays, setBlockedDays] = useState<number[]>([]);
  const [simulatingScan, setSimulatingScan] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setItems([...GlobalInventory]); 
    }, [])
  );

  // --- ACTIONS ---
  const handleShowQr = (item: any) => {
    setSelectedItem(item);
    setQrModalVisible(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditPrice(item.price.replace('₹', '').replace('/day', '').replace('/hr', ''));
    setBlockedDays(item.blockedDays || []);
    setEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Listing", "Permanently remove this item?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", style: "destructive", 
        onPress: () => {
           const index = GlobalInventory.findIndex(i => i.id === id);
           if (index > -1) {
             GlobalInventory.splice(index, 1);
             setItems([...GlobalInventory]);
             setEditModalVisible(false);
           }
        }
      }
    ]);
  };

  const saveChanges = () => {
    const target = GlobalInventory.find(i => i.id === editingItem.id);
    if(target) {
        target.title = editTitle;
        target.price = `₹${editPrice}/day`;
        target.blockedDays = blockedDays;
        target.status = blockedDays.length > 0 ? 'Blocked' : 'Available';
        setItems([...GlobalInventory]); 
    }
    setEditModalVisible(false);
  };

  const simulateScan = () => {
    setSimulatingScan(true);
    setTimeout(() => {
        const target = GlobalInventory.find(i => i.id === selectedItem.id);
        if(target) {
            target.status = target.status === 'Available' ? 'Rented' : 'Available';
            setSelectedItem({...target});
            setItems([...GlobalInventory]);
            Alert.alert("Verified", target.status === 'Rented' ? "Rental Started" : "Returned");
        }
        setSimulatingScan(false);
    }, 1500);
  };

  // Calendar
  const toggleDate = (day: number) => {
    if (blockedDays.includes(day)) setBlockedDays(blockedDays.filter(d => d !== day));
    else setBlockedDays([...blockedDays, day]);
  };

  const renderCalendar = () => {
    let days = [];
    for(let i=1; i<=TOTAL_DAYS; i++) {
        const isBlocked = blockedDays.includes(i);
        days.push(
            <TouchableOpacity 
                key={i} 
                style={[styles.calDay, isBlocked && styles.calDayBlocked]}
                onPress={() => toggleDate(i)}
            >
                <Text style={[styles.calText, { color: isBlocked ? '#DC2626' : theme.text }]}>{i}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <View style={styles.calGrid}>
            <View style={styles.weekRow}>{DAYS.map((d,i)=><Text key={i} style={styles.weekText}>{d}</Text>)}</View>
            <View style={styles.daysRow}>{days}</View>
        </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent={true} />
      
      {/* 1. HEADER */}
      <LinearGradient colors={['#000', '#1A1A1A']} style={styles.header}>
        <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.glassBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>My Inventory</Text>
                <Text style={styles.headerSub}>{items.length} Active Listings</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/scan')} style={[styles.glassBtn, {backgroundColor: theme.primary}]}>
                <Ionicons name="scan" size={22} color={isDark ? "#000" : "#FFF"} />
            </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* 2. LIST CONTENT */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
            <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={64} color={theme.textSub} style={{opacity:0.5}}/>
                <Text style={{color:theme.textSub, marginTop:10}}>Your inventory is empty.</Text>
            </View>
        ) : (
            items.map((item) => (
                <View key={item.id} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                    
                    {/* Top Row: Image & Details */}
                    <View style={styles.cardTop}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                        <View style={styles.cardInfo}>
                            <View style={styles.titleRow}>
                                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                                {item.status === 'Available' 
                                    ? <Ionicons name="checkmark-circle" size={16} color="#059669" />
                                    : <Ionicons name="lock-closed" size={16} color={item.status === 'Rented' ? '#1D4ED8' : '#DC2626'} />
                                }
                            </View>
                            <Text style={[styles.cardPrice, { color: theme.primary }]}>{item.price}</Text>
                            
                            {/* Status Badge */}
                            <View style={[styles.statusPill, { 
                                backgroundColor: item.status === 'Available' ? '#ECFDF5' : item.status === 'Rented' ? '#EFF6FF' : '#FEF2F2' 
                            }]}>
                                <Text style={[styles.statusText, { 
                                    color: item.status === 'Available' ? '#059669' : item.status === 'Rented' ? '#1D4ED8' : '#DC2626' 
                                }]}>{item.status}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Bottom Row: Action Bar */}
                    <View style={[styles.actionBar, { borderTopColor: theme.border }]}>
                        
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                            <Ionicons name="create-outline" size={18} color={theme.textSub} />
                            <Text style={[styles.actionLabel, {color: theme.textSub}]}>Edit</Text>
                        </TouchableOpacity>
                        
                        <View style={[styles.verticalDivider, {backgroundColor: theme.border}]} />

                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleShowQr(item)}>
                            <Ionicons name="qr-code-outline" size={18} color={theme.textSub} />
                            <Text style={[styles.actionLabel, {color: theme.textSub}]}>Pass</Text>
                        </TouchableOpacity>

                        <View style={[styles.verticalDivider, {backgroundColor: theme.border}]} />

                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            <Text style={[styles.actionLabel, {color: "#EF4444"}]}>Delete</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            ))
        )}
        <View style={{height: 100}} />
      </ScrollView>

      {/* --- EDIT MODAL (BOTTOM SHEET STYLE) --- */}
      <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1, backgroundColor: theme.background}}>
            
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.modalTitle, {color:theme.text}]}>Edit Listing</Text>
                <TouchableOpacity onPress={saveChanges} style={styles.savePill}>
                    <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={{padding: 20}}>
                {/* Inputs */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, {color:theme.text}]}>Title</Text>
                    <TextInput style={[styles.input, {color:theme.text, backgroundColor: theme.cardBg}]} value={editTitle} onChangeText={setEditTitle} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, {color:theme.text}]}>Daily Price (₹)</Text>
                    <TextInput style={[styles.input, {color:theme.text, backgroundColor: theme.cardBg}]} value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" />
                </View>

                {/* Calendar */}
                <View style={[styles.calWrapper, {backgroundColor: theme.cardBg}]}>
                    <View style={styles.calHeaderRow}>
                        <Text style={[styles.label, {color:theme.text, marginBottom:0}]}>Blocked Dates</Text>
                        <Text style={{fontSize:12, color: theme.primary}}>Feb 2026</Text>
                    </View>
                    {renderCalendar()}
                </View>
                
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                    <Text style={{color: theme.textSub, fontWeight:'600'}}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- QR MODAL --- */}
      <Modal visible={qrModalVisible} transparent animationType="fade" onRequestClose={() => setQrModalVisible(false)}>
        <Pressable style={styles.qrOverlay} onPress={() => setQrModalVisible(false)}>
            <Pressable style={[styles.qrBox, { backgroundColor: 'white' }]} onPress={()=>{}}>
                <View style={styles.qrHeaderRow}>
                    <Text style={styles.qrTitle}>Verification Pass</Text>
                    <Ionicons name="shield-checkmark" size={24} color="#059669" />
                </View>
                
                {selectedItem && <QRCode value={JSON.stringify({id:selectedItem.id, t:Date.now()})} size={200}/>}
                
                <View style={[styles.statusIndicator, { backgroundColor: selectedItem?.status === 'Available' ? '#D1FAE5' : '#DBEAFE' }]}>
                    <Text style={{fontWeight:'700', color: selectedItem?.status === 'Available' ? '#059669' : '#1D4ED8', textTransform:'uppercase', fontSize: 12}}>
                        Current Status: {selectedItem?.status}
                    </Text>
                </View>

                <TouchableOpacity style={styles.simulateBtn} onPress={simulateScan} disabled={simulatingScan}>
                    {simulatingScan ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.simulateText}>Simulate Scan (Demo)</Text>}
                </TouchableOpacity>
            </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  header: { paddingTop: 60, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  glassBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, backdropFilter: 'blur(10px)' },

  listContent: { padding: 20, paddingTop: 10 },
  emptyState: { alignItems: 'center', marginTop: 100 },

  // CARD DESIGN
  card: { borderRadius: 24, marginBottom: 20, borderWidth: 1, elevation: 4, shadowColor: '#000', shadowOffset: {width:0, height:4}, shadowOpacity: 0.1, shadowRadius: 8 },
  
  cardTop: { flexDirection: 'row', padding: 16 },
  cardImage: { width: 85, height: 85, borderRadius: 16, backgroundColor: '#F3F4F6' },
  cardInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  cardPrice: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  
  statusPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  // ACTION BAR
  actionBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  actionLabel: { fontSize: 13, fontWeight: '600' },
  verticalDivider: { width: 1, height: 20, opacity: 0.5 },

  // MODAL
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  savePill: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  cancelBtn: { alignItems: 'center', padding: 15, marginTop: 10 },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, opacity: 0.8 },
  input: { padding: 16, borderRadius: 16, fontSize: 16 },

  // CALENDAR
  calWrapper: { padding: 20, borderRadius: 20 },
  calHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  calGrid: { width: '100%' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekText: { width: 35, textAlign: 'center', fontSize: 12, color: '#888', fontWeight: '600' },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  calDay: { width: (width - 100) / 7, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 8, backgroundColor: 'rgba(0,0,0,0.03)' },
  calDayBlocked: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#EF4444' },
  calText: { fontSize: 14, fontWeight: '600' },

  // QR
  qrOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  qrBox: { padding: 30, borderRadius: 30, alignItems: 'center', width: width * 0.85, elevation: 10 },
  qrHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  qrTitle: { fontSize: 20, fontWeight: '800', color: '#000' },
  statusIndicator: { marginTop: 25, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  simulateBtn: { marginTop: 20, backgroundColor: '#000', width: '100%', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  simulateText: { color: '#FFF', fontWeight: '700' }
});