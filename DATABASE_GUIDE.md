# DATABASE_GUIDE.md - Analisis, Skema, dan Desain Database

Dokumen ini menyajikan rancangan komprehensif basis data relasional (*Relational Database Management System - RDBMS*) menggunakan **SQLite3** untuk **Aplikasi Bank Sampah Digital v1.0**. Struktur data ini dirancang dengan relasi integrasi yang solid untuk mengamankan tabungan finansial nasabah, melacak log penimbangan sampah harian secara rinci, dan meyakinkan akurasi inventaris daur ulang demi mencegah kerugian operasional.

---

## 📐 ERD & Desain Logika Relasional

Skema basis data berpusat pada relasi pengguna multi-peran (`users`) yang berinteraksi dengan log transaksi setoran, penarikan dana, dan penebusan logistik oleh mitra industri:

```text
                    +-----------------------+
                    |         users         |
                    +-----------------------+
                    | PK  id_user (INTEGER) |
                    |     nomor_hp (TEXT)   |
                    |     nama (TEXT)       |
                    |     alamat (TEXT)     |
                    |     role (TEXT)       |
                    |     password (TEXT)   |
                    |     saldo (REAL)      |
                    +-----------------------+
                     /                     \ (1)
                    / (1)                   \
                   (N)                       (N)
          +-----------------------+     +------------------------+
          |    transaksi_setor    |     |    penarikan_saldo     |
          +-----------------------+     +------------------------+
          | PK  id_setor (INTEGER)|     | PK  id_tarik (INTEGER) |
          | FK  id_user (INTEGER) |     | FK  id_user (INTEGER)  |
          | FK  id_petugas (INT)  |     |     jumlah_tarik (REAL)|
          |     tanggal_setor(TXT)|     |     status (TEXT)      |
          +-----------------------+     |     tanggal_paju (TXT) |
                     | (1)              +------------------------+
                     |
                    (N)
          +-----------------------+
          |     detail_setor      |
          +-----------------------+
          | PK  id_detail (INT)   |
          | FK  id_setor (INTEGER)|
          | FK  id_kategori (INT) |
          |     berat_kg (REAL)   |
          |     subtotal (REAL)   |
          +-----------------------+
                     | (N)              +------------------------+
                     |                  |   pembelian_pengepul   |
                    (1)                 +------------------------+
          +-----------------------+     | PK  id_beli (INTEGER)  |
          |    kategori_sampah    |     | FK  id_user (INTEGER)  |
          +-----------------------+     | FK  id_kategori (INT)  |
          | PK  id_kategori (INT) <-----+     berat_kg (REAL)    |
          |     nama_kategori(TXT)|     |     tanggal_beli (TXT) |
          |     harga_per_kg(REAL)|     |     total_bayar (REAL) |
          +-----------------------+     +------------------------+
```

---

## 🗃️ Detail Kamus Data & Struktur Tabel

### 1. Tabel: `users`
Tabel utama yang menyimpan profil seluruh warga (Nasabah), pengelola (Petugas), dan sekutu niaga (Pengepul).
*   **Fungsi:** Menyimpan kredensial berhash, peran untuk akses kontrol rute, dan saldo rupiah tabungan nasabah.

| Nama Kolom | Tipe Data | Kunci | Constraints | Deskripsi / Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| `id_user` | `INTEGER` | PK | `AUTOINCREMENT` | ID unik penanda identitas pengguna. |
| `nama` | `TEXT` | - | `NOT NULL` | Nama lengkap asli sesuai kartu pengenal. |
| `nomor_hp` | `TEXT` | - | `UNIQUE`, `NOT NULL` | Nomor ponsel aktif (digunakan sebagai username login). |
| `alamat` | `TEXT` | - | `NULLABLE` | Alamat fisik tempat tinggal atau gudang mitra. |
| `role` | `TEXT` | - | `CHECK(role IN ('Nasabah', 'Petugas', 'Pengepul'))` | Hak istimewa akun dalam sistem. |
| `password` | `TEXT` | - | `NOT NULL` | Hash sandi hasil enkripsi `bcryptjs`. |
| `saldo` | `REAL` | - | `DEFAULT 0` | Saldo tabungan rupiah milik nasabah dari hasil setoran. |

### 2. Tabel: `kategori_sampah`
Database master jenis sampah daur ulang dan informasi nilai tawar per kilogram.

| Nama Kolom | Tipe Data | Kunci | Constraints | Deskripsi / Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| `id_kategori` | `INTEGER` | PK | `AUTOINCREMENT` | ID Kategori sampah. |
| `nama_kategori`| `TEXT` | - | `NOT NULL` | Contoh: *"Plastik PET"*, *"Kertas Kardus"*, *"Besi Scrap"*. |
| `harga_per_kg` | `REAL` | - | `NOT NULL` | Harga beli depo/jual tebus per kilogram logistik timbangan. |

### 3. Tabel: `transaksi_setor`
Header master berkas masuknya setoran sampah warga.

| Nama Kolom | Tipe Data | Kunci | Constraints | Deskripsi / Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| `id_setor` | `INTEGER` | PK | `AUTOINCREMENT` | Nomor invoice timbangan masuk. |
| `id_user` | `INTEGER` | FK | `REFERENCES users(id_user)` | ID Nasabah pemilik sampah. |
| `id_petugas` | `INTEGER` | FK | `REFERENCES users(id_user)` | ID Petugas penginput timbangan. |
| `tanggal_setor`| `TEXT` | - | `NOT NULL` | Waktu pencatatan timbangan (format string waktu ISO-8601). |

### 4. Tabel: `detail_setor`
Baris rincian muatan timbangan masuk per transaksi setoran (Relasi One-to-Many terhadap `transaksi_setor`).

| Nama Kolom | Tipe Data | Kunci | Constraints | Deskripsi / Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| `id_detail` | `INTEGER` | PK | `AUTOINCREMENT` | ID baris detail setoran. |
| `id_setor` | `INTEGER` | FK | `REFERENCES transaksi_setor(id_setor)` | Relasi ke berkas induk timbangan masuk. |
| `id_kategori` | `INTEGER` | FK | `REFERENCES kategori_sampah(id_kategori)` | Jenis sampah yang diserahkan. |
| `berat_kg` | `REAL` | - | `NOT NULL` | Berat timbalan bersih (Kg). |
| `subtotal` | `REAL` | - | `NOT NULL` | Jumlah kredit saldo: `berat_kg` × `harga_per_kg`. |

### 5. Tabel: `penarikan_saldo`
Log pengajuan pencairan tabungan rupiah milik nasabah.

| Nama Kolom | Tipe Data | Kunci | Constraints | Deskripsi / Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| `id_tarik` | `INTEGER` | PK | `AUTOINCREMENT` | Kode referensi tiket pencairan dana. |
| `id_user` | `INTEGER` | FK | `REFERENCES users(id_user)` | Pemohon penarikan dana (Nasabah). |
| `id_tarik_dummy`|`INTEGER` | - | `NULLABLE` | Kolom porting data warisan. |
| `jumlah_tarik` | `REAL` | - | `NOT NULL` | Nominal nominal uang tunai yang dicairkan. |
| `tanggal_pengajuan`|`TEXT`| - | `NOT NULL`| Waktu logistik peluncuran permohonan. |
| `status` | `TEXT` | - | `CHECK(status IN ('Pending', 'Success'))` | Status siklus pengajuan. |

### 6. Tabel: `pembelian_pengepul`
Log transaksi tebus borongan logistik depo utama oleh Mitra Pengepul Industri.

| Nama Kolom | Tipe Data | Kunci | Constraints | Deskripsi / Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| `id_pembelian` | `INTEGER` | PK | `AUTOINCREMENT` | ID transaksi pembelian borongan. |
| `id_user` | `INTEGER` | FK | `REFERENCES users(id_user)` | Pengepul yang menebus barang. |
| `id_kategori` | `INTEGER` | FK | `REFERENCES kategori_sampah(id_kategori)` | Jenis sampah logistik yang diborong. |
| `berat_kg` | `REAL` | - | `NOT NULL` | Jumlah berat rongsok yang ditebus keluar depo (Kg). |
| `tanggal_pembelian`|`TEXT`| - | `NOT NULL`| Waktu inkubasi timbangan keluar gudang. |
| `total_bayar` | `REAL` | - | `NOT NULL` | Total biaya pembelian borongan: `berat_kg` × `harga_per_kg`. |

---

## 🧠 Aturan Logika Bisnis & Penghitungan Database

### 1. Perhitungan Saldo Dinamis Nasabah
Setiap kali Petugas menyimpan transaksi setoran sampah (`/api/petugas/setor`):
$$\text{Subtotal Per Item} = \text{berat\_kg} \times \text{harga\_per\_kg}$$
$$\text{Kredit Penambahan Saldo} = \sum \text{Subtotal}$$
Database menaikkan nilai kolom `saldo` di tabel `users` untuk `id_user` nasabah sebesar `Kredit Penambahan Saldo` secara persisten.

### 2. Rumus Dinamis Stok Depo Utama Jual Pengepul
Stok sisa di depo utama yang dapat dibeli oleh pengepul dihitung secara dinamis dari agregasi log masuk dikurangi penjualan borongan:
$$\text{Stok Tersedia (Kg)} = \text{Total Berat Setor Nasabah} - \text{Total Berat Tebus Pengepul}$$
$$\text{Stok Tersedia} = \left( \sum \text{detail\_setor.berat\_kg} \right) - \left( \sum \text{pembelian\_pengepul.berat\_kg} \right)$$

---

## 🔒 Proteksi Integritas Dana Melalui Database Transactions

Untuk mencegah masalah persaingan akses mikrodetik simultan (*Race Condition*), seperti melakukan klik double penarikan yang dapat menyebabkan eksploitasi saldo negatif di bawah nol rupiah, sistem kami mengimplementasikan perlindungan **Database Transactions** secara penuh di server API Next.js.

### Contoh Prosedur Atomisitas Validasi Persetujuan Penarikan Dana:
1.  **BEGIN TRANSACTION;** membuka transaksi database secara eksklusif.
2.  **Lock & Verify Sisa Saldo:** Mengambil sisa saldo riil pengguna saat ini:
    ```sql
    SELECT saldo FROM users WHERE id_user = ?;
    ```
3.  **Evaluasi Bisnis Kontrol:** Jika `saldo < jumlah_tarik`, sistem segera membatalkan transaksi (`ROLLBACK;`) dan mengirimkan pesan kesalahan tanpa melakukan perubahan.
4.  **Eksekusi Mutasi Akuntansi:**
    ```sql
    UPDATE penarikan_saldo SET status = 'Success' WHERE id_tarik = ?;
    UPDATE users SET saldo = saldo - ? WHERE id_user = ?;
    ```
5.  **COMMIT;** menyelesaikan semua rangkaian transaksi ke penyimpanan fisik dengan aman. Jika kegagalan hardware terjadi di tengah-tengah loop langkah tersebut, database akan meluncurkan perintah rollback otomatis sehingga tidak ada data corrupt.
