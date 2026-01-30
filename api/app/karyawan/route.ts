import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ==========================================================
// SERVICE GET: Mengambil Seluruh Data Karyawan
// ==========================================================
export const GET = async () => {
  // Query ke database untuk mengambil semua record dari tabel tb_karyawan
  const karyawan = await prisma.tb_karyawan.findMany();

  // Validasi: Jika array kosong, kirim respon sukses false
  if (karyawan.length === 0) {
    return NextResponse.json({
      success: false,
      message: "Data karyawan tidak ditemukan!",
    });
  }

  // Kirim data karyawan dalam format JSON jika ditemukan
  return NextResponse.json(karyawan);
};

// ==========================================================
// SERVICE POST: Menyimpan Data Karyawan Baru
// ==========================================================
export const POST = async (request: NextRequest) => {
  // Parsing body request dari client (format JSON)
  const data = await request.json();

  // Validasi Integritas Data: Cek apakah NIK sudah terdaftar di database
  // NIK harus unik karena berfungsi sebagai identitas utama karyawan
  const check = await prisma.tb_karyawan.findUnique({
    where: { nik: data.nik },
  });

  // Jika NIK sudah ada, batalkan proses simpan untuk menghindari duplikasi
  if (check) {
    return NextResponse.json({
      success: false,
      message: "Gagal simpan: NIK tersebut sudah terdaftar!",
    });
  }

  // Proses Insert: Menyimpan data baru ke tabel tb_karyawan
  await prisma.tb_karyawan.create({
    data: {
      nik: data.nik,
      nama: data.nama,
      jabatan: data.jabatan,     // Pastikan value sesuai dengan Enum di Prisma
      departemen: data.departemen,
      alamat: data.alamat,
    },
  });

  // Kirim feedback positif jika proses asinkronus selesai tanpa error
  return NextResponse.json({
    success: true,
    message: "Data karyawan berhasil ditambahkan",
  });
};