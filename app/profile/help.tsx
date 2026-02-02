import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Help() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#000" /></TouchableOpacity>
        <Text style={styles.title}>Help & FAQ</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.item}>
          <Text style={styles.q}>How do I rent an item?</Text>
          <Text style={styles.a}>Simply browse the home screen, tap an item, and click "Request". Chat with the lender to arrange pickup.</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.q}>Is it safe?</Text>
          <Text style={styles.a}>Yes! All users are verified students. We also have a rating system to ensure trust.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#FFF' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 24 },
  item: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15 },
  q: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  a: { color: '#666', lineHeight: 20 }
});