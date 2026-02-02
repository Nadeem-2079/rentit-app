import React, { useState, useMemo, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TextInput, Image, TouchableOpacity, 
  FlatList, Dimensions, StatusBar, Platform, ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; 
import { GlobalInventory } from '../utils/memoryStore'; // <--- MUST IMPORT THIS

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 20;

const CATEGORIES = ['All', 'Books', 'Tech', 'Sports', 'Gaming', 'Lab', 'Tools', 'Music', 'Fashion'];

// Static Data to mix in
const STATIC_PRODUCTS = [
  { id: 's3', title: 'Yonex Badminton Set', category: 'Sports', price: '₹30/hr', image: 'https://images.unsplash.com/photo-1626224583764-84786c713664?w=600&q=80', lender: 'Rohan', rating: 4.6 },
  { id: 's4', title: 'Lab Coat (M)', category: 'Lab', price: '₹20/d', image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&q=80', lender: 'Emily', rating: 4.9 },
  { id: 's6', title: 'PS5 Controller', category: 'Gaming', price: '₹80/d', image: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=600&q=80', lender: 'GamerX', rating: 4.7 },
];

export default function AllProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, isDark } = useTheme();
  
  // DATA STATE
  const [allData, setAllData] = useState<any[]>([]);
  const [listKey, setListKey] = useState(0); // <--- THE NUCLEAR KEY
  
  // FILTERS
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState<string[]>([]);

  // --- THE CRITICAL FIX ---
  // Every time this screen gets focus, we:
  // 1. Re-read the Global Inventory
  // 2. Increment the listKey to FORCE the UI to redraw
  useFocusEffect(
    useCallback(() => {
      console.log("REFRESHING FEED... Found items:", GlobalInventory.length);
      
      const combined = [...GlobalInventory, ...STATIC_PRODUCTS];
      setAllData(combined);
      setListKey(prev => prev + 1); // <--- FORCE RE-RENDER

      if (params.category) setSelectedCategory(params.category as string);
    }, [params.category])
  );

  const filteredProducts = useMemo(() => {
    return allData.filter(item => {
      const matchCat = selectedCategory === 'All' || (item.category && item.category === selectedCategory);
      const matchSearch = item.title && (item.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, allData]);

  const toggleLike = (id: string) => {
    setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={[styles.productItem, { marginTop: index % 2 !== 0 ? 30 : 0 }]}
      onPress={() => router.push({ pathname: '/product-details', params: { item: JSON.stringify(item) } })}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
            <View style={[styles.productImage, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="image-outline" size={30} color="#CCC" />
            </View>
        )}
        
        <TouchableOpacity style={styles.likeBtn} onPress={() => toggleLike(item.id)}>
            <Ionicons 
                name={likedItems.includes(item.id) ? "heart" : "heart-outline"} 
                size={20} 
                color={likedItems.includes(item.id) ? "#FF4444" : "#FFF"} 
            />
        </TouchableOpacity>
        
        <View style={styles.priceTag}>
            <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.productTitle, { color: theme.text }]} numberOfLines={2}>
            {item.title}
        </Text>
        <View style={styles.metaRow}>
            <Text style={[styles.lenderText, { color: theme.textSub }]}>
                {item.lender || 'You'}
            </Text>
            <View style={styles.ratingBox}>
                <Ionicons name="star" size={10} color="#FFD700" />
                <Text style={[styles.ratingText, { color: theme.textSub }]}>
                    {item.rating || 'New'}
                </Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: theme.cardBg }]}>
            <Ionicons name="search" size={20} color={theme.textSub} />
            <TextInput 
                placeholder="Search..." 
                placeholderTextColor={theme.textSub}
                style={[styles.searchInput, { color: theme.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={theme.textSub} />
                </TouchableOpacity>
            )}
        </View>
      </View>

      {/* CATEGORIES */}
      <View style={styles.catContainer}>
        <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
            keyExtractor={item => item}
            renderItem={({ item }) => (
                <TouchableOpacity 
                    style={[
                        styles.catChip, 
                        selectedCategory === item 
                            ? { backgroundColor: theme.text, borderColor: theme.text } 
                            : { backgroundColor: 'transparent', borderColor: theme.border }
                    ]}
                    onPress={() => setSelectedCategory(item)}
                >
                    <Text style={[
                        styles.catText, 
                        selectedCategory === item ? { color: theme.background } : { color: theme.textSub }
                    ]}>
                        {item}
                    </Text>
                </TouchableOpacity>
            )}
        />
      </View>

      {/* PRODUCT GRID - WITH NUCLEAR KEY */}
      <FlatList
        key={listKey} // <--- THIS FORCES A HARD REFRESH ON UPDATE
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderItem}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={48} color={theme.textSub} />
                <Text style={{ color: theme.textSub, marginTop: 10 }}>No products found</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1 },
  backBtn: { padding: 8, marginRight: 10, marginLeft: -10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 44, borderRadius: 22, paddingHorizontal: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  catContainer: { height: 60, justifyContent: 'center' },
  catScroll: { paddingHorizontal: 20, alignItems: 'center', gap: 10 },
  catChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  catText: { fontSize: 13, fontWeight: '600' },
  listContent: { paddingHorizontal: 15, paddingBottom: 40, paddingTop: 10 },
  columnWrapper: { justifyContent: 'space-between' },
  productItem: { width: COLUMN_WIDTH, marginBottom: 30 },
  imageContainer: { width: '100%', height: COLUMN_WIDTH * 1.2, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F0F0F0', position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  likeBtn: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  priceTag: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priceText: { fontSize: 12, fontWeight: '800', color: '#000' },
  infoContainer: { marginTop: 10, paddingHorizontal: 4 },
  productTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lenderText: { fontSize: 11 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 11, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 100 },
});