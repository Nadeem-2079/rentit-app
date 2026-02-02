import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
// If you are no longer using ProductProvider (since we switched to memoryStore), 
// you can remove the import and the wrapper below. 
// I have left it in case you still have other logic using it.
import { ProductProvider } from '../context/ProductContext'; 

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <Stack screenOptions={{ headerShown: false }}>
          
          {/* 1. Main Tab Navigation */}
          <Stack.Screen name="(tabs)" />
          
          {/* 2. Standard Screens */}
          <Stack.Screen name="all-products" />
          <Stack.Screen name="product-details" />
          <Stack.Screen name="scan" />
          
          {/* 3. Transaction Screens */}
          <Stack.Screen 
            name="payment" 
            options={{ 
              presentation: 'modal', // Makes it slide up like a payment sheet
              animation: 'slide_from_bottom' 
            }} 
          />
          
          <Stack.Screen 
            name="chat" 
            options={{ 
              // Standard push transition works best for chat
              headerShown: false 
            }} 
          />

        </Stack>
      </ProductProvider>
    </ThemeProvider>
  );
}