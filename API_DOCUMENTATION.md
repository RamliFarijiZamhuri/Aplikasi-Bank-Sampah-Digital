# API_DOCUMENTATION.md - Panduan Teknis Next.js API Routes

Dokumen ini adalah spesifikasi teknis antarmuka REST API untuk **Aplikasi Bank Sampah Digital v1.0**. Seluruh komunikasi data menggunakan format **JSON** (*Application/JSON*) dengan penyandian UTF-8. Autentikasi dan identitas peran dikunci secara aman menggunakan Cookie Sesi (*HTTP-Only Cookie*).

---

## 🔐 Mekanisme Autentikasi & Otorisasi

Sesi login pengguna dipertahankan melalui **Set-Cookie** (`session_user`) yang disematkan langsung oleh server pada browser nasabah setelah otentikasi sukses. 
*   **Cookie Ketentuan:** Bersifat `HttpOnly`, `Path=/`, dan tidak dapat dieksploitasi oleh script JavaScript client-side (mencegah serangan XSS).
*   **Akses Kontrol:** Server akan secara otomatis memverifikasi kecocokan peran akun (`role`) nasabah pada setiap endpoint terlindung yang dipanggil.

---

## 📁 1. Rute Autentikasi (`/api/auth/*`)

### 🔑 A. Proses Masuk Sistem / Login Terpadu
Melakukan verifikasi nomor ponsel dan sandi akun pengguna untuk mengeluarkan cookie otorisasi multi-role.

*   **HTTP Method & URL:** `POST /api/auth/login`
*   **Tipe Parameter:** `JSON`
*   **Request Body:**
    ```json
    {
      "nomor_hp": "081299999999",
      "password": "password123"
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Login berhasil!",
      "role": "Nasabah"
    }
    ```
*   **Response Gagal (401 Unauthorized):**
    ```json
    {
      "message": "Nomor HP atau kata sandi tidak cocok!"
    }
    ```

---

### 🚪 B. Logout Akun
Mengakhiri sesi log masuk saat ini dengan menghapus cookie sesi di sisi browser klien.

*   **HTTP Method & URL:** `POST /api/auth/logout`
*   **Request Body:** *Kosong (None)*
*   **Response Sukses (200 OK):**
    ```json
    {
      "success": true,
      "message": "Logout sukses!"
    }
    ```

---

## 📁 2. Rute Modul Nasabah (`/api/nasabah/*`)

### 💸 A. Pengajuan Tiket Pencairan Tabungan Baru
Mengajukan permohonan tarik saldo tunai dari akumulasi saldo tabungan digital milik nasabah aktif.

*   **HTTP Method & URL:** `POST /api/nasabah/tarik`
*   **Akses Syarat:** Hanya untuk pengguna ber-peran `Nasabah`.
*   **Request Body:**
    ```json
    {
      "jumlah_tarik": 25000
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Pengajuan penarikan saldo berhasil dikirim. Silakan tunggu validasi petugas."
    }
    ```
*   **Response Gagal - Limit Melebihi Saldo (400 Bad Request):**
    ```json
    {
      "message": "Saldo tidak mencukupi. Saldo Anda saat ini Rp 12.000"
    }
    ```

---

## 📁 3. Rute Modul Mitra Pengepul (`/api/pengepul/*`)

### 🛒 A. Pembelian Logistik Depot (Borongan Keluar)
Menebus tumpukan sediaan sampah tebas dari depo utama bank sampah menggunakan nominal harga pasar wholesale terpasang.

*   **HTTP Method & URL:** `POST /api/pengepul/beli`
*   **Akses Syarat:** Hanya untuk pengguna ber-peran `Pengepul`.
*   **Request Body:**
    ```json
    {
      "id_kategori": 1,
      "berat_kg": 10.0
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Pembelian berhasil! Membeli 10.0 Kg seharga Rp 20.000"
    }
    ```
*   **Response Gagal - Stok Gudang Defisit (400 Bad Request):**
    ```json
    {
      "message": "Stok gudang tidak mencukupi! Stok tersedia hanya 4.5 Kg"
    }
    ```

---

## 📁 4. Rute Modul Petugas (`/api/petugas/*`)

### ⚖️ A. Input Hasil Timbangan Timbunan Sampah Masuk
Mencatat serahan berat sampah nasabah, mendistribusikan subtotal nilai beli, dan menambahkan saldo rupiah nasabah sasaran secara sekuensial.

*   **HTTP Method & URL:** `POST /api/petugas/setor`
*   **Akses Syarat:** Hanya untuk pengguna ber-peran `Petugas`.
*   **Request Body:**
    ```json
    {
      "id_nasabah": 2,
      "items": [
        {
          "id_kategori": 1,
          "berat_kg": 5.5
        },
        {
          "id_kategori": 2,
          "berat_kg": 10.0
        }
      ]
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Setoran sampah berhasil disimpan. Saldo nasabah bertambah Rp 26.000"
    }
    ```

---

### 📋 B. Pengesahan Sukses Penarikan Dana (Approve)
Mengkonfirmasi proposal penarikan sisa dana nasabah, mendebit nominal tunai buku keuangan, dan mengubah status penarikan menjadi sukses secara permanen.

*   **HTTP Method & URL:** `POST /api/petugas/approve-tarik`
*   **Akses Syarat:** Hanya untuk pengguna ber-peran `Petugas`.
*   **Request Body:**
    ```json
    {
      "id_tarik": 2
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Pengajuan penarikan dana berhasil disetujui. Saldo nasabah terpotong aman."
    }
    ```

---

### ❌ C. Pembatalan / Penolakan Tiket Pencairan Dana (Reject)
Membatalkan proposal tiket penarikan dana nasabah dari daftar antrean pemrosesan dengan menghapus indeks tiket pending secara tuntas.

*   **HTTP Method & URL:** `POST /api/petugas/reject-tarik`
*   **Akses Syarat:** Hanya untuk pengguna ber-peran `Petugas`.
*   **Request Body:**
    ```json
    {
      "id_tarik": 2
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Pengajuan penarikan berhasil ditolak"
    }
    ```

---

### 🏷️ D. Penyesuaian Katalog Harga Pasar
Melakukan perubahan nominal tarif beli dan jual per kilogram kategori sampah daur ulang di depo.

*   **HTTP Method & URL:** `POST /api/petugas/update-harga`
*   **Akses Syarat:** Hanya untuk pengguna ber-peran `Petugas`.
*   **Request Body:**
    ```json
    {
      "id_kategori": 1,
      "harga_per_kg": 2500
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Katalog harga berhasil diperbarui"
    }
    ```
