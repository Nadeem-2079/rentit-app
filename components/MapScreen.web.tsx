import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function MapScreen() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient colors={['#000', '#1A1A1A']} style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Rentals</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text }]}>Live Map Unavailable</Text>
        <Text style={[styles.subText, { color: theme.textSub }]}>
            The interactive map requires Google Maps services which are available on the Mobile App.
        </Text>
        <Text style={{ marginTop: 20, color: theme.primary, fontWeight: 'bold' }}>
            Please download the Android/iOS App.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
});