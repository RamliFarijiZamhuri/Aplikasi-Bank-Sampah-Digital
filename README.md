# Aplikasi Bank Sampah Digital (Trash Bank App) v1.0

Aplikasi Bank Sampah Digital adalah sistem informasi pengelolaan bank sampah modern berbasis web-native yang dirancang untuk mendigitalisasi proses transaksi setoran sampah warga (Nasabah), pengelolaan tabungan digital, monitoring sediaan rongsok siap daur ulang oleh Mitra Pengepul, serta manajemen operasional harian oleh Petugas.

Sistem dibangun menggunakan kerangka kerja **Next.js** dengan memanfaatkan arsitektur React dan database **SQLite** terintegrasi, memecahkan tantangan pencatatan kertas manual yang rentan rusak, meningkatkan transparansi keuangan nasabah, serta mempermudah jejaring ekonomi sirkular antara warga dan pengusaha daur ulang.

---

## 👥 Peran Pengguna & Batasan Fitur Utama

Sistem ini memfasilitasi 3 (tiga) peran pengguna inti secara real-time:

### 1. Nasabah (Warga)
*   **Katalog Harga Real-time:** Meninjau daftar harga sampah harian per kilogram berdasarkan kategori terbaru.
*   **Akumulasi Tabungan:** Memantau akumulasi total berat sampah yang disetor, total pendapatan sepanjang waktu, dan sisa saldo tabungan aktif.
*   **Pengajuan Tarik Dana:** Mengajukan penarikan saldo digital ke uang tunai secara aman, dengan validasi kecukupan limit saldo langsung.
*   **Riwayat Transaksi:** Mengakses mutasi transaksi timbangan masuk dan memantau status persetujuan tiket tarik dana.

### 2. Petugas (Pengelola Depo)
*   **Entry Kasir Setoran Cepat:** Menginput detail timbangan barang dari nasabah secara terpadu, menghitung subtotal otomatis, dan langsung mengkreditkan saldo digital nasabah secara instan.
*   **Persetujuan & Penolakan Tarik Saldo:** Meninjau proposal penarikan tunai dari nasabah; persetujuan akan memotong saldo aman secara atomik, sedangkan penolakan akan menghapus antrean permohonan.
*   **Katalog Harga Fleksibel:** Memperbarui tarif harga per kategori sampah sewaktu-waktu mengikuti kondisi perkembangan pasar industri bahan baku rongsok.

### 3. Pengepul Besar (Mitra Industri)
*   **Logistik Sediaan Gudang Utama:** Memantau sisa berat bersih logistik sampah yang tersimpan di depo secara dinamis (*Total Masuk dari Nasabah - Total Pembelian Borongan oleh Pengepul*).
*   **Checkout Pembelian Borongan:** Melakukan transaksi borongan tebus rongsok langsung dari depo dengan kontrol ketersediaan stok mutlak.
*   **Cetak Manifest Cargo:** Mencetak surat jalan manifest logistik niaga siap-cetak berkualitas tinggi (skala kertas cetak A4).

---

## ⚙️ Prasyarat Perangkat (Prerequisites)

Untuk menjalankan aplikasi ini secara lokal, Anda memerlukan:
*   **Node.js:** Versi 18.x atau yang lebih baru.
*   **npm:** Versi 9.x ke atas.
*   **SQLite3:** Paket database sudah tersimpan terintegrasi di dalam proyek, tidak memerlukan instalasi server database eksternal lainnya.

---

## 🚀 Panduan Instalasi & Cara Menjalankan

Ikuti langkah-langkah di bawah ini untuk memulai sistem:

### 1. Kloning Repositori & Masuk Direktori
```bash
git clone https://github.com/username/trash-bank-nextjs.git
cd trash-bank-nextjs
```

### 2. Instalasi Paket Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Next.js akan mendeteksi apakah berkas database SQLite (`database.sqlite`) sudah ada di root. Jika belum ada, sistem akan menjalankan migrasi DDL, membuat seluruh tabel relasional, serta melakukan seed data demo awal secara otomatis di latar belakang.

Buka browser dan buka tautan berikut:
```
http://localhost:3000
```

### 4. Membuat Hasil Produksi (Build & Production Mode)
Untuk menguji performa terkompilasi penuh:
```bash
npm run build
npm start
```

---

## 📂 Struktur Direktori Proyek

Aplikasi dikembangkan menggunakan struktur folder **Next.js Pages Router** yang rapi:

```text
trash-bank-nextjs/
├── assets/                       # File aset visual statis pendukung
├── next.config.js                # Konfigurasi optimalisasi Next.js
├── package.json                  # Manifes dependensi NodeJS dan script eksekusi
├── tsconfig.json                 # Aturan pengetikan TypeScript
├── src/
│   ├── index.css                 # Import Tailwind CSS v4 & custom Google Fonts (Inter)
│   ├── lib/
│   │   ├── db.ts                 # Sambungan SQLite, fungsi helper query, & DDL/Seed Otomatis
│   │   └── session.ts            # Manajemen cookies sesi penunjuk identitas multi-role
│   └── pages/
│       ├── _app.tsx              # Wrapper layout utama global
│       ├── index.tsx             # Pengalihan halaman / dashboard cerdas
│       ├── login.tsx             # Gerbang login multi-peran dengan visual modern
│       ├── api/                  # Jalur endpoint Server-Side API Handler
│       │   ├── auth/
│       │   │   ├── login.ts      # Verifikasi kredensial & pembuat cookie sesi
│       │   │   └── logout.ts     # Penghapusan sesi aktif
│       │   ├── nasabah/
│       │   │   └── tarik.ts      # Pengajuan tiket penarikan saldo baru
│       │   ├── pengepul/
│       │   │   └── beli.ts       # Transaksi borongan logistik pengepul
│       │   └── petugas/
│       │       ├── setor.ts      # Pencatatan timbangan masuk ke database
│       │       ├── approve-tarik.ts # Konfirmasi potong saldo & sukses tarik dana
│       │       ├── reject-tarik.ts  # Pembatalan proposal penarikan nasabah
│       │       └── update-harga.ts # Penyesuaian harga pasar per kategori barang
│       └── dashboard/
│           ├── nasabah.tsx       # Antarmuka panel tabungan & riwayat mutasi warga
│           ├── petugas.tsx       # Ruang kendali timbangan kasir & verifikasi petugas
│           ├── pengepul.tsx      # Katalog logistik & borongan mitra pengepul
│           └── pengepul/
│               └── manifest/
│                   └── [id].tsx  # Surat jalan logistik (tanda terima timbangan keluar)
└── README.md                     # Panduan Utama (Dokumen ini)
```

---

## 🔑 Hak Akses Akun Pengujian (Demo Accounts)

Berikut adalah data akun bawaan untuk mempermudah proses verifikasi fitur, seluruhnya menggunakan kata sandi default `password123`:

| Peran (Role) | Nama Pengguna | Nomor HP (Username) | Cakupan Pengujian |
| :--- | :--- | :--- | :--- |
| **Petugas** | Budi Petugas | `081234567890` | Simulasi timbangan masuk nasabah, mengesahkan draf tarik saldo, serta mengedit harga pasar. |
| **Nasabah** | Siti Nasabah | `081299999999` | Simulasi cek tabungan sisa saldo, mutasi timbangan masuk, serta meluncurkan permohonan tarik dana. |
| **Pengepul** | Rudi Pengepul | `081388888888` | Membeli sediaan besi/plastik/kardus dari depo utama, serta melihat dan mencetak lembar manifest pengiriman. |

> 💡 **Informasi Seeding Awal:** Saat pertama kali database terbuat, *Siti Nasabah* diberikan deposit awal sebesar **Rp50.000**, serta tumpukan sediaan di depo utama sebesar **15 Kg Plastik PET** dan **20 Kg Kardus** (melalui transaksi setoran awal bernilai Rp60.000 yang tersimpan historis) guna memastikan semua visualisasi metrik grafik dan tabel dapat tampil interaktif tanpa proses manual yang melelahkan.
