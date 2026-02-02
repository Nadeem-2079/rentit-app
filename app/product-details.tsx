import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, 
  StatusBar, FlatList, Platform, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext'; 

// --- MOCK DATABASE ---
const DATABASE_PRODUCTS = [
  // Tech
  { id: 't1', title: 'Canon EOS R5', price: '₹2200/d', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80', category: 'Tech' },
  { id: 't2', title: 'DJI Ronin S', price: '₹800/d', image: 'https://images.unsplash.com/photo-1564466021184-1f26447d0d7c?w=400&q=80', category: 'Tech' },
  { id: 't3', title: 'MacBook Pro M2', price: '₹2500/d', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&q=80', category: 'Tech' },
  // Sports
  { id: 's1', title: 'Yonex Badminton Set', price: '₹200/d', image: 'https://images.unsplash.com/photo-1626224583764-847890e045b5?w=400&q=80', category: 'Sports' },
  { id: 's2', title: 'Cricket Kit (Full)', price: '₹500/d', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80', category: 'Sports' },
  // Fashion
  { id: 'f1', title: 'Designer Tuxedo', price: '₹1200/d', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80', category: 'Fashion' },
];

const MOCK_ITEM_DEFAULT = {
  id: 'default-1',
  title: 'Sony Alpha a7 III (Demo)',
  price: '₹1500/day',
  image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
  lender: 'Rahul Verma',
  category: 'Tech',
  description: 'Full frame mirrorless camera. Excellent condition. Comes with 28-70mm lens kit and extra battery.'
};

const GENERATE_SLOTS = () => {
    const slots = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        slots.push({
            id: i,
            day: i === 0 ? 'Today' : i === 1 ? 'Tmrrw' : days[date.getDay()],
            date: date.getDate(),
            fullDate: date
        });
    }
    return slots;
};

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, isDark } = useTheme();

  // 1. DATA PARSING
  const item = useMemo(() => {
    try {
        const parsed = params.item ? JSON.parse(params.item as string) : null;
        return parsed || MOCK_ITEM_DEFAULT; 
    } catch (e) { return MOCK_ITEM_DEFAULT; }
  }, [params.item]);

  // 2. RECOMMENDATIONS
  const similarProducts = useMemo(() => {
    return DATABASE_PRODUCTS.filter(p => p.category === (item.category || 'Tech') && p.id !== item.id);
  }, [item]);

  // 3. STATE
  const [duration, setDuration] = useState(1);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0); 
  const slots = useMemo(() => GENERATE_SLOTS(), []);

  // Price Logic
  const basePrice = parseInt((item.price || '0').toString().replace(/[^0-9]/g, '') || '0');
  const totalPrice = basePrice * duration;

  // 4. ACTIONS
  const handleRent = () => {
    const selectedDateObj = slots[selectedSlotIndex].fullDate;
    const endDateObj = new Date(selectedDateObj);
    endDateObj.setDate(selectedDateObj.getDate() + duration);
    
    const dateRange = `${selectedDateObj.toLocaleDateString('en-US', {month:'short', day:'numeric'})} - ${endDateObj.toLocaleDateString('en-US', {month:'short', day:'numeric'})}`;

    const rentalData = { 
        ...item, 
        price: `₹${totalPrice}`, 
        duration: duration,
        dateRange: dateRange
    };
    router.push({ pathname: "/payment", params: { item: JSON.stringify(rentalData) } });
  };

  const handleChatLocked = () => {
    // 🔒 CHAT LOCKED LOGIC
    Alert.alert(
        "🔒 Booking Required", 
        "To ensure safety, you must complete the booking before chatting with the lender."
    );
  };

  const renderMiniCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
        style={[styles.miniCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
        onPress={() => router.push({ pathname: '/product-details', params: { item: JSON.stringify(item) } })}
    >
        <Image source={{ uri: item.image }} style={styles.miniImage} />
        <View style={{padding: 8}}>
            <Text style={[styles.miniTitle, {color: theme.text}]} numberOfLines={1}>{item.title}</Text>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop: 4}}>
                <Text style={[styles.miniPrice, {color: theme.primary}]}>{item.price}</Text>
                <View style={{backgroundColor: theme.background, borderRadius:4, paddingHorizontal:4}}>
                    <Text style={{fontSize:8, color: theme.textSub}}>{item.category}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- HERO IMAGE --- */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: item.image }} style={styles.heroImage} />
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.topGradient} />
        <LinearGradient colors={['transparent', theme.background]} style={styles.bottomGradient} />
        
        <View style={styles.headerRow}>
            <TouchableOpacity style={styles.glassBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.glassBtn}>
                <Ionicons name="share-social-outline" size={22} color="#FFF" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.contentCard, { backgroundColor: theme.background }]}>
            
            {/* Header Info */}
            <View style={styles.headerSection}>
                <View style={[styles.catBadge, {backgroundColor: theme.primary}]}>
                    <Text style={styles.catText}>{item.category || 'Item'}</Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={[styles.ratingVal, {color: theme.text}]}>4.9 (128 Reviews)</Text>
                </View>
            </View>

            {/* --- SLOTS --- */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Start Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 10}}>
                    {slots.map((slot, index) => {
                        const isSelected = selectedSlotIndex === index;
                        return (
                            <TouchableOpacity 
                                key={index}
                                onPress={() => setSelectedSlotIndex(index)}
                                style={[
                                    styles.slotCard, 
                                    { 
                                        backgroundColor: isSelected ? theme.text : theme.cardBg,
                                        borderColor: isSelected ? theme.text : theme.border
                                    }
                                ]}
                            >
                                <Text style={[styles.slotDay, { color: isSelected ? theme.background : theme.textSub }]}>{slot.day}</Text>
                                <Text style={[styles.slotDate, { color: isSelected ? theme.background : theme.text }]}>{slot.date}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>

            {/* Lender Profile (LOCKED CHAT) */}
            <View style={[styles.lenderCard, { backgroundColor: theme.cardBg }]}>
                <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.lenderAvatar} />
                <View style={{flex: 1}}>
                    <Text style={[styles.lenderName, { color: theme.text }]}>{item.lender || 'Verified User'}</Text>
                    <Text style={{ color: '#10B981', fontSize: 12, fontWeight:'600' }}>● Online Now</Text>
                </View>
                
                {/* 🔒 LOCKED CHAT BUTTON */}
                <TouchableOpacity 
                    style={[styles.chatBtn, { backgroundColor: theme.border }]} 
                    onPress={handleChatLocked}
                >
                    <Ionicons name="lock-closed" size={16} color={theme.textSub} />
                    <Text style={{ color: theme.textSub, fontWeight:'700', fontSize:12, marginLeft: 4 }}>Chat</Text>
                </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
                <Text style={[styles.description, { color: theme.textSub }]}>
                    {item.description || "Excellent condition. Includes all standard accessories. Perfect for short-term needs."}
                </Text>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Similar in {item.category || 'Tech'}</Text>
                {similarProducts.length > 0 ? (
                    <FlatList 
                        horizontal
                        data={similarProducts}
                        renderItem={renderMiniCard}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12 }}
                    />
                ) : (
                    <Text style={{color: theme.textSub, fontStyle: 'italic'}}>No similar items found right now.</Text>
                )}
            </View>

            {/* 🛑 SPACER FOR STICKY FOOTER */}
            <View style={{ height: 140 }} />
        </View>
      </ScrollView>

      {/* --- STICKY FOOTER --- */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        
        {/* Left: Total Price */}
        <View>
            <Text style={{ color: theme.textSub, fontSize: 11, fontWeight:'700', textTransform:'uppercase' }}>Total</Text>
            <View style={{flexDirection:'row', alignItems:'baseline'}}>
                <Text style={[styles.footerPrice, { color: theme.text }]}>₹{totalPrice}</Text>
                <Text style={{ color: theme.textSub }}> / {duration} days</Text>
            </View>
        </View>

        {/* Center: Duration */}
        <View style={[styles.qtyControl, { backgroundColor: theme.cardBg }]}>
            <TouchableOpacity onPress={() => setDuration(Math.max(1, duration-1))} style={styles.qtyBtn}>
                <Ionicons name="remove" size={16} color={theme.text} />
            </TouchableOpacity>
            <Text style={{color: theme.text, fontWeight:'700', width: 20, textAlign:'center'}}>{duration}</Text>
            <TouchableOpacity onPress={() => setDuration(duration+1)} style={styles.qtyBtn}>
                <Ionicons name="add" size={16} color={theme.text} />
            </TouchableOpacity>
        </View>

        {/* Right: Rent Button (FIXED COLOR) */}
        <TouchableOpacity 
            style={[
                styles.rentBtn, 
                { backgroundColor: isDark ? '#FFF' : '#000' } // Black in Light Mode, White in Dark Mode
            ]} 
            onPress={handleRent}
        >
            <Text style={[
                styles.rentBtnText, 
                { color: isDark ? '#000' : '#FFF' } // Inverse text color
            ]}>
                Rent Now
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Hero
  heroContainer: { height: 400, width: '100%', position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  headerRow: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  glassBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' },

  // Content
  scrollContent: { marginTop: -40, paddingBottom: 0 },
  contentCard: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 30, minHeight: 800 },
  
  headerSection: { paddingHorizontal: 25, marginBottom: 20 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  catText: { color: '#FFF', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingVal: { fontSize: 13, fontWeight: '600' },

  // Slot Booking
  section: { paddingHorizontal: 25, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  slotCard: { width: 60, height: 70, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, marginRight: 0 },
  slotDay: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  slotDate: { fontSize: 18, fontWeight: '700' },

  // Lender
  lenderCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 25, padding: 12, borderRadius: 16, marginBottom: 25, gap: 12 },
  lenderAvatar: { width: 44, height: 44, borderRadius: 22 },
  lenderName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  chatBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },

  description: { fontSize: 15, lineHeight: 24, opacity: 0.8 },

  // Mini Cards
  miniCard: { width: 150, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginRight: 10 },
  miniImage: { width: '100%', height: 100 },
  miniTitle: { fontWeight: '700', fontSize: 13 },
  miniPrice: { fontSize: 12, fontWeight: '700', marginTop: 2 },

  // Sticky Footer (FIXED)
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    paddingHorizontal: 20, 
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, 
    borderTopWidth: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: 12,
    elevation: 20, 
    shadowColor: '#000', 
    shadowOffset: {width:0, height: -5}, 
    shadowOpacity: 0.1, 
    shadowRadius: 10
  },
  footerPrice: { fontSize: 20, fontWeight: '800' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', padding: 5, borderRadius: 12, gap: 12 },
  qtyBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  rentBtn: { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rentBtnText: { fontSize: 16, fontWeight: '700' }
});