import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // Correct Import

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: theme.cardBg, 
          borderColor: theme.border,
          borderRadius: 35,
          height: 80, 
          paddingBottom: 15,
          paddingTop: 10,
          borderWidth: 1,
          borderTopWidth: 1, 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSub || '#888',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: -5 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarBadge: 2,
          tabBarBadgeStyle: { backgroundColor: theme.text, color: theme.background, fontSize: 10, fontWeight: 'bold' },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="post" 
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.addButton, { backgroundColor: theme.text, borderColor: theme.background }]}>
              <Ionicons name="add" size={32} color={theme.background} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name={focused ? "user-alt" : "user"} size={20} color={color} />
          ),
        }}
      />

      {/* Hide Product Details from Tab Bar */}
      <Tabs.Screen
        name="product-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', top: -20, borderWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
});