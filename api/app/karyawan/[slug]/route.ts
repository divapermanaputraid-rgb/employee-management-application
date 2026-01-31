import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ==========================================================
// SERVICE GET (Detail): Mengambil satu data karyawan
// ==========================================================
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    // Mencari data karyawan berdasarkan ID yang dikirim melalui URL (slug)
    const karyawan = await prisma.tb_karyawan.findUnique({
      where: {
        id: Number((await params).slug),
      },
    });

    // Validasi jika data tidak ditemukan di database
    if (!karyawan) {
      return NextResponse.json({
        success: false,
        message: "Data karyawan tidak ditemukan!",
      });
    }

    return NextResponse.json(karyawan);
  } catch {
    // Menangani error jika slug bukan format angka yang valid
    return NextResponse.json({
      success: false,
      message: "ID harus berupa angka!",
    });
  }
};

// ==========================================================
// SERVICE DELETE: Menghapus data karyawan
// ==========================================================
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const id = Number((await params).slug);

    // Pastikan data yang akan dihapus memang ada
    const check = await prisma.tb_karyawan.findUnique({
      where: { id },
    });

    if (!check) {
      return NextResponse.json({
        success: false,
        message: "Data gagal dihapus, ID tidak ditemukan!",
      });
    }

    // Eksekusi penghapusan record
    await prisma.tb_karyawan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data karyawan berhasil dihapus",
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan saat menghapus data!",
    });
  }
};

// ==========================================================
// SERVICE PUT: Mengubah/Update data karyawan
// ==========================================================
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const id = Number((await params).slug);
    const data = await request.json();

    // 1. Cek apakah record dengan ID tersebut ada
    const checkId = await prisma.tb_karyawan.findUnique({
      where: { id },
    });

    if (!checkId) {
      return NextResponse.json({
        success: false,
        message: "Data tidak ditemukan!",
      });
    }

    // 2. Validasi NIK: Jika NIK diubah, pastikan NIK baru tidak bentrok dengan karyawan lain
    if (data.nik !== checkId.nik) {
      const checkNik = await prisma.tb_karyawan.findUnique({
        where: { nik: data.nik },
      });
      if (checkNik) {
        return NextResponse.json({
          success: false,
          message: "Gagal Update: NIK sudah digunakan karyawan lain!",
        });
      }
    }

    // 3. Proses Update data
    await prisma.tb_karyawan.update({
      where: { id },
      data: {
        nik: data.nik,
        nama: data.nama,
        jabatan: data.jabatan,
        departemen: data.departemen,
        alamat: data.alamat,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data karyawan berhasil diperbarui",
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Gagal memproses perubahan data!",
    });
  }
};