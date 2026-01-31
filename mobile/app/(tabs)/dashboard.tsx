import { API_KARYAWAN } from '@/utils/config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Card, ProgressBar, Title } from 'react-native-paper';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    manager: 0,
    staff: 0,
    others: 0
  });

  const getStats = async () => {
    try {
      const response = await axios.get(API_KARYAWAN);
      const data = response.data;
      
      if (Array.isArray(data)) {
        const total = data.length;
        const manager = data.filter((k: any) => k.jabatan === 'Manager').length;
        const staff = data.filter((k: any) => k.jabatan === 'Staff').length;
        
        setStats({
          total,
          manager,
          staff,
          others: total - (manager + staff)
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(useCallback(() => { getStats(); }, []));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DASHBOARD ADMIN</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card Total Karyawan */}
        <Card style={styles.mainCard}>
          <Card.Content style={{ alignItems: 'center' }}>
            <MaterialIcons name="groups" size={40} color="#fff" />
            <Text style={styles.totalLabel}>Total Karyawan</Text>
            <Text style={styles.totalValue}>{stats.total}</Text>
          </Card.Content>
        </Card>

        {/* Statistik Jabatan */}
        <Text style={styles.sectionTitle}>Distribusi Karyawan</Text>

        <View style={styles.statRow}>
          <View style={styles.statInfo}>
            <Text>Manager</Text>
            <Text style={{ fontWeight: 'bold' }}>{stats.manager}</Text>
          </View>
          <ProgressBar progress={stats.total ? stats.manager / stats.total : 0} color="#FF9800" style={styles.bar} />
        </View>

        <View style={styles.statRow}>
          <View style={styles.statInfo}>
            <Text>Staff</Text>
            <Text style={{ fontWeight: 'bold' }}>{stats.staff}</Text>
          </View>
          <ProgressBar progress={stats.total ? stats.staff / stats.total : 0} color="#2196F3" style={styles.bar} />
        </View>

        <View style={styles.statRow}>
          <View style={styles.statInfo}>
            <Text>Lainnya (Admin/Spv)</Text>
            <Text style={{ fontWeight: 'bold' }}>{stats.others}</Text>
          </View>
          <ProgressBar progress={stats.total ? stats.others / stats.total : 0} color="#4CAF50" style={styles.bar} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#1a73e8', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  content: { padding: 20 },
  mainCard: { backgroundColor: '#1a73e8', marginBottom: 25, borderRadius: 12 },
  totalLabel: { color: '#fff', marginTop: 5, fontSize: 16 },
  totalValue: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statRow: { marginBottom: 15 },
  statInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  bar: { height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' }
});