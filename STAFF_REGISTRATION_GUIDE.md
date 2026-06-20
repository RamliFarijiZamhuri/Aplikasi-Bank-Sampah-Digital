# Panduan Pendaftaran Akun Petugas & Pengepul

Dokumen ini menjelaskan alur kerja dan cara mendaftarkan akun **Petugas (Staff)** dan **Pengepul** secara manual dalam sistem Bank Sampah Digital.

---

## Mengapa Petugas & Pengepul Tidak Bisa Daftar Mandiri?
Untuk menjaga integritas saldo nasabah, keamanan data inventaris sampah, dan mencegah tindakan fraud (manipulasi keuangan/timbangan), pendaftaran role **Petugas** dan **Pengepul** hanya dapat dilakukan secara internal oleh pengelola (Admin/Staff) yang sah.

---

## Cara Kerja Sistem Pendaftaran Staff

Pendaftaran dilakukan melalui fungsi backend/Server Action `createStaffAccount` yang berada di [admin.ts](file:///d:/Kuliah/Semester%204/Analisis%20Dan%20Perancangan%20Sistem/aplikasi-bank-sampah-digital%20%281%29/src/actions/admin.ts).

### Alur Proses Keamanan:
1. **Verifikasi Sesi (Authentication)**: Fungsi memeriksa kredensial pengguna yang sedang aktif menggunakan `getServerSession` dari NextAuth.
2. **Verifikasi Peran (Authorization)**: Hanya pengguna dengan role `Petugas` atau `Admin` yang diizinkan untuk mendaftarkan akun staff baru.
3. **Validasi Input**: Sistem memeriksa kelengkapan nama, nomor handphone, alamat, kata sandi, dan memastikan role target adalah **Petugas** atau **Pengepul** (di luar itu akan ditolak).
4. **Hashing Sandi**: Password di-hash menggunakan library `bcryptjs` sebelum disimpan ke database SQLite.

---

## Panduan Langkah Demi Langkah bagi Admin

Untuk mendaftarkan staff baru, buat antarmuka (form pendaftaran staff khusus) pada dasbor admin/petugas, lalu kirimkan data ke server dengan memanggil backend endpoint / Server Action.

### 1. Data yang Diperlukan (Payload JSON)
Format pengiriman data pendaftaran staff baru adalah sebagai berikut:
```json
{
  "nama": "Nama Lengkap Petugas/Pengepul",
  "nomor_hp": "0812XXXXXXXX",
  "alamat": "Alamat tempat tinggal atau gudang",
  "role": "Petugas", // Pilih salah satu: "Petugas" atau "Pengepul"
  "password": "kataSandiAman123"
}
```

### 2. Contoh Implementasi Pemanggilan Fungsi di Backend (API Route / Action handler)
```typescript
import { createStaffAccount } from '@/actions/admin';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Jalankan server action createStaffAccount dengan meneruskan req & res untuk NextAuth session
    const result = await createStaffAccount(req.body, req, res);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Gagal membuat akun staff' });
  }
}
```

### 3. Skenario Pengujian Validasi
* **Pendaftaran Sukses**: Ketika Admin mendaftarkan `Petugas` baru dengan nomor HP yang belum terdaftar di database.
* **Akses Ditolak (Error)**: Ketika akun non-admin (misal Nasabah) mencoba mengakses antarmuka pendaftaran staff atau langsung menembak API pembuat staff.
* **Duplikasi Data (Error)**: Ketika Admin mencoba mendaftarkan nomor HP staff yang sudah digunakan oleh pengguna lain.
