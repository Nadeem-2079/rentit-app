import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HandshakeScreen() {
  const router = useRouter();
  const { lenderName, itemTitle } = useLocalSearchParams();

  // The data stored inside the QR Code
  const transactionData = JSON.stringify({
    type: 'handshake_confirm',
    lender: lenderName,
    item: itemTitle,
    timestamp: Date.now()
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <Ionicons name="close" size={28} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Scan to Confirm</Text>
        <Text style={styles.subtitle}>Show this code to {lenderName || 'the lender'} to confirm pickup.</Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={transactionData}
            size={220}
            backgroundColor="white"
            color="black"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>ITEM</Text>
          <Text style={styles.infoValue}>{itemTitle || 'Unknown Item'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  content: { alignItems: 'center', width: '100%', padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#AAA', textAlign: 'center', marginBottom: 40 },
  qrContainer: { padding: 20, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 40 },
  infoBox: { alignItems: 'center' },
  infoLabel: { color: '#666', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  infoValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});