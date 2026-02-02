import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, Image, TouchableOpacity, 
  StatusBar, ScrollView, Animated, FlatList, Dimensions, Linking, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext'; 

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.92; // Slightly wider for impact

// --- DATA ---

// UPDATED BANNERS with Target Categories & Better Images
const BANNERS = [
  { 
    id: 1, 
    title: "Exam Season Ready?", 
    subtitle: "Scientific Calcs, Notes & more", 
    image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80', // Study desk
    category: 'Books',
    tag: 'STUDENT SPECIAL'
  },
  { 
    id: 2, 
    title: "Level Up Your Weekend", 
    subtitle: "PS5, VR & Controllers for rent", 
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80', // Gaming setup
    category: 'Gaming',
    tag: 'TRENDING NOW'
  },
  { 
    id: 3, 
    title: "Capture The Moment", 
    subtitle: "DSLRs, Drones & GoPros", 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', // Camera
    category: 'Tech',
    tag: 'PREMIUM GEAR'
  },
];

const PREMIUM_ITEMS = [
    { id: 'p1', title: 'DJI Mavic Air 2', price: '₹1200/d', image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&q=80', rating: 5.0 },
    { id: 'p2', title: 'Canon EOS R5', price: '₹2500/d', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80', rating: 4.9 },
    { id: 'p3', title: 'MacBook Pro M2', price: '₹800/d', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=600&q=80', rating: 4.8 },
    { id: 'p4', title: 'Sony A7S III', price: '₹2200/d', image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=600&q=80', rating: 5.0 },
];

const MOST_BOOKED = [
    { id: 'mb1', title: 'Scientific Calc', bookings: '120+ Booked', image: 'https://images.unsplash.com/photo-1587145820266-a5951ee1f620?w=600&q=80' },
    { id: 'mb2', title: 'Extension Cord', bookings: '85+ Booked', image: 'https://images.unsplash.com/photo-1563770095-39d46e5972cd?w=600&q=80' },
    { id: 'mb3', title: 'Blue Star Cooler', bookings: '50+ Booked', image: 'https://images.unsplash.com/photo-1552089123-2d26226fc2b7?w=600&q=80' },
    { id: 'mb4', title: 'JBL Boombox', bookings: '45+ Booked', image: 'https://images.unsplash.com/photo-1543512214-318c77a799bf?w=600&q=80' },
];

const HOME_ITEMS = [
    { id: 'b1', title: 'Physics Sem 1', category: 'Books', lender: 'Sarah', rating: 4.8, distance: '200m', price: 'Free', status: 'Available', height: 220, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80' },
    { id: 't1', title: 'Casio fx-991EX', category: 'Tech', lender: 'Mike', rating: 4.5, distance: '1.2km', price: '₹50/d', status: 'Available', height: 180, image: 'https://images.unsplash.com/photo-1587145820266-a5951ee1f620?w=600&q=80' },
    { id: 'l1', title: 'Lab Coat (M)', category: 'Lab', lender: 'Emily', rating: 4.9, distance: '500m', price: 'Free', status: 'Borrowed', height: 200, image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&q=80' },
    { id: 's1', title: 'Badminton Kit', category: 'Sports', lender: 'Rohan', rating: 4.6, distance: '100m', price: '₹30/hr', status: 'Available', height: 240, image: 'https://images.unsplash.com/photo-1626224583764-84786c713664?w=600&q=80' },
    { id: 't2', title: 'Sony XM4', category: 'Tech', lender: 'Arjun', rating: 5.0, distance: '1.5km', price: '₹150/d', status: 'Available', height: 210, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80' },
    { id: 'm1', title: 'GoPro Hero 9', category: 'Tech', lender: 'Traveler', rating: 4.9, distance: '3km', price: '₹250/d', status: 'Available', height: 190, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80' },
    { id: 'g1', title: 'PS5 Controller', category: 'Gaming', lender: 'GamerX', rating: 4.7, distance: '800m', price: '₹80/d', status: 'Available', height: 170, image: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=600&q=80' },
    { id: 'tool1', title: 'Bosch Drill', category: 'Tools', lender: 'FixIt', rating: 4.8, distance: '2.0km', price: '₹100/d', status: 'Available', height: 200, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80' },
    { id: 'cam1', title: 'Canon 50mm Lens', category: 'Tech', lender: 'PhotoGuy', rating: 4.9, distance: '1km', price: '₹200/d', status: 'Available', height: 180, image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80' },
    { id: 'camp1', title: 'Camping Tent', category: 'Outdoors', lender: 'Hiker', rating: 4.6, distance: '5km', price: '₹300/d', status: 'Available', height: 220, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9e6342?w=600&q=80' },
    { id: 'g2', title: 'Nintendo Switch', category: 'Gaming', lender: 'Nerd', rating: 4.8, distance: '2km', price: '₹150/d', status: 'Available', height: 190, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80' },
    { id: 'elec1', title: 'Soldering Iron', category: 'Electronics', lender: 'EnggDept', rating: 4.5, distance: '300m', price: 'Free', status: 'Available', height: 160, image: 'https://images.unsplash.com/photo-1572916123490-6725227732a3?w=600&q=80' },
];

const QUICK_CATEGORIES = [
    { name: 'Books', icon: 'book-open-variant' },
    { name: 'Tech', icon: 'laptop' },
    { name: 'Sports', icon: 'soccer' },
    { name: 'Fashion', icon: 'tshirt-crew' },
    { name: 'Tools', icon: 'hammer-wrench' },
    { name: 'Music', icon: 'guitar-acoustic' },
    { name: 'Gaming', icon: 'controller-classic' },
];

const FAQS = [
    { q: "Is my money safe?", a: "Yes. We use an escrow system. Money is only released when you receive the item." },
    { q: "How do I return items?", a: "Meet the lender, scan the return QR code, and your deposit is instantly refunded." },
    { q: "What if an item is damaged?", a: "Our support team mediates disputes. Lenders are protected by security deposits." },
];

const WHY_CHOOSE_US = [
    { icon: 'shield-check', title: 'Verified Users', desc: 'Every lender & borrower is ID verified.' },
    { icon: 'wallet-giftcard', title: 'Best Prices', desc: 'Save up to 80% compared to buying new.' },
    { icon: 'clock-fast', title: 'Instant Pickup', desc: 'Find items within 500m of your location.' },
    { icon: 'account-group', title: 'Community', desc: 'Join a trusted network of peers.' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const [searchText, setSearchText] = useState('');
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scroll Refs
  const categoryScrollRef = useRef<ScrollView>(null);
  const premiumScrollRef = useRef<ScrollView>(null);
  const bookedScrollRef = useRef<ScrollView>(null);

  // Auto-Scroll Banners
  useEffect(() => {
    const interval = setInterval(() => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= BANNERS.length) nextIndex = 0;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
    }, 6000); // Slower for better readability
    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderBanner = ({ item }: { item: any }) => (
    <View style={{ width: width, alignItems: 'center' }}>
      <TouchableOpacity 
        activeOpacity={0.95} 
        style={styles.bannerCard} 
        onPress={() => router.push({ 
            pathname: '/all-products', 
            params: { category: item.category } // Redirects to relevant category
        })}
      >
         <Image source={{ uri: item.image }} style={styles.bannerImage} />
         
         {/* Cinematic Gradient Overlay */}
         <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']} style={styles.bannerOverlay}>
            
            {/* Top Badge */}
            <View style={styles.bannerTag}>
                <Text style={styles.bannerTagText}>{item.tag}</Text>
            </View>

            <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                
                <View style={styles.shopNowBtn}>
                    <Text style={styles.shopNowText}>Explore {item.category}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#000" />
                </View>
            </View>
         </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderMasonryCard = (item: any) => (
    <TouchableOpacity 
        key={item.id} 
        activeOpacity={0.9} 
        style={[styles.masonryCard, { backgroundColor: theme.cardBg }]} 
        onPress={() => router.push({ pathname: "/product-details", params: { item: JSON.stringify(item) } })}
    >
       <View style={{ height: item.height }}>
         <Image source={{ uri: item.image }} style={styles.masonryImage} />
         <View style={styles.priceTag}>
            <Text style={styles.priceText}>{item.price}</Text>
         </View>
         {item.status !== 'Available' && (
             <View style={styles.unavailableOverlay}>
                 <Text style={styles.unavailableText}>BUSY</Text>
             </View>
         )}
       </View>
       <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
          <View style={styles.cardMeta}>
             <View style={styles.metaRow}>
                <Ionicons name="location-sharp" size={10} color={theme.textSub} />
                <Text style={[styles.cardLender, { color: theme.textSub }]}>{item.distance}</Text>
             </View>
             <View style={styles.metaRow}>
                <Ionicons name="star" size={10} color="#FFD700" />
                <Text style={[styles.cardLender, { color: theme.textSub }]}>{item.rating}</Text>
             </View>
          </View>
       </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
      
      {/* --- HEADER --- */}
      <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Image 
                source={require('../../assets/images/Lendr Black.png')} 
                style={[styles.logoImage, { tintColor: '#FFF' }]} 
                resizeMode="contain"
            />
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchSection}>
            <View style={[styles.searchBar, { backgroundColor: '#FFF' }]}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput 
                    placeholder="Search items..." 
                    style={[styles.searchInput, { color: '#000' }]} 
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={() => router.push({ pathname: '/all-products', params: { q: searchText } })}
                    returnKeyType="search"
                />
            </View>
        </View>
      </LinearGradient>

      {/* --- SCROLL CONTENT --- */}
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* ENHANCED BANNERS */}
        <View style={{ marginTop: 25 }}>
            <Animated.FlatList
                ref={flatListRef}
                data={BANNERS}
                keyExtractor={item => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
                onMomentumScrollEnd={(ev) => setCurrentIndex(Math.round(ev.nativeEvent.contentOffset.x / width))}
                renderItem={renderBanner}
            />
            <View style={styles.pagination}>
                {BANNERS.map((_, i) => (
                    <View key={i} style={[styles.dot, { opacity: i === currentIndex ? 1 : 0.3 }]} />
                ))}
            </View>
        </View>
        
        {/* --- CATEGORIES --- */}
        <View style={styles.categoryWrapper}>
             {/* Left Fade */}
             <LinearGradient 
                colors={[theme.background, 'transparent']} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.fadeLeft}
                pointerEvents="box-none"
             >
                <TouchableOpacity 
                    style={[styles.arrowBtn, { backgroundColor: theme.cardBg }]}
                    onPress={() => categoryScrollRef.current?.scrollTo({ x: 0, animated: true })}
                >
                    <Ionicons name="chevron-back" size={18} color={theme.text} />
                </TouchableOpacity>
             </LinearGradient>
             
             <ScrollView 
                ref={categoryScrollRef}
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingHorizontal: 60, gap: 12 }} 
            >
                 {QUICK_CATEGORIES.map((cat, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[styles.categoryChip, { backgroundColor: theme.cardBg, borderColor: theme.border }]} 
                        onPress={() => router.push({ pathname: '/all-products', params: { category: cat.name } })}
                    >
                        <MaterialCommunityIcons name={cat.icon as any} size={20} color={theme.text} />
                        <Text style={[styles.categoryText, { color: theme.text }]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
             </ScrollView>

             {/* Right Fade */}
             <LinearGradient 
                colors={['transparent', theme.background]} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.fadeRight}
                pointerEvents="box-none"
             >
                <TouchableOpacity 
                    style={[styles.arrowBtn, { backgroundColor: theme.cardBg }]}
                    onPress={() => categoryScrollRef.current?.scrollToEnd({ animated: true })}
                >
                    <Ionicons name="chevron-forward" size={18} color={theme.text} />
                </TouchableOpacity>
             </LinearGradient>
        </View>

        {/* --- MAIN MASONRY GRID --- */}
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Drops</Text>
            <TouchableOpacity onPress={() => router.push('/all-products')}>
                <Text style={{ color: theme.textSub, fontSize: 13, fontWeight: '600' }}>See All</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.masonryContainer}>
            <View style={styles.masonryCol}>{HOME_ITEMS.filter((_, i) => i % 2 === 0).map(renderMasonryCard)}</View>
            <View style={styles.masonryCol}>{HOME_ITEMS.filter((_, i) => i % 2 !== 0).map(renderMasonryCard)}</View>
        </View>

        {/* --- PREMIUM PICKS --- */}
        <View style={[styles.sectionHeader, { marginTop: 40 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Premium Picks</Text>
                <MaterialCommunityIcons name="crown" size={18} color={theme.text} />
            </View>
            <View style={styles.arrowControls}>
                <TouchableOpacity onPress={() => premiumScrollRef.current?.scrollTo({ x: 0, animated: true })}>
                    <Ionicons name="arrow-back-circle-outline" size={32} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => premiumScrollRef.current?.scrollToEnd({ animated: true })}>
                    <Ionicons name="arrow-forward-circle-outline" size={32} color={theme.text} />
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView 
            ref={premiumScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
        >
            {PREMIUM_ITEMS.map((item) => (
                <TouchableOpacity 
                    key={item.id} 
                    style={[styles.premiumCardBig, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                    onPress={() => router.push({ pathname: '/all-products', params: { q: item.title } })}
                >
                    <Image source={{ uri: item.image }} style={styles.premiumImageBig} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.premiumOverlayBig}>
                        <View>
                            <Text style={styles.premiumTitleBig}>{item.title}</Text>
                            <Text style={styles.premiumPriceBig}>{item.price}</Text>
                        </View>
                        <View style={[styles.premiumBadgeBig, { backgroundColor: '#FFF' }]}>
                            <Text style={[styles.premiumBadgeText, { color: '#000' }]}>PRO</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* --- MOST BOOKED --- */}
        <View style={[styles.sectionHeader, { marginTop: 50 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Most Booked</Text>
            <View style={styles.arrowControls}>
                <TouchableOpacity onPress={() => bookedScrollRef.current?.scrollTo({ x: 0, animated: true })}>
                    <Ionicons name="arrow-back-circle-outline" size={32} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => bookedScrollRef.current?.scrollToEnd({ animated: true })}>
                    <Ionicons name="arrow-forward-circle-outline" size={32} color={theme.text} />
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView 
            ref={bookedScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
        >
            {MOST_BOOKED.map((item) => (
                <TouchableOpacity 
                    key={item.id} 
                    style={[styles.bookedCardBig, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                >
                    <Image source={{ uri: item.image }} style={styles.bookedImageBig} />
                    <View style={styles.bookedContentBig}>
                        <Text style={[styles.bookedTitleBig, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                        <View style={[styles.bookedBadgeBig, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
                            <Ionicons name="trending-up" size={14} color={theme.text} />
                            <Text style={[styles.bookedTextBig, { color: theme.text }]}>{item.bookings}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* --- FAQ SECTION --- */}
        <View style={[styles.infoSection, { marginTop: 60 }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Frequently Asked</Text>
            {FAQS.map((item, i) => (
                <View key={i} style={[styles.faqCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                    <View style={styles.faqHeader}>
                        <Ionicons name="help-circle-outline" size={20} color={theme.textSub} />
                        <Text style={[styles.faqQ, { color: theme.text }]}>{item.q}</Text>
                    </View>
                    <Text style={[styles.faqA, { color: theme.textSub }]}>{item.a}</Text>
                </View>
            ))}
        </View>

        {/* --- WHY CHOOSE US (Proper Spacing) --- */}
        <View style={[styles.infoSection, { marginTop: 60, marginBottom: 40 }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Why Choose Us?</Text>
            <View style={styles.whyGrid}>
                {WHY_CHOOSE_US.map((item, i) => (
                    <View key={i} style={[styles.whyBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                        <View style={[styles.whyIconCircle, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}>
                            <MaterialCommunityIcons name={item.icon as any} size={26} color={theme.text} />
                        </View>
                        <Text style={[styles.whyBoxTitle, { color: theme.text }]}>{item.title}</Text>
                        <Text style={[styles.whyBoxDesc, { color: theme.textSub }]}>{item.desc}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* --- FOOTER --- */}
        <View style={[styles.footerContainer, { backgroundColor: isDark ? '#111' : '#F9F9F9' }]}>
            <View style={styles.footerContent}>
                <Image 
                    source={require('../../assets/images/Lendr Black.png')} 
                    style={[styles.footerLogo, { tintColor: theme.text }]} 
                    resizeMode="contain"
                />
                <Text style={[styles.footerTagline, { color: theme.textSub }]}>
                    Share more. Spend less. Connect better.
                </Text>
                
                <View style={styles.contactRow}>
                    <TouchableOpacity style={[styles.contactBtn, { backgroundColor: theme.cardBg }]} onPress={() => Linking.openURL('mailto:support@lendr.app')}>
                        <Ionicons name="mail" size={18} color={theme.text} />
                        <Text style={[styles.contactText, { color: theme.text }]}>Email Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contactBtn, { backgroundColor: theme.cardBg }]} onPress={() => Linking.openURL('tel:+919876543210')}>
                        <Ionicons name="call" size={18} color={theme.text} />
                        <Text style={[styles.contactText, { color: theme.text }]}>Call Us</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.copyright, { color: theme.textSub }]}>© 2024 Lendr Inc. Chennai.</Text>
            </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header
  header: { 
    paddingTop: 60, paddingBottom: 30, 
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 10,
    zIndex: 10
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  greetingText: { fontSize: 13, color: '#CCC', fontWeight: '500' },
  logoImage: { width: 120, height: 34, marginLeft: -4 },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  searchSection: { paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 16, paddingHorizontal: 16 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },

  scrollContent: { paddingTop: 0 },
  
  // ENHANCED BANNERS
  bannerCard: { 
    width: BANNER_WIDTH, height: 200, borderRadius: 24, 
    overflow: 'hidden', backgroundColor: '#000', 
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8,
    marginVertical: 5
  },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 20 },
  bannerTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  bannerTagText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  bannerTextContainer: { alignItems: 'flex-start' },
  bannerSubtitle: { color: '#CCC', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 6 },
  bannerTitle: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: 0.5, marginBottom: 12, lineHeight: 30 },
  shopNowBtn: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, alignItems: 'center', gap: 6 },
  shopNowText: { fontSize: 12, fontWeight: '800', color: '#000' },
  
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#888' },

  // Category Wrapper
  categoryWrapper: { position: 'relative', marginVertical: 25, height: 50, justifyContent: 'center' },
  fadeLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 50, zIndex: 10, justifyContent: 'center', paddingLeft: 10 },
  fadeRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 50, zIndex: 10, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 },
  arrowBtn: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 30, borderWidth: 1, elevation: 1 },
  categoryText: { fontSize: 13, fontWeight: '600' },

  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  arrowControls: { flexDirection: 'row', gap: 15 },

  // Premium Cards
  premiumCardBig: { width: 280, height: 360, borderRadius: 24, overflow: 'hidden', borderWidth: 1, marginVertical: 5, elevation: 6 },
  premiumImageBig: { width: '100%', height: '100%' },
  premiumOverlayBig: { position: 'absolute', bottom: 0, width: '100%', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  premiumTitleBig: { color: '#FFF', fontSize: 20, fontWeight: '800', width: '70%' },
  premiumPriceBig: { color: '#FFF', fontSize: 16, fontWeight: '900', marginTop: 6 }, 
  premiumBadgeBig: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  premiumBadgeText: { fontSize: 12, fontWeight: '900' },

  // Most Booked
  bookedCardBig: { width: 220, borderRadius: 24, overflow: 'hidden', elevation: 4, borderWidth: 1, paddingBottom: 15 },
  bookedImageBig: { width: '100%', height: 200 },
  bookedContentBig: { paddingHorizontal: 15, paddingTop: 15 },
  bookedTitleBig: { fontSize: 16, fontWeight: '800' },
  bookedBadgeBig: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  bookedTextBig: { fontSize: 12, fontWeight: '700' },

  // Masonry
  masonryContainer: { flexDirection: 'row', paddingHorizontal: 15, gap: 12 },
  masonryCol: { flex: 1, gap: 12 },
  masonryCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  masonryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  priceTag: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priceText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  unavailableOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  unavailableText: { color: '#FFF', fontWeight: '800', letterSpacing: 1, fontSize: 11 },
  cardContent: { padding: 10 },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  cardLender: { fontSize: 10, fontWeight: '500' },

  // Info Sections
  infoSection: { paddingHorizontal: 20 },
  infoTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
  faqCard: { marginBottom: 12, padding: 18, borderRadius: 16, borderWidth: 1, elevation: 1 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  faqQ: { fontSize: 14, fontWeight: '700' },
  faqA: { fontSize: 13, lineHeight: 20, paddingLeft: 28 },

  // Why Grid
  whyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  whyBox: { width: '48%', padding: 16, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  whyIconCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  whyBoxTitle: { fontSize: 14, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  whyBoxDesc: { fontSize: 11, textAlign: 'center', lineHeight: 16, opacity: 0.8 },

  // Footer
  footerContainer: { paddingVertical: 40, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  footerContent: { width: '80%', alignItems: 'center' },
  footerLogo: { width: 100, height: 30, marginBottom: 10, opacity: 0.8 },
  footerTagline: { fontSize: 12, textAlign: 'center', marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  contactText: { fontSize: 13, fontWeight: '600' },
  copyright: { fontSize: 10, opacity: 0.5 },
});