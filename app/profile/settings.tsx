import React from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- FIXED IMPORT PATH ---
// Go up one level (..) to 'app', then into 'context'
import { useTheme } from '../../context/ThemeContext'; 

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme(); // Access the global theme

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* HEADER */}
      <LinearGradient 
        colors={isDark ? ['#111', '#222'] : ['#F8F8F8', '#FFF']} 
        style={[styles.header, { borderBottomColor: theme.border }]}
      >
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.iconBtn, { backgroundColor: theme.cardBg }]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* BODY */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSub }]}>Preferences</Text>
        
        {/* Dark Mode Toggle */}
        <View style={[styles.row, { backgroundColor: theme.cardBg }]}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]}>
                <Ionicons name="moon" size={20} color={theme.text} />
            </View>
            <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={'#FFF'}
          />
        </View>

        {/* Example: Notifications (Static for now) */}
        <View style={[styles.row, { backgroundColor: theme.cardBg }]}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]}>
                <Ionicons name="notifications" size={20} color={theme.text} />
            </View>
            <Text style={[styles.label, { color: theme.text }]}>Notifications</Text>
          </View>
          <Switch 
            value={true} 
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={'#FFF'}
          />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    borderBottomWidth: 1 
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  iconBtn: { padding: 8, borderRadius: 12 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, marginLeft: 5, textTransform: 'uppercase' },
  
  row: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 16, borderRadius: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
});