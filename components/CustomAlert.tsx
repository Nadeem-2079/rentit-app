import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // Optional: for actions like Sign Out
  cancelText?: string;
  confirmText?: string;
}

export default function CustomAlert({ 
  visible, type, title, message, onClose, onConfirm, cancelText = "Cancel", confirmText = "OK" 
}: CustomAlertProps) {
  
  // Icon Logic
  let iconName: any = "information-circle";
  let iconColor = "#000";
  let bgIconColor = "#F3F4F6";

  if (type === 'success') {
    iconName = "checkmark-circle";
    iconColor = "#10B981"; // Green
    bgIconColor = "rgba(16, 185, 129, 0.1)";
  } else if (type === 'error') {
    iconName = "alert-circle";
    iconColor = "#EF4444"; // Red
    bgIconColor = "rgba(239, 68, 68, 0.1)";
  } else if (type === 'warning') {
    iconName = "warning";
    iconColor = "#F59E0B"; // Amber
    bgIconColor = "rgba(245, 158, 11, 0.1)";
  }

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          
          {/* Icon Header */}
          <View style={[styles.iconContainer, { backgroundColor: bgIconColor }]}>
            <Ionicons name={iconName} size={32} color={iconColor} />
          </View>

          {/* Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.btnRow}>
            {onConfirm ? (
              <>
                <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
                  <Text style={styles.btnCancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={onConfirm}>
                  <Text style={styles.btnConfirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={[styles.btn, styles.btnConfirm, { width: '100%' }]} onPress={onClose}>
                <Text style={styles.btnConfirmText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', alignItems: 'center', padding: 20 
  },
  alertContainer: {
    backgroundColor: '#FFF', width: '85%', borderRadius: 24, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 10
  },
  iconContainer: {
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  title: { fontSize: 20, fontWeight: '800', color: '#000', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  btnRow: { flexDirection: 'row', width: '100%', gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#F3F4F6' },
  btnCancelText: { color: '#000', fontWeight: '700', fontSize: 15 },
  btnConfirm: { backgroundColor: '#000' },
  btnConfirmText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});