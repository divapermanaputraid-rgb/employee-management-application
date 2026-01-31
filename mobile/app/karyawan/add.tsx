import { API_KARYAWAN } from '@/utils/config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
// IMPORT FIXED: Pastikan Pressable, View, Text, dll diambil dari sini
import { 
  Keyboard, 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Platform, 
  StatusBar 
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Snackbar, TextInput, HelperText } from 'react-native-paper';

export default function AddKaryawanPage() {
  // State untuk data form
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    jabatan: null,
    departemen: "",
    alamat: ""
  });

  // State untuk UI (Dropdown & Snackbar)
  const [openDropdown, setOpenDropdown] = useState(false);
  const [items, setItems] = useState([
    { label: "Manager", value: "Manager" },
    { label: "Staff", value: "Staff" },
    { label: "Admin", value: "Admin" },
    { label: "Supervisor", value: "Supervisor" },
  ]);

  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const snackbarMsg = useRef("");
  const [loading, setLoading] = useState(false);

  // Fungsi validasi sederhana
  const [errors, setErrors] = useState({ nik: false, nama: false, jabatan: false });

  const handleSave = async () => {
    // Reset errors
    const newErrors = {
      nik: form.nik === "",
      nama: form.nama === "",
      jabatan: form.jabatan === null,
    };
    setErrors(newErrors);

    if (newErrors.nik || newErrors.nama || newErrors.jabatan) return;

    setLoading(true);
    try {
      const response = await axios.post(API_KARYAWAN, form);
      
      if (response.data.success) {
        snackbarMsg.current = "Karyawan berhasil ditambahkan!";
        setVisibleSnackbar(true);
        // Reset form setelah sukses
        setForm({ nik: "", nama: "", jabatan: null, departemen: "", alamat: "" });
        Keyboard.dismiss();
        setTimeout(() => router.back(), 1500); // Otomatis balik ke list setelah sukses
      } else {
        snackbarMsg.current = response.data.message;
        setVisibleSnackbar(true);
      }
    } catch (err) {
      snackbarMsg.current = "Terjadi kesalahan koneksi!";
      setVisibleSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX: Gunakan View biasa dengan padding manual (Lebih stabil)
    <View style={styles.container}>
      
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>TAMBAH KARYAWAN</Text>
        <View style={{ width: 28 }} /> {/* Spacer agar judul tetap di tengah */}
      </View>

      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        {/* Input NIK */}
        <TextInput
          label="NIK (Nomor Induk Karyawan)"
          mode="outlined"
          value={form.nik}
          onChangeText={(val) => setForm({...form, nik: val})}
          error={errors.nik}
          style={styles.input}
          keyboardType="numeric"
          activeOutlineColor="#1a73e8"
        />
        <HelperText type="error" visible={errors.nik}>NIK wajib diisi</HelperText>

        {/* Input Nama */}
        <TextInput
          label="Nama Lengkap"
          mode="outlined"
          value={form.nama}
          onChangeText={(val) => setForm({...form, nama: val})}
          error={errors.nama}
          style={styles.input}
          activeOutlineColor="#1a73e8"
        />
        <HelperText type="error" visible={errors.nama}>Nama wajib diisi</HelperText>

        {/* Dropdown Jabatan */}
        <Text style={styles.label}>Jabatan</Text>
        <DropDownPicker
          open={openDropdown}
          value={form.jabatan}
          items={items}
          setOpen={setOpenDropdown}
          setValue={(callback: any) => {
            setForm((prev) => ({ ...prev, jabatan: callback(prev.jabatan) }));
          }}
          placeholder="Pilih Jabatan"
          style={[styles.dropdown, errors.jabatan && { borderColor: '#b00020' }]}
          dropDownContainerStyle={styles.dropdownContainer}
          listMode="SCROLLVIEW"
          zIndex={1000}
        />
        <HelperText type="error" visible={errors.jabatan}>Pilih salah satu jabatan</HelperText>

        {/* Input Departemen */}
        <TextInput
          label="Departemen / Divisi"
          mode="outlined"
          value={form.departemen}
          onChangeText={(val) => setForm({...form, departemen: val})}
          style={styles.input}
          activeOutlineColor="#1a73e8"
        />

        {/* Input Alamat */}
        <TextInput
          label="Alamat Domisili"
          mode="outlined"
          multiline
          numberOfLines={3}
          value={form.alamat}
          onChangeText={(val) => setForm({...form, alamat: val})}
          style={[styles.input, { height: 100 }]}
          activeOutlineColor="#1a73e8"
        />

        {/* Tombol Simpan */}
        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ height: 50 }}
          buttonColor="#1a73e8"
        >
          SIMPAN DATA
        </Button>
      </KeyboardAwareScrollView>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        action={{ label: 'OK', onPress: () => setVisibleSnackbar(false) }}
      >
        {snackbarMsg.current}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    // FIX: Padding status bar untuk Android (pengganti SafeAreaView)
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  scrollContent: { padding: 20 },
  input: { marginBottom: 2, backgroundColor: '#fff' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#666' },
  dropdown: {
    borderColor: '#79747e',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dropdownContainer: { borderColor: '#79747e' },
  button: { marginTop: 20, borderRadius: 8 },
});