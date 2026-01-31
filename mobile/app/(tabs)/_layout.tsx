import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

// PERBAIKAN IMPORT (sesuai nama file asli Anda)
import { HapticTab } from '@/components/haptic-tab'; // huruf kecil
import { IconSymbol } from '@/components/ui/icon-symbol'; // huruf kecil
import { Colors } from '@/constants/theme'; // file aslinya theme.ts bukan Colors
import { useColorScheme } from '@/hooks/use-color-scheme'; // huruf kecil

// Material Icons untuk fallback
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // Ambil warna aktif dari theme.ts
  const activeColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}>
      
      {/* Tab 1: Karyawan */}
      <Tabs.Screen
        name="karyawan"
        options={{
          title: 'Karyawan',
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={28} color={color} />,
        }}
      />

      {/* Tab 2: Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={28} color={color} />,
        }}
      />

      {/* Tab 3: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} />,
        }}
      />

      {/* Sembunyikan file index default dan buku */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="buku" options={{ href: null }} />
    </Tabs>
  );
};