import React, { useState, useMemo, useCallback } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity, 
  StatusBar, TextInput, Platform, Modal, TouchableWithoutFeedback 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { GlobalChats } from '../../utils/chatStore'; // <--- CONNECT THE BRAIN

// --- MOCK DATA (For Incoming Requests) ---
const RECEIVED_REQUESTS = [
  { id: '1', name: 'Sarah Jenkins', item: 'Calculus Textbook', status: 'Pending', time: '10 min ago', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', lastMessage: 'Hi! Can I pick this up tomorrow morning?' },
  { id: '3', name: 'Alex R.', item: 'Badminton Set', status: 'Pending', time: 'Yesterday', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', lastMessage: 'Is this still available for the weekend?' },
];

const FILTER_OPTIONS = ['All', 'Active', 'Pending', 'Completed'];

export default function InboxScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme(); 
  
  // State
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('sent'); // Default to 'sent'
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Data State
  const [realChats, setRealChats] = useState<any[]>([]);

  // 1. REFRESH DATA ON FOCUS
  useFocusEffect(
    useCallback(() => {
      // Load real chats from the Brain
      setRealChats([...GlobalChats]);
    }, [])
  );

  // --- CORE FILTERING LOGIC ---
  const filteredData = useMemo(() => {
    // 1. Select Data Source based on Tab
    let sourceData = activeTab === 'received' ? RECEIVED_REQUESTS : realChats;

    return sourceData.filter(item => {
      // Safe check for properties
      const name = item.name || item.user || 'User';
      
      // Handle Message Structure (Array vs String)
      let messageText = '';
      if (item.messages && item.messages.length > 0) {
          messageText = item.messages[item.messages.length - 1].text; // Get last message from array
      } else {
          messageText = item.lastMessage || item.message || ''; // Fallback for mock data
      }

      // 2. Filter by Search Text
      const matchesSearch = 
        name.toLowerCase().includes(searchText.toLowerCase()) || 
        messageText.toLowerCase().includes(searchText.toLowerCase());

      // 3. Filter by Status (Only applies if data has status)
      const matchesFilter = activeFilter === 'All' || (item.status && item.status === activeFilter) || !item.status;

      return matchesSearch && matchesFilter;
    });
  }, [activeTab, searchText, activeFilter, realChats]);

  // Color Helper
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return { bg: '#ECFDF5', text: '#10B981' }; 
      case 'Pending': return { bg: '#FFFBEB', text: '#F59E0B' }; 
      case 'Completed': return { bg: '#F3F4F6', text: '#6B7280' }; 
      default: return { bg: theme.cardBg, text: theme.text };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusStyle = getStatusStyle(item.status || 'Active');
    const isReceived = activeTab === 'received';
    
    // Normalize Data Fields (Handle both formats)
    const displayName = item.name || item.user;
    
    // LOGIC TO GET LAST MESSAGE & TIME
    let displayMsg = '';
    let displayTime = '';
    
    if (item.messages && item.messages.length > 0) {
        // Real Chat Logic
        const lastMsg = item.messages[item.messages.length - 1];
        displayMsg = lastMsg.text;
        displayTime = lastMsg.time;
    } else {
        // Mock Data Logic
        displayMsg = item.lastMessage || item.message;
        displayTime = item.time;
    }

    return (
      <TouchableOpacity 
        style={[styles.chatCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
        activeOpacity={0.8}
        onPress={() => {
            // DIRECT NAVIGATION TO CHAT
            const lenderParam = encodeURIComponent(displayName);
            router.push(`/chat?lenderName=${lenderParam}`);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{flex: 1}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
                  <Text style={[styles.userName, { color: theme.text }]}>{displayName}</Text>
                  <Text style={[styles.timeText, { color: theme.textSub }]}>{displayTime}</Text>
              </View>
              
              <Text style={[styles.lastMsg, { color: theme.textSub, marginTop: 4 }]} numberOfLines={1}>
                {displayMsg}
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons only for Incoming Pending Requests */}
        {isReceived && item.status === 'Pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.declineBtn]} onPress={() => alert('Request Declined')}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={() => alert('Request Accepted')}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* --- HEADER --- */}
      <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Inbox</Text>
          
          <TouchableOpacity 
            style={[styles.iconBtn, activeFilter !== 'All' && styles.activeFilterIcon]} 
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter-circle-outline" size={28} color={activeFilter !== 'All' ? "#4ADE80" : "#FFF"} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Ionicons name="search" size={18} color="#CCC" />
          <TextInput 
            placeholder={activeTab === 'received' ? "Search requests..." : "Search messages..."}
            placeholderTextColor="#AAA"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={18} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'sent' && styles.activeTabBtn]} 
            onPress={() => { setActiveTab('sent'); setActiveFilter('All'); }}
          >
            <Text style={[styles.tabText, activeTab === 'sent' ? styles.activeTabText : styles.inactiveTabText]}>
              Chat
            </Text>
            {activeTab === 'sent' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'received' && styles.activeTabBtn]} 
            onPress={() => { setActiveTab('received'); setActiveFilter('All'); }}
          >
            <Text style={[styles.tabText, activeTab === 'received' ? styles.activeTabText : styles.inactiveTabText]}>
              Requests
            </Text>
            {activeTab === 'received' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* --- LIST --- */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name={activeTab === 'received' ? "file-tray-outline" : "chatbubbles-outline"} size={60} color={theme.border} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
               {searchText ? 'No results found' : 'No messages yet'}
            </Text>
            <Text style={[styles.emptySub, { color: theme.textSub }]}>
              {activeFilter !== 'All' ? `Try clearing the "${activeFilter}" filter.` : "Conversations will appear here."}
            </Text>
          </View>
        }
      />

      {/* --- FILTER MODAL --- */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Filter by Status</Text>
                        
                        {FILTER_OPTIONS.map((option) => (
                            <TouchableOpacity 
                                key={option} 
                                style={[
                                    styles.filterOption, 
                                    activeFilter === option && { backgroundColor: theme.text }
                                ]}
                                onPress={() => {
                                    setActiveFilter(option);
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.filterText, 
                                    { color: activeFilter === option ? theme.background : theme.text }
                                ]}>
                                    {option}
                                </Text>
                                {activeFilter === option && (
                                    <Ionicons name="checkmark" size={18} color={theme.background} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header
  header: {
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 10,
    zIndex: 10,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  iconBtn: { padding: 5 },
  activeFilterIcon: { backgroundColor: 'rgba(74, 222, 128, 0.2)', borderRadius: 20 },
  
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', 
    height: 44, borderRadius: 14, paddingHorizontal: 14, marginBottom: 20
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF', fontSize: 15 },

  // Tabs
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5 },
  tabBtn: { alignItems: 'center', paddingBottom: 5, minWidth: 100 },
  activeTabBtn: {}, 
  tabText: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  activeTabText: { color: '#FFF' },
  inactiveTabText: { color: '#888' },
  activeDot: { width: 20, height: 3, backgroundColor: '#FFF', borderRadius: 2 },

  // List
  listContent: { padding: 20, paddingBottom: 100 },
  
  chatCard: {
    padding: 16, marginBottom: 16, borderRadius: 20, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE', marginRight: 15 },
  userName: { fontSize: 16, fontWeight: '700' },
  timeText: { fontSize: 12, fontWeight: '500' },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  lastMsg: { fontSize: 14, fontWeight: '400' },

  // Action Buttons
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  declineBtn: { backgroundColor: '#FEE2E2' },
  declineText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  acceptBtn: { backgroundColor: '#000' },
  acceptText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

  // Empty
  emptyState: { alignItems: 'center', marginTop: 80, opacity: 0.6 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 15 },
  emptySub: { fontSize: 14, marginTop: 5, textAlign: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', borderRadius: 20, padding: 20, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15, textAlign: 'center' },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, marginBottom: 8 },
  filterText: { fontSize: 16, fontWeight: '600' },
});