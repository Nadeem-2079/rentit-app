import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// IMPORT CUSTOM ALERT
import CustomAlert from '../../components/CustomAlert';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('Nadeem');
  const [bio, setBio] = useState('Computer Science Student');
  
  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);

  const handleSave = () => {
    // Logic to save data would go here
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
    router.back(); // Go back to profile after saving
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* CUSTOM SUCCESS ALERT */}
      <CustomAlert 
        visible={alertVisible}
        type="success"
        title="Profile Updated"
        message="Your changes have been saved successfully."
        onClose={handleCloseAlert}
        confirmText="Great!"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              value={bio} 
              onChangeText={setBio} 
              multiline 
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Read Only)</Text>
            <TextInput 
              style={[styles.input, styles.disabled]} 
              value="nadeem@campus.edu" 
              editable={false} 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 60, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  
  content: { padding: 24 },
  
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF' },
  changePhoto: { color: '#007AFF', marginTop: 12, fontWeight: '600', fontSize: 15 },
  
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, color: '#666', fontWeight: '700', textTransform: 'uppercase' },
  input: { 
    backgroundColor: '#FFF', padding: 16, borderRadius: 16, 
    borderWidth: 1, borderColor: '#E5E5E5', fontSize: 16, color: '#000' 
  },
  disabled: { backgroundColor: '#F3F4F6', color: '#999', borderColor: 'transparent' }
});