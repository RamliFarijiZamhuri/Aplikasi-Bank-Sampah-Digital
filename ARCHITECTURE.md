# Arsitektur Sistem Bank Sampah Digital

Dokumen ini menjelaskan struktur arsitektur, pola autentikasi, serta kebijakan keamanan yang diterapkan dalam aplikasi Bank Sampah Digital.

## Arsitektur Aplikasi

Aplikasi ini dibangun menggunakan Next.js dengan pola Next.js Pages router dan modularitas folder sebagai berikut:
- **`src/lib`**: Utilitas inti seperti koneksi database (`db.ts`) dan manajemen sesi (`session.ts`).
- **`src/actions`**: Logika bisnis dan server actions untuk otentikasi serta administrasi.
- **`src/pages`**: Halaman frontend dan route API Next.js.
- **`src/middleware.ts`**: Middleware tingkat aplikasi untuk mengontrol otorisasi rute dashboard.

---

## Keamanan User Provisioning

Sistem menerapkan pembatasan ketat terkait proses pendaftaran (provisioning) pengguna baru berdasarkan peran (role) masing-masing untuk menjaga integritas data dan keuangan:

### 1. Pendaftaran Mandiri / Publik (Hanya Nasabah)
- **Rute/Form Registrasi Publik** hanya diperbolehkan untuk pendaftaran role **Nasabah**.
- Nasabah dapat mendaftarkan akun secara mandiri untuk dapat meninjau saldo tabungan sampah dan melacak riwayat transaksi setor secara transparan.

### 2. Pembatasan Pendaftaran Mandiri untuk Petugas dan Pengepul
Pendaftaran mandiri untuk role **Petugas** dan **Pengepul** secara publik dinonaktifkan sepenuhnya. Pendaftaran kedua role ini wajib dilakukan secara manual oleh pengelola/Admin melalui fungsi `createStaffAccount` di Server Action.

#### Alasan Keamanan (Mencegah Fraud & Akses Ilegal):
- **Pencegahan Manipulasi Saldo (Petugas):** Petugas memiliki wewenang untuk mencatat setoran sampah dan menambahkan saldo rupiah ke akun Nasabah secara langsung. Jika publik bisa mendaftar sebagai Petugas tanpa verifikasi pihak pengelola, pelaku kejahatan dapat dengan mudah membuat akun Petugas ilegal dan memanipulasi saldo nasabah (misalnya mengisi saldo palsu/fraudulent credits).
- **Perlindungan Inventaris & Keuangan (Pengepul):** Pengepul memiliki hak akses untuk membeli sampah dari depo gudang dan memotong persediaan material daur ulang. Pendaftaran pengepul ilegal secara mandiri dapat mengakibatkan pengambilan inventaris secara ilegal, manipulasi transaksi niaga, serta kecurangan data manifest keluar depo.
- **Prinsip Least Privilege:** Memastikan bahwa hak akses krusial pada sistem adminisrasi dan sirkular ekonomi terpadu hanya didelegasikan secara sadar dan resmi oleh pengelola yang berwenang.
