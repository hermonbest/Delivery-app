import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="customer/home" />
        <Stack.Screen name="admin/dashboard" />
        <Stack.Screen name="driver/dashboard" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
