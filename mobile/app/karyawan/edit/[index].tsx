import { API_KARYAWAN } from '@/utils/config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
// IMPORT UTAMA: Pastikan View, Text, StyleSheet diambil dari sini
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  Platform,
  StatusBar
} from 'react-native'; 
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Snackbar, TextInput, ActivityIndicator } from 'react-native-paper';

export default function EditKaryawanPage() {
  const { index } = useLocalSearchParams();
  const [loadingFetch, setLoadingFetch] = useState(true);

  // State Form
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    jabatan: null,
    departemen: "",
    alamat: ""
  });

  // State Dropdown
  const [openDropdown, setOpenDropdown] = useState(false);
  const [items, setItems] = useState([
    { label: "Manager", value: "Manager" },
    { label: "Staff", value: "Staff" },
    { label: "Admin", value: "Admin" },
    { label: "Supervisor", value: "Supervisor" },
  ]);

  // State UI Lainnya
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const snackbarMsg = useRef("");
  const [loadingSave, setLoadingSave] = useState(false);

  // 1. Ambil Data (Fetch)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_KARYAWAN}/${index}`);
        const data = response.data;
        
        if (data) {
          setForm({
            nik: data.nik,
            nama: data.nama,
            jabatan: data.jabatan,
            departemen: data.departemen,
            alamat: data.alamat || ""
          });
        }
      } catch (error) {
        snackbarMsg.current = "Gagal mengambil data karyawan!";
        setVisibleSnackbar(true);
      } finally {
        setLoadingFetch(false);
      }
    };

    if (index) fetchData();
  }, [index]);

  // 2. Simpan Data (Update)
  const handleUpdate = async () => {
    setLoadingSave(true);
    try {
      const response = await axios.put(`${API_KARYAWAN}/${index}`, form);
      
      if (response.data.success) {
        snackbarMsg.current = "Data berhasil diperbarui!";
        setVisibleSnackbar(true);
        setTimeout(() => router.back(), 1500);
      } else {
        snackbarMsg.current = response.data.message;
        setVisibleSnackbar(true);
      }
    } catch (err) {
      snackbarMsg.current = "Gagal update data!";
      setVisibleSnackbar(true);
    } finally {
      setLoadingSave(false);
    }
  };

  // Tampilan Loading
  if (loadingFetch) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={{ marginTop: 10, color: '#666' }}>Memuat data...</Text>
      </View>
    );
  }

  return (
    // GANTI SafeAreaView dengan View biasa (style flex: 1)
    <View style={styles.container}>
      
      {/* Header Custom */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>EDIT KARYAWAN</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        {/* NIK (Tidak boleh diedit biasanya, tapi kita biarkan dulu) */}
        <TextInput
          label="NIK"
          mode="outlined"
          value={form.nik}
          onChangeText={(val) => setForm({...form, nik: val})}
          style={styles.input}
          keyboardType="numeric"
          activeOutlineColor="#1a73e8"
        />

        <TextInput
          label="Nama Lengkap"
          mode="outlined"
          value={form.nama}
          onChangeText={(val) => setForm({...form, nama: val})}
          style={styles.input}
          activeOutlineColor="#1a73e8"
        />

        {/* Label Manual untuk Dropdown */}
        <Text style={styles.label}>Jabatan</Text>
        
        <DropDownPicker
          open={openDropdown}
          value={form.jabatan}
          items={items}
          setOpen={setOpenDropdown}
          setValue={(callback: any) => {
             setForm((prev) => ({ ...prev, jabatan: callback(prev.jabatan) }));
          }}
          style={styles.dropdown}
          zIndex={1000}
          listMode="SCROLLVIEW"
          placeholder="Pilih Jabatan"
        />

        <TextInput
          label="Departemen"
          mode="outlined"
          value={form.departemen}
          onChangeText={(val) => setForm({...form, departemen: val})}
          style={styles.input}
          activeOutlineColor="#1a73e8"
        />

        <TextInput
          label="Alamat"
          mode="outlined"
          multiline
          numberOfLines={3}
          value={form.alamat}
          onChangeText={(val) => setForm({...form, alamat: val})}
          style={[styles.input, { height: 100 }]}
          activeOutlineColor="#1a73e8"
        />

        <Button 
          mode="contained" 
          onPress={handleUpdate} 
          loading={loadingSave}
          disabled={loadingSave}
          style={styles.button}
          buttonColor="#1a73e8"
        >
          UPDATE DATA
        </Button>
      </KeyboardAwareScrollView>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={2000}
      >
        {snackbarMsg.current}
      </Snackbar>
    </View>
  );
}

// STYLE DEFINITION
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    // Trik agar header tidak ketutup status bar tanpa SafeAreaView
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  scrollContent: { 
    padding: 20 
  },
  input: { 
    marginBottom: 12, 
    backgroundColor: '#fff' 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '500', 
    marginBottom: 8, 
    color: '#666', 
    marginTop: 5 
  },
  dropdown: { 
    borderColor: '#79747e', 
    borderRadius: 4, 
    marginBottom: 10 
  },
  button: { 
    marginTop: 20, 
    borderRadius: 8, 
    paddingVertical: 6 
  }
});