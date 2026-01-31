import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Tambahkan "as any" agar garis merah hilang untuk sementara
  return <Redirect href={"/dashboard" as any} />;
}