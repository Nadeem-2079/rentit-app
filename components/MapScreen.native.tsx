import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  StyleSheet, Text, View, Image, TextInput, TouchableOpacity, 
  ScrollView, Dimensions, StatusBar, Modal, Platform, TouchableWithoutFeedback, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; 

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 15;

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

const RAW_ITEMS = [
  { id: '1', title: 'Calculus Book', distance: '200m', price: 'Free', category: 'Books', latOffset: 0.001, lngOffset: 0.001, rating: 4.8, lender: 'Sarah', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80' },
  { id: '2', title: 'HDMI Cable', distance: '450m', price: 'Free', category: 'Tech', latOffset: -0.001, lngOffset: 0.002, rating: 4.5, lender: 'Mike', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80' },
  { id: '3', title: 'Cricket Bat', distance: '1.2km', price: '₹50/d', category: 'Sports', latOffset: 0.002, lngOffset: -0.001, rating: 4.6, lender: 'Rohan', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80' },
  { id: '4', title: 'Lab Coat', distance: '800m', price: '₹20/d', category: 'Lab', latOffset: -0.002, lngOffset: -0.002, rating: 4.9, lender: 'Emily', image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&q=80' },
  { id: '5', title: 'Scientific Calc', distance: '300m', price: '₹10/d', category: 'Tech', latOffset: 0.0015, lngOffset: -0.0015, rating: 4.7, lender: 'John', image: 'https://images.unsplash.com/photo-1587145820266-a5951ee1f620?w=600&q=80' },
];

const CATEGORIES = ['All', 'Books', 'Tech', 'Sports', 'Lab', 'Fashion'];
const FILTER_OPTIONS = ['Recommended', 'Distance: Near to Far', 'Price: Low to High'];

export default function MapScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme(); 
  
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<FlatList>(null);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('Recommended');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (e) {
        console.log("Error getting location", e);
      }
    })();
  }, []);

  const filteredItems = useMemo(() => {
    let result = RAW_ITEMS.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });

    if (activeFilter === 'Distance: Near to Far') {
      result.sort((a, b) => {
        const distA = a.distance.includes('km') ? parseFloat(a.distance) * 1000 : parseFloat(a.distance);
        const distB = b.distance.includes('km') ? parseFloat(b.distance) * 1000 : parseFloat(b.distance);
        return distA - distB;
      });
    } else if (activeFilter === 'Price: Low to High') {
      result.sort((a, b) => {
        const pA = a.price === 'Free' ? 0 : parseFloat(a.price.replace(/[^0-9]/g, ''));
        const pB = b.price === 'Free' ? 0 : parseFloat(b.price.replace(/[^0-9]/g, ''));
        return pA - pB;
      });
    }
    return result;
  }, [searchQuery, selectedCategory, activeFilter]);

  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };

  const onMarkerPress = (item: any, index: number) => {
    setSelectedItemId(item.id);
    scrollRef.current?.scrollToIndex({ index, animated: true });
    mapRef.current?.animateToRegion({
      latitude: initialRegion.latitude + item.latOffset,
      longitude: initialRegion.longitude + item.lngOffset,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const handleRecenter = () => {
    if(location) {
        mapRef.current?.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        });
    }
  };

  if (!theme) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        customMapStyle={isDark ? DARK_MAP_STYLE : []}
      >
        {filteredItems.map((item, index) => {
          const isSelected = selectedItemId === item.id;
          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: initialRegion.latitude + item.latOffset,
                longitude: initialRegion.longitude + item.lngOffset,
              }}
              onPress={() => onMarkerPress(item, index)}
            >
              <View style={[
                  styles.markerContainer, 
                  isSelected ? styles.markerSelected : { backgroundColor: isDark ? '#FFF' : '#000' }
              ]}>
                <Text style={[
                    styles.markerText, 
                    isSelected ? styles.markerTextSelected : { color: isDark ? '#000' : '#FFF' }
                ]}>
                    {item.price}
                </Text>
                {isSelected && <View style={styles.markerTriangle} />}
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={[styles.topContainer, { top: Platform.OS === 'ios' ? 60 : 50 }]}>
        <View style={styles.searchRow}>
            <View style={[styles.searchBar, { backgroundColor: theme.cardBg }]}>
                <Ionicons name="search" size={20} color={theme.textSub} />
                <TextInput 
                    placeholder="Search nearby..." 
                    style={[styles.input, { color: theme.text }]} 
                    placeholderTextColor={theme.textSub}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <TouchableOpacity 
                style={[styles.filterBtn, { backgroundColor: theme.text }]} 
                onPress={() => setFilterModalVisible(true)}
            >
                <Ionicons name="options" size={20} color={theme.background} />
            </TouchableOpacity>
        </View>

        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity 
                        key={cat}
                        style={[
                            styles.catChip, 
                            selectedCategory === cat 
                                ? { backgroundColor: theme.text } 
                                : { backgroundColor: theme.cardBg }
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={[
                            styles.catText, 
                            selectedCategory === cat ? { color: theme.background } : { color: theme.text }
                        ]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.recenterBtn, { backgroundColor: theme.cardBg }]} 
        onPress={handleRecenter}
      >
        <Ionicons name="locate" size={24} color={theme.text} />
      </TouchableOpacity>

      {filteredItems.length === 0 && (
        <View style={[styles.noResultBox, { backgroundColor: theme.cardBg }]}>
            <Ionicons name="alert-circle" size={24} color="#FF4444" />
            <Text style={[styles.noResultText, { color: theme.text }]}>No items found in this area.</Text>
        </View>
      )}

      {filteredItems.length > 0 && (
        <View style={styles.carouselWrapper}>
            <FlatList
                ref={scrollRef}
                data={filteredItems}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: (width - (CARD_WIDTH + SPACING)) / 2 }}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
                    if (filteredItems[index]) {
                        setSelectedItemId(filteredItems[index].id);
                        mapRef.current?.animateToRegion({
                            latitude: initialRegion.latitude + filteredItems[index].latOffset,
                            longitude: initialRegion.longitude + filteredItems[index].lngOffset,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        });
                    }
                }}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        activeOpacity={0.95}
                        style={[
                            styles.card, 
                            { 
                                backgroundColor: theme.cardBg, 
                                width: CARD_WIDTH,
                                borderColor: selectedItemId === item.id ? theme.text : 'transparent',
                                borderWidth: selectedItemId === item.id ? 2 : 0
                            }
                        ]}
                        onPress={() => router.push({ 
                            pathname: "/product-details", 
                            params: { item: JSON.stringify(item) } 
                        })}
                    >
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={10} color="#000" />
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.cardFooter}>
                                <View style={[styles.distanceBadge, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]}>
                                    <Ionicons name="navigate" size={10} color={theme.textSub} />
                                    <Text style={[styles.distText, { color: theme.textSub }]}>{item.distance}</Text>
                                </View>
                                <Text style={[styles.priceText, { color: theme.text }]}>{item.price}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
      )}

      <Modal visible={filterModalVisible} transparent animationType="fade" onRequestClose={() => setFilterModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Filter Map</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Ionicons name="close-circle" size={24} color={theme.textSub} />
                            </TouchableOpacity>
                        </View>
                        {FILTER_OPTIONS.map((option) => (
                            <TouchableOpacity 
                                key={option} 
                                style={[styles.filterOption, activeFilter === option && { backgroundColor: theme.text }]}
                                onPress={() => { setActiveFilter(option); setFilterModalVisible(false); }}
                            >
                                <Text style={[styles.filterText, { color: activeFilter === option ? theme.background : theme.text }]}>{option}</Text>
                                {activeFilter === option && <Ionicons name="checkmark-circle" size={20} color={theme.background} />}
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
  map: { width: '100%', height: '100%' },
  markerContainer: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, alignItems: 'center', justifyContent: 'center' },
  markerSelected: { backgroundColor: '#FFD700', transform: [{ scale: 1.2 }] },
  markerText: { fontSize: 11, fontWeight: '800' },
  markerTextSelected: { color: '#000' },
  markerTriangle: { position: 'absolute', bottom: -6, width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#FFD700' },
  topContainer: { position: 'absolute', left: 0, right: 0, zIndex: 10, paddingHorizontal: 20 },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 16, height: 50, elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  filterBtn: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 },
  catScroll: { paddingVertical: 5, gap: 10 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  catText: { fontSize: 13, fontWeight: '700' },
  recenterBtn: { position: 'absolute', right: 20, bottom: 250, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, zIndex: 10 },
  noResultBox: { position: 'absolute', top: 180, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, elevation: 5 },
  noResultText: { fontWeight: '600' },
  carouselWrapper: { position: 'absolute', bottom: 110, width: '100%', zIndex: 10 },
  card: { flexDirection: 'row', borderRadius: 20, padding: 10, marginRight: SPACING, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, height: 100 },
  cardImage: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#EEE' },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: 'space-between', height: '100%', paddingVertical: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '800', width: '75%' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFD700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 2 },
  ratingText: { fontSize: 10, fontWeight: '800', color: '#000' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  distText: { fontSize: 10, fontWeight: '700' },
  priceText: { fontSize: 14, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 24, padding: 24, elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8 },
  filterText: { fontSize: 16, fontWeight: '600' },
});