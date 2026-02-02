import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// FIXED IMPORT: Points to root context folder (Up 2 levels)
import { useTheme } from '../../context/ThemeContext'; 

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme(); 
  
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: () => {
            console.log("Logged out");
            // router.replace('/login'); // Uncomment when you have a login screen
          } 
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
        <TouchableOpacity 
            style={[styles.settingsBtn, { backgroundColor: theme.cardBg }]} 
            onPress={() => router.push('/profile/settings')}
        >
           <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }} 
              style={[styles.avatar, { borderColor: theme.cardBg }]} 
            />
            <View style={[styles.verifiedBadge, { borderColor: theme.cardBg }]}>
              <Ionicons name="checkmark" size={12} color="#FFF" />
            </View>
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>Nadeem</Text>
          <Text style={[styles.userDept, { color: theme.textSub }]}>Computer Science • Year 4</Text>

          <View style={[styles.ratingPill, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: theme.text }]}>4.8 (24 reviews)</Text>
          </View>
        </View>

        {/* Stats - High Contrast */}
        <View style={[styles.statsContainer, { backgroundColor: isDark ? '#1A1A1A' : '#000' }]}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Lended</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>5</Text>
            <Text style={styles.statLabel}>Borrowed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>₹4.5k</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.textSub }]}>Account</Text>
          
          <MenuOption 
            icon="person-outline" 
            label="Edit Profile" 
            onPress={() => router.push('/profile/edit')} 
            theme={theme}
          />
          
          <MenuOption 
            icon="cube-outline" 
            label="My Listings" 
            onPress={() => router.push('/profile/my-products')} 
            theme={theme}
          />
          
          <MenuOption 
            icon="card-outline" 
            label="Payment Methods" 
            onPress={() => router.push('/profile/payments')} 
            theme={theme}
          />
          
          <MenuOption 
            icon="notifications-outline" 
            label="Notifications" 
            onPress={() => router.push('/profile/notifications')} 
            theme={theme}
          />
          
          <Text style={[styles.sectionTitle, { color: theme.textSub }]}>Support</Text>
          <MenuOption 
            icon="help-circle-outline" 
            label="Help & FAQ" 
            onPress={() => router.push('/profile/help')} 
            theme={theme}
          />
          <MenuOption 
            icon="document-text-outline" 
            label="Terms of Service" 
            onPress={() => router.push('/profile/terms')} 
            theme={theme}
          />

          <TouchableOpacity 
            style={[styles.signOutBtn, { backgroundColor: theme.cardBg, borderColor: theme.border }]} 
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 140 }} /> 
      </ScrollView>
    </View>
  );
}

// Helper Component
const MenuOption = ({ icon, label, onPress, theme }: { icon: any, label: string, onPress: () => void, theme: any }) => (
  <TouchableOpacity 
    style={[styles.menuItem, { backgroundColor: theme.cardBg, borderColor: theme.border }]} 
    onPress={onPress}
  >
    <View style={styles.menuIconBox}>
      <Ionicons name={icon} size={22} color={theme.text} />
    </View>
    <Text style={[styles.menuText, { color: theme.text }]}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 24, paddingBottom: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  settingsBtn: { padding: 8, borderRadius: 12 },
  scrollContent: { paddingHorizontal: 24 },
  
  userCard: { alignItems: 'center', marginTop: 10 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3 },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  userName: { fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  userDept: { fontSize: 14, marginTop: 4 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12, borderWidth: 1 },
  ratingText: { fontSize: 12, fontWeight: '600', marginLeft: 6 },
  
  statsContainer: { flexDirection: 'row', borderRadius: 20, paddingVertical: 20, marginTop: 24, justifyContent: 'space-evenly', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 12, color: '#AAA', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#333', height: '80%' },
  
  menuSection: { marginTop: 30 },
  sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 10, marginTop: 10, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  menuIconBox: { marginRight: 16 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500' },
  
  signOutBtn: { marginTop: 20, padding: 16, alignItems: 'center', borderRadius: 16, borderWidth: 1 },
  signOutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
});