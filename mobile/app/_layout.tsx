// @ts-nocheck
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

// Import Paper Provider
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

// Kita matikan splash screen logic yang menunggu font
// SplashScreen.preventAutoHideAsync(); 

export default function RootLayout() {

  // ===================================================

  // Tema Custom
  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#1a73e8',
      secondary: '#0D82D1',
      background: '#ffffff',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="karyawan/add" />
        <Stack.Screen name="karyawan/edit/[index]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}