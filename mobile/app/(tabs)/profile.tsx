import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, BackHandler } from 'react-native';
import { Button, List, Divider, Avatar, Text, Portal, Dialog, Snackbar } from 'react-native-paper';

export default function ProfilePage() {
  // State untuk Dialog Konfirmasi
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk Snackbar (Notifikasi Bawah)
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  // Fungsi Simulasi Logout
  const handleLogout = () => {
    setLoading(true);
    
    // Simulasi loading proses logout (1 detik)
    setTimeout(() => {
      setLoading(false);
      setVisibleDialog(false);
      setVisibleSnackbar(true);
      
      // OPTIONAL: Keluar dari aplikasi (Khusus Android) setelah 2 detik
      // setTimeout(() => BackHandler.exitApp(), 2000);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" style={{ backgroundColor: '#fff' }} color="#1a73e8" />
        <Text style={styles.name}>Administrator</Text>
        <Text style={styles.role}>Super User Access</Text>
      </View>

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Pengaturan Akun</List.Subheader>
          
          <List.Item
            title="Edit Profil"
            left={() => <List.Icon icon="account-edit" color="#1a73e8" />}
            right={() => <MaterialIcons name="chevron-right" size={24} color="#ccc" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Keamanan & Password"
            left={() => <List.Icon icon="lock" color="#1a73e8" />}
            right={() => <MaterialIcons name="chevron-right" size={24} color="#ccc" />}
            onPress={() => {}}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Aplikasi</List.Subheader>
          
          <List.Item
            title="Tentang Aplikasi"
            description="Sistem Manajemen Karyawan v1.0"
            left={() => <List.Icon icon="information" color="#1a73e8" />}
          />
          <Divider />
          <List.Item
            title="Bantuan & Support"
            left={() => <List.Icon icon="help-circle" color="#1a73e8" />}
            onPress={() => {}}
          />
        </List.Section>

        <View style={styles.logoutContainer}>
          <Button 
            mode="outlined" 
            icon="logout" 
            textColor="#d32f2f" 
            style={{ borderColor: '#d32f2f' }}
            onPress={() => setVisibleDialog(true)} // Buka Dialog
          >
            LOGOUT SESSION
          </Button>
        </View>
      </ScrollView>

      {/* --- KOMPONEN INTERAKTIF --- */}

      {/* 1. Dialog Konfirmasi Logout */}
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)} style={{ backgroundColor: '#fff' }}>
          <Dialog.Title style={{ color: '#d32f2f', fontWeight: 'bold' }}>Konfirmasi Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Apakah Anda yakin ingin mengakhiri sesi ini? Anda harus login kembali untuk mengakses data.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(false)} textColor="#666">Batal</Button>
            <Button 
              onPress={handleLogout} 
              loading={loading} 
              textColor="#d32f2f"
              labelStyle={{ fontWeight: 'bold' }}
            >
              {loading ? "Memproses..." : "Ya, Keluar"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 2. Snackbar Notifikasi Berhasil */}
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={3000}
        style={{ backgroundColor: '#323232' }}
        action={{
          label: 'Tutup',
          onPress: () => setVisibleSnackbar(false),
        }}
      >
        Anda berhasil logout (Simulasi).
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#1a73e8',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  role: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  logoutContainer: {
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  }
});