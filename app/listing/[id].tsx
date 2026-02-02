import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Make sure 'export default' is here!
export default function ListingDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Listing Details for ID: {id}</Text>
    </View>
  );
}