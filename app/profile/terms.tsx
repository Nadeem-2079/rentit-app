import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Terms() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#000" /></TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          1. Acceptance of Terms{'\n'}
          By accessing and using Lendr, you accept and agree to be bound by the terms and provision of this agreement.{'\n'}{'\n'}
          2. User Conduct{'\n'}
          You agree to use the app only for lawful purposes. You are responsible for all items you borrow.{'\n'}{'\n'}
          3. Liability{'\n'}
          Lendr is not responsible for lost or damaged items. Disputes must be resolved between users.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#FFF' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 24 },
  text: { fontSize: 14, lineHeight: 24, color: '#333' }
});