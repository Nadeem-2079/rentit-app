import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { CameraView, Camera } from 'expo-camera'; 
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setLoading(true);

    try {
      const itemData = JSON.parse(data);
      
      // Simulate API call to toggle status
      setTimeout(() => {
        setLoading(false);
        const action = itemData.currentStatus === 'Available' ? 'Rented' : 'Returned';
        
        Alert.alert(
            "Success!", 
            `You have successfully ${action.toLowerCase()} "${itemData.title}".`,
            [{ text: 'OK', onPress: () => router.back() }]
        );
      }, 1500);

    } catch (error) {
      setLoading(false);
      Alert.alert("Invalid QR", "This code is not recognized.", [{ text: 'Retry', onPress: () => setScanned(false) }]);
    }
  };

  if (hasPermission === null) return <View style={styles.container} />;
  if (hasPermission === false) return <Text style={{ color: '#fff', marginTop: 100, textAlign: 'center' }}>No Camera Access</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={30} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.scanFrame}>
            {loading && <ActivityIndicator size="large" color="#4ADE80" />}
        </View>
        <Text style={styles.hint}>Align QR Code within frame</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  closeBtn: { position: 'absolute', top: 50, right: 20, padding: 10 },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#4ADE80', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  hint: { color: '#FFF', marginTop: 20, fontSize: 16, fontWeight: '600' }
});