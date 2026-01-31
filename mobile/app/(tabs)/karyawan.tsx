import { API_KARYAWAN } from '@/utils/config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View, Image } from 'react-native';
import { Button, Dialog, FAB, List, Portal, Searchbar, Snackbar, Text, Card, Avatar, Chip } from 'react-native-paper';

export default function KaryawanPage() {
  // ==========================================================
  // 1. STATE MANAGEMENT
  // ==========================================================
  
  // State Data Karyawan (Tipe data disesuaikan dengan database)
  const [data, setData] = useState<{
    id: number;
    nik: string;
    nama: string;
    jabatan: string;
    departemen: string;
  }[]>([]);

  const [filterData, setFilterData] = useState<typeof data>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // State Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const snackbarMessage = useRef("");

  // ==========================================================
  // 2. FUNGSI LOGIKA (GET, DELETE, SEARCH)
  // ==========================================================

  // Fungsi Ambil Data dari API
  const getData = async () => {
    try {
      // Ambil data dari endpoint /karyawan
      const response = await axios.get(API_KARYAWAN);
      
      // Cek apakah respon sukses dan berupa array
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        // Jika data kosong atau format beda
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Set kosong jika error koneksi
    }
  };

  // Fungsi Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  // Efek: Ambil data saat halaman dibuka (fokus)
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  // Efek: Filter pencarian
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilterData(data);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = data.filter(item => 
        item.nama.toLowerCase().includes(lowerQuery) || 
        item.nik.includes(lowerQuery) ||
        item.departemen.toLowerCase().includes(lowerQuery)
      );
      setFilterData(filtered);
    }
  }, [searchQuery, data]);

  // Fungsi Konfirmasi Hapus
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setVisibleDialog(true);
  };

  // Fungsi Eksekusi Hapus ke API
  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await axios.delete(`${API_KARYAWAN}/${deleteId}`);
      if (response.data.success) {
        snackbarMessage.current = "Data berhasil dihapus";
        await getData(); // Refresh data otomatis
      } else {
        snackbarMessage.current = "Gagal menghapus data";
      }
    } catch (error) {
      snackbarMessage.current = "Terjadi kesalahan sistem";
    } finally {
      setVisibleDialog(false);
      setVisibleSnackbar(true);
      setDeleteId(null);
    }
  };

  // ==========================================================
  // 3. RENDER UI
  // ==========================================================
  
  // Fungsi helper warna badge jabatan
  const getBadgeColor = (jabatan: string) => {
    switch (jabatan) {
      case 'Manager': return '#E65100'; // Orange Tua
      case 'Supervisor': return '#1565C0'; // Biru Tua
      case 'Staff': return '#2E7D32'; // Hijau
      default: return '#757575'; // Abu-abu
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Biru */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>Data Karyawan</Text>
        <Text style={styles.headerSubtitle}>Kelola data pegawai perusahaan</Text>
      </View>

      {/* Kolom Pencarian */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari Nama / NIK..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ minHeight: 0 }} // Fix styling issue di beberapa versi
        />
      </View>

      {/* List Data */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1a73e8']} />
        }
      >
        {filterData.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="folder-off" size={60} color="#ccc" />
            <Text style={{ color: '#999', marginTop: 10 }}>Data tidak ditemukan</Text>
          </View>
        ) : (
          filterData.map((item) => (
            <Card key={item.id} style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                
                {/* Bagian Kiri: Avatar & Info Utama */}
                <View style={styles.cardLeft}>
                  <Avatar.Text 
                    size={45} 
                    label={item.nama.substring(0, 2).toUpperCase()} 
                    style={{ backgroundColor: getBadgeColor(item.jabatan) }} 
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text variant="titleMedium" numberOfLines={1} style={{ fontWeight: 'bold' }}>{item.nama}</Text>
                    <Text variant="bodySmall" style={{ color: '#666' }}>NIK: {item.nik}</Text>
                    
                    {/* Badge Jabatan & Departemen */}
                    <View style={styles.badgeContainer}>
                      <Chip textStyle={{ fontSize: 10, marginVertical: -4 }} style={{ height: 24, backgroundColor: '#f0f0f0' }}>{item.jabatan}</Chip>
                      <Text style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{item.departemen}</Text>
                    </View>
                  </View>
                </View>

                {/* Bagian Kanan: Aksi Edit & Hapus */}
                <View style={styles.cardActions}>
                  <Pressable 
                    onPress={() => router.push(`/karyawan/edit/${item.id}`)}
                    style={({ pressed }) => [styles.actionButton, pressed && { backgroundColor: '#e3f2fd' }]}
                  >
                    <MaterialIcons name="edit" size={22} color="#1a73e8" />
                  </Pressable>
                  
                  <Pressable 
                    onPress={() => confirmDelete(item.id)}
                    style={({ pressed }) => [styles.actionButton, pressed && { backgroundColor: '#ffebee' }]}
                  >
                    <MaterialIcons name="delete" size={22} color="#d32f2f" />
                  </Pressable>
                </View>

              </Card.Content>
            </Card>
          ))
        )}
        <View style={{ height: 80 }} /> {/* Spacer agar list terbawah tidak tertutup FAB */}
      </ScrollView>

      {/* Floating Action Button (Tambah) */}
      <FAB
        icon="plus"
        label="Tambah"
        style={styles.fab}
        color="#fff"
        onPress={() => router.push("/karyawan/add")}
      />

      {/* Dialog Konfirmasi Hapus */}
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)} style={{ backgroundColor: '#fff' }}>
          <Dialog.Title style={{ color: '#d32f2f' }}>Hapus Data?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak bisa dibatalkan.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(false)} textColor="#666">Batal</Button>
            <Button onPress={executeDelete} textColor="#d32f2f">Hapus</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar Notifikasi */}
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={3000}
        style={{ backgroundColor: '#323232' }}
      >
        {snackbarMessage.current}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: '#1a73e8',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontWeight: 'bold' },
  headerSubtitle: { color: '#e3f2fd', fontSize: 12, marginTop: 4 },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -20, // Agar searchbar menumpuk di atas header
  },
  searchBar: {
    elevation: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 50,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a73e8',
    borderRadius: 50, // Membuat FAB jadi bulat penuh (opsional)
  },
});