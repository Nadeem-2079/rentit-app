import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="help" />
      <Stack.Screen name="terms" />
    </Stack>
  );
}