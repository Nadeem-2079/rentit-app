import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Payments() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#000" /></TouchableOpacity>
        <Text style={styles.title}>Payments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Credit Card Mock */}
        <LinearGradient colors={['#111', '#333']} style={styles.card}>
          <View style={styles.cardTop}>
            <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.5)" />
            <Text style={styles.cardBank}>Lendr Bank</Text>
          </View>
          <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>Card Holder</Text>
              <Text style={styles.cardValue}>NADEEM</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardValue}>12/28</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {[1,2,3].map((_, i) => (
          <View key={i} style={styles.txnItem}>
            <View style={styles.txnIcon}><Ionicons name="arrow-down" size={20} color="#000" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txnTitle}>Scientific Calculator Rental</Text>
              <Text style={styles.txnDate}>Dec {10 + i}, 2024</Text>
            </View>
            <Text style={styles.txnAmount}>-$5.00</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#FFF' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 24 },
  card: { height: 200, borderRadius: 20, padding: 24, justifyContent: 'space-between', marginBottom: 30 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBank: { color: '#FFF', fontWeight: 'bold' },
  cardNumber: { color: '#FFF', fontSize: 22, letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: '#AAA', fontSize: 10 },
  cardValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  txnItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10 },
  txnIcon: { width: 40, height: 40, backgroundColor: '#F0F0F0', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  txnTitle: { fontWeight: '600' },
  txnDate: { color: '#999', fontSize: 12 },
  txnAmount: { fontWeight: 'bold' },
});