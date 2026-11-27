# Aplikasi Bank Sampah Digital (Trash Bank App) v1.0

Aplikasi Bank Sampah Digital adalah sistem informasi pengelolaan bank sampah berbasis web menggunakan **Next.js (Pages Router)**, **React**, **Tailwind CSS**, dan **SQLite** terintegrasi. Aplikasi ini mendigitalisasi pencatatan setoran sampah warga (Nasabah), tabungan saldo digital, manajemen operasional oleh Petugas, serta pembelian stok sampah siap daur ulang oleh Mitra Pengepul.

---

## 👥 Peran Pengguna & Fitur Utama

Sistem ini memfasilitasi 3 (tiga) peran pengguna dengan proteksi rute otomatis melalui `src/middleware.ts`:

### 1. Nasabah (Warga)
* **Registrasi Mandiri (`/register`):** Pendaftaran akun Nasabah baru dengan hashing password (`bcryptjs`).
* **Katalog Harga Real-time:** Meninjau daftar harga sampah harian per kilogram berdasarkan kategori terbaru.
* **Akumulasi Tabungan:** Memantau total berat sampah yang disetor, total pendapatan, dan sisa saldo aktif.
* **Pengajuan Tarik Dana:** Mengajukan penarikan saldo digital ke uang tunai dengan validasi kecukupan saldo.
* **Riwayat Transaksi:** Memantau riwayat setoran masuk dan status persetujuan pengajuan penarikan (`Pending` / `Success`).

### 2. Petugas (Pengelola Depo)
* **Entry Kasir Setoran Cepat:** Menginput detail timbangan sampah nasabah, menghitung subtotal otomatis, dan langsung menambah saldo nasabah.
* **Persetujuan & Penolakan Tarik Saldo:** Menyetujui pengajuan penarikan (memotong saldo nasabah secara atomik) atau menolak/menghapus antrean permohonan.
* **Manajemen Harga Sampah:** Memperbarui tarif harga per kilogram untuk setiap kategori sampah.
* **Pendaftaran Akun Staff:** Mendaftarkan akun baru dengan peran `Petugas` atau `Pengepul` secara manual dari dashboard.

### 3. Pengepul Besar (Mitra Industri)
* **Monitoring Stok Gudang:** Memantau sisa berat bersih sampah di depo (*Total Masuk dari Nasabah - Total Pembelian Pengepul*).
* **Pembelian Borongan:** Melakukan transaksi pembelian stok sampah dengan validasi ketersediaan stok.
* **Cetak Manifest Cargo (`/dashboard/pengepul/manifest/[id]`):** Mencetak surat jalan manifest pengiriman siap cetak (skala A4).

---

## ⚙️ Prasyarat Perangkat (Prerequisites)

Untuk menjalankan aplikasi ini secara lokal, Anda memerlukan:
* **Node.js:** Versi 18.x atau yang lebih baru.
* **npm:** Versi 9.x ke atas.
* **SQLite3:** Sudah terintegrasi di dalam dependensi proyek (`sqlite3`), tidak memerlukan instalasi server database terpisah.

---

## 🚀 Panduan Instalasi & Cara Menjalankan (Lokal)

### 1. Kloning Repositori & Masuk Direktori
```bash
git clone <url-repositori-anda>
cd aplikasi-bank-sampah-digital
```

### 2. Instalasi Paket Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Saat pertama kali dijalankan, `initializeDatabase()` di `src/lib/db.ts` akan memeriksa berkas `database.sqlite` di root proyek, membuat seluruh tabel jika belum ada, dan mengisi data dummy awal secara otomatis apabila tabel `users` masih kosong.

Buka browser dan akses:
```text
http://localhost:3000
```

### 4. Build & Mode Produksi
```bash
npm run build
npm start
```
*(Jika mengalami kendala Turbopack saat build lokal di Windows, jalankan `npx next build --webpack`).*

---

## ☁️ Catatan Deployment ke Vercel

Aplikasi ini sudah dikonfigurasi agar dapat di-deploy langsung ke **Vercel**:
* Karena sistem file proyek di Vercel (`/var/task`) bersifat *read-only* dan `database.sqlite` dikecualikan di `.gitignore`, koneksi SQLite di `src/lib/db.ts` otomatis menggunakan direktori `/tmp/database.sqlite` saat berjalan di environment Vercel.
* Ketika tabel `users` masih kosong, sistem otomatis membuat skema tabel dan melakukan *seeding* data dummy sehingga fitur login dan dashboard langsung dapat diuji.
* **Catatan Penting:** Penyimpanan `/tmp` pada serverless function Vercel bersifat sementara (*ephemeral*) dan dapat ter-reset saat *cold start* atau antar-*instance*. Untuk penyimpanan data produksi yang permanen, gunakan database eksternal seperti Turso (libSQL) atau PostgreSQL.

---

## 📂 Struktur Direktori Proyek

```text
aplikasi-bank-sampah-digital/
├── assets/                                  # Aset visual statis pendukung
├── next.config.js                           # Konfigurasi Next.js (serverExternalPackages: sqlite3)
├── package.json                             # Manifes dependensi dan script eksekusi
├── tsconfig.json                            # Konfigurasi TypeScript
├── API_DOCUMENTATION.md                     # Dokumentasi endpoint API
├── ARCHITECTURE.md                          # Penjelasan arsitektur sistem
├── DATABASE_GUIDE.md                        # Panduan skema & relasi database
├── STAFF_REGISTRATION_GUIDE.md              # Panduan pendaftaran akun Petugas/Pengepul
├── src/
│   ├── index.css                            # Import Tailwind CSS v4 & font
│   ├── middleware.ts                        # Proteksi rute /dashboard/* berdasarkan cookie role
│   ├── actions/
│   │   ├── admin.ts                         # Logika pembuatan akun Petugas/Pengepul
│   │   └── auth.ts                          # Logika registrasi Nasabah
│   ├── lib/
│   │   ├── db.ts                            # Koneksi SQLite, helper query, & auto DDL/Seed
│   │   └── session.ts                       # Manajemen cookie sesi HttpOnly multi-role
│   └── pages/
│       ├── _app.tsx                         # Wrapper layout global
│       ├── index.tsx                        # Redirect halaman utama ke login/dashboard
│       ├── login.tsx                        # Halaman login multi-peran + akun demo
│       ├── register.tsx                     # Halaman pendaftaran mandiri Nasabah
│       ├── api/
│       │   ├── admin/
│       │   │   └── create-staff.ts          # Endpoint tambah akun Petugas/Pengepul
│       │   ├── auth/
│       │   │   ├── login.ts                 # Verifikasi kredensial & set cookie sesi
│       │   │   ├── logout.ts                # Hapus cookie sesi
│       │   │   └── register.ts              # Endpoint registrasi Nasabah
│       │   ├── nasabah/
│       │   │   └── tarik.ts                 # Pengajuan penarikan saldo
│       │   ├── pengepul/
│       │   │   └── beli.ts                  # Transaksi pembelian stok oleh pengepul
│       │   └── petugas/
│       │       ├── setor.ts                 # Pencatatan setoran sampah nasabah
│       │       ├── approve-tarik.ts         # Persetujuan tarik saldo
│       │       ├── reject-tarik.ts          # Penolakan tarik saldo
│       │       └── update-harga.ts          # Pembaruan harga kategori sampah
│       └── dashboard/
│           ├── nasabah.tsx                  # Dashboard Nasabah
│           ├── petugas.tsx                  # Dashboard Petugas
│           ├── pengepul.tsx                 # Dashboard Pengepul
│           └── pengepul/
│               └── manifest/
│                   └── [id].tsx             # Halaman cetak manifest cargo pengepul
└── README.md                                # Panduan utama proyek
```

---

## 🔑 Akun Pengujian (Demo Accounts)

Seluruh akun demo bawaan menggunakan kata sandi default **`password123`**:

| Peran (Role) | Nama Pengguna | Nomor HP (Username) | Cakupan Pengujian |
| :--- | :--- | :--- | :--- |
| **Petugas** | Budi Petugas | `081234567890` | Input setoran nasabah, approve/reject tarik saldo, update harga sampah, dan buat akun staff. |
| **Nasabah** | Siti Nasabah | `081299999999` | Cek saldo, lihat riwayat setoran, dan ajukan penarikan saldo. |
| **Pengepul** | Rudi Pengepul | `081388888888` | Cek stok gudang, lakukan pembelian borongan, dan cetak manifest pengiriman. |

> 💡 **Informasi Seeding Awal:** Saat database pertama kali diinisialisasi, sistem otomatis membuat:
> * 3 kategori sampah: **Plastik PET** (Rp2.000/kg), **Kardus** (Rp1.500/kg), dan **Besi** (Rp5.000/kg).
> * 1 transaksi setoran awal milik *Siti Nasabah* (15 kg Plastik PET + 20 kg Kardus senilai Rp60.000, ditambahkan ke saldo awal Rp50.000 sehingga saldo tercatat Rp110.000).
> * 2 riwayat penarikan saldo (*Success* Rp10.000 dan *Pending* Rp25.000) serta 1 pembelian pengepul oleh *Rudi Pengepul* (5 kg Plastik PET, menyisakan stok gudang 10 kg Plastik PET dan 20 kg Kardus).

---

## 📚 Dokumentasi Tambahan

* [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) — Spesifikasi endpoint API request & response.
* [ARCHITECTURE.md](./ARCHITECTURE.md) — Alur arsitektur aplikasi dan autentikasi.
* [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) — Detail struktur tabel dan relasi SQLite.
* [STAFF_REGISTRATION_GUIDE.md](./STAFF_REGISTRATION_GUIDE.md) — Panduan pendaftaran akun Petugas dan Pengepul.
