import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Image, Switch, Dimensions, StatusBar, Alert, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext'; 
import { GlobalInventory } from '../../utils/memoryStore'; 

const CATEGORIES = ['Tech', 'Books', 'Sports', 'Lab', 'Gaming', 'Tools'];

export default function PostItemScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tech');
  const [image, setImage] = useState<string | null>(null);
  const [isSmartPricing, setIsSmartPricing] = useState(true);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handlePost = () => {
    if (!title || !price || !image) {
      Alert.alert("Missing Info", "Please add a title, price, and photo.");
      return;
    }
    
    // Create the new item object
    const newItem = {
        id: Date.now().toString(),
        title: title,
        price: `₹${price}/day`,
        status: 'Available',
        requestCount: 0,
        image: image,
        category: selectedCat,
        blockedDays: [],
        lender: 'You' // <--- Crucial for feed display
    };

    // Push to Memory Store
    GlobalInventory.unshift(newItem); 

    Alert.alert("Success", "Your item is live!", [
      { text: "View Listing", onPress: () => router.push('/profile/my-products') }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent={true} />
      
      {/* HEADER */}
      <LinearGradient colors={['#000', '#1A1A1A']} style={styles.header}>
        <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>New Listing</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
                <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* SCROLLABLE CONTENT */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
        >
            {/* IMAGE PICKER */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.9}>
                {image ? (
                    <View style={{width:'100%', height:'100%'}}>
                        <Image source={{ uri: image }} style={styles.uploadedImage} />
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={14} color="#FFF" />
                            <Text style={styles.editBadgeText}>Edit</Text>
                        </View>
                    </View>
                ) : (
                    <LinearGradient colors={isDark ? ['#333', '#222'] : ['#F9FAFB', '#F3F4F6']} style={styles.uploadPlaceholder}>
                        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#444' : '#E5E7EB' }]}>
                            <Ionicons name="image-outline" size={32} color={theme.textSub} />
                        </View>
                        <Text style={[styles.uploadText, { color: theme.text }]}>Add Cover Photo</Text>
                        <Text style={{fontSize: 12, color: theme.textSub, marginTop: 4}}>Tap to select from gallery</Text>
                    </LinearGradient>
                )}
            </TouchableOpacity>

            {/* TITLE INPUT */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Title</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                    <Ionicons name="pricetag-outline" size={20} color={theme.textSub} style={{marginRight: 10}} />
                    <TextInput 
                        style={[styles.input, { color: theme.text }]}
                        placeholder="e.g. GoPro Hero 9"
                        placeholderTextColor={theme.textSub}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>
            </View>

            {/* CATEGORY SELECTOR (Fixed Visibility) */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedCat === cat;
                        return (
                            <TouchableOpacity 
                                key={cat} 
                                style={[
                                    styles.catChip, 
                                    // High Contrast Logic
                                    isSelected 
                                        ? { backgroundColor: isDark ? '#FFF' : '#000', borderColor: isDark ? '#FFF' : '#000' } 
                                        : { backgroundColor: theme.cardBg, borderColor: theme.border }
                                ]}
                                onPress={() => setSelectedCat(cat)}
                            >
                                <Text style={[
                                    styles.catText, 
                                    { color: isSelected ? (isDark ? '#000' : '#FFF') : theme.text }
                                ]}>{cat}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* PRICE & SMART PRICING */}
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: theme.text }]}>Daily Rate (₹)</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                        <Text style={{color: theme.textSub, fontSize: 16, fontWeight: '600', marginRight: 5}}>₹</Text>
                        <TextInput 
                            style={[styles.input, { color: theme.text }]}
                            placeholder="0"
                            keyboardType="numeric"
                            placeholderTextColor={theme.textSub}
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>
                </View>
                
                <View style={[styles.smartCard, { backgroundColor: isDark ? '#1F2937' : '#ECFDF5', borderColor: isDark ? '#374151' : '#A7F3D0' }]}>
                    <View>
                        <View style={{flexDirection:'row', alignItems:'center', gap: 4}}>
                            <MaterialCommunityIcons name="lightning-bolt" size={16} color={isDark ? '#FBBF24' : '#059669'} />
                            <Text style={[styles.smartTitle, { color: isDark ? '#F3F4F6' : '#065F46' }]}>Smart Price</Text>
                        </View>
                        <Text style={[styles.smartSub, { color: isDark ? '#9CA3AF' : '#047857' }]}>Auto-adjust demand</Text>
                    </View>
                    <Switch 
                        value={isSmartPricing} 
                        onValueChange={setIsSmartPricing} 
                        trackColor={{ false: '#767577', true: '#10B981' }}
                    />
                </View>
            </View>

            {/* DESCRIPTION INPUT */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Description</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.cardBg, borderColor: theme.border, height: 120, alignItems: 'flex-start' }]}>
                    <Ionicons name="document-text-outline" size={20} color={theme.textSub} style={{marginRight: 10, marginTop: 4}} />
                    <TextInput 
                        style={[styles.input, { color: theme.text, height: '100%', textAlignVertical: 'top' }]}
                        placeholder="Condition, accessories, rules..."
                        placeholderTextColor={theme.textSub}
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>
            </View>
            
            {/* SPACER VIEW: Ensures content scrolls above the floating button */}
            <View style={{ height: 180 }} /> 
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FLOATING ACTION BUTTON (Lifted to avoid Tab Bar) */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.postBtn} onPress={handlePost} activeOpacity={0.8}>
            <Text style={styles.postBtnText}>Publish Listing</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, zIndex: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  cancelBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },

  scrollContent: { padding: 20 },

  imagePicker: { width: '100%', height: 240, marginBottom: 25, borderRadius: 24, overflow: 'hidden', elevation: 4 },
  uploadedImage: { width: '100%', height: '100%' },
  uploadPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  uploadText: { fontWeight: '700', fontSize: 16 },
  editBadge: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 5 },
  editBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, opacity: 0.8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1 },
  input: { flex: 1, fontSize: 16, fontWeight: '500' },

  catScroll: { gap: 10, paddingRight: 20 },
  catChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 30, borderWidth: 1 },
  catText: { fontWeight: '700', fontSize: 13 },

  row: { flexDirection: 'row', gap: 15, marginBottom: 24, alignItems: 'flex-end' },
  smartCard: { flex: 1, height: 56, borderRadius: 16, paddingHorizontal: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  smartTitle: { fontWeight: '800', fontSize: 13 },
  smartSub: { fontSize: 10, marginTop: 1, fontWeight: '500' },

  // --- FLOATING FOOTER STYLE ---
  footerContainer: { 
    position: 'absolute', 
    bottom: 120, // High enough to clear any Tab Bar
    left: 20, 
    right: 20, 
    zIndex: 999, 
    elevation: 20
  },
  postBtn: { 
    backgroundColor: '#000', 
    borderRadius: 20, 
    paddingVertical: 18, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10
  },
  postBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});