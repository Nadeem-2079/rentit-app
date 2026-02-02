import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Notifications() {
  const router = useRouter();
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#000" /></TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.rowText}>Push Notifications</Text>
          <Switch value={push} onValueChange={setPush} trackColor={{ false: '#767577', true: '#000' }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Email Alerts</Text>
          <Switch value={email} onValueChange={setEmail} trackColor={{ false: '#767577', true: '#000' }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#FFF' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 10 },
  rowText: { fontSize: 16, fontWeight: '500' }
});