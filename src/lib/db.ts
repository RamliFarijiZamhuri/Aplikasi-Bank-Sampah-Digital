import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// Setup SQLite Connection
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
export const db = new sqlite3.Database(dbPath);

export const dbRun = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbGet = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Database Auto-Initialization if tables don't exist
export async function initializeDatabase() {
  await dbRun('PRAGMA foreign_keys = ON;');
  const userTable = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
  
  if (!userTable) {
    console.log("Database file atau tabel 'users' belum ada di Next.js. Menjalankan DDL dan Seed otomatis...");
    
    await dbRun(`
      CREATE TABLE users (
        id_user INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nomor_hp TEXT UNIQUE NOT NULL,
        alamat TEXT,
        role TEXT CHECK(role IN ('Nasabah', 'Petugas', 'Pengepul')) NOT NULL,
        password TEXT NOT NULL,
        saldo REAL DEFAULT 0
      );
    `);

    await dbRun(`
      CREATE TABLE kategori_sampah (
        id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kategori TEXT NOT NULL,
        harga_per_kg REAL NOT NULL
      );
    `);

    await dbRun(`
      CREATE TABLE transaksi_setor (
        id_setor INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_petugas INTEGER NOT NULL,
        tanggal_setor TEXT NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_petugas) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `);

    await dbRun(`
      CREATE TABLE detail_setor (
        id_detail INTEGER PRIMARY KEY AUTOINCREMENT,
        id_setor INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (id_setor) REFERENCES transaksi_setor (id_setor) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `);

    await dbRun(`
      CREATE TABLE penarikan_saldo (
        id_tarik INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_tarik_dummy INTEGER,
        jumlah_tarik REAL NOT NULL,
        tanggal_pengajuan TEXT NOT NULL,
        status TEXT CHECK(status IN ('Pending', 'Success')) DEFAULT 'Pending',
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `);

    await dbRun(`
      CREATE TABLE pembelian_pengepul (
        id_pembelian INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        tanggal_pembelian TEXT NOT NULL,
        total_bayar REAL NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `);

    const salt = await bcrypt.genSalt(10);
    const hashedDefaultPassword = await bcrypt.hash('password123', salt);

    await dbRun(
      'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Budi Petugas', '081234567890', 'Kantor Bank Sampah Indah', 'Petugas', hashedDefaultPassword, 0]
    );

    await dbRun(
      'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Siti Nasabah', '081299999999', 'Jl. Mawar No. 12, RT 02/03', 'Nasabah', hashedDefaultPassword, 50000]
    );

    await dbRun(
      'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Rudi Pengepul', '081388888888', 'Gudang Sukses Makmur, Bekasi', 'Pengepul', hashedDefaultPassword, 0]
    );

    await dbRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', ['Plastik PET', 2000]);
    await dbRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', ['Kardus', 1500]);
    await dbRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', ['Besi', 5000]);

    await dbRun('INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)', [2, 1, '2026-06-01 10:00:00']);
    await dbRun('INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)', [1, 1, 15, 30000]);
    await dbRun('INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)', [1, 2, 20, 30000]);
    await dbRun('UPDATE users SET saldo = saldo + ? WHERE id_user = ?', [60000, 2]);

    await dbRun('INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)', [2, 10000, '2026-06-02 14:00:00', 'Success']);
    await dbRun('INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)', [2, 25000, '2026-06-03 09:00:00', 'Pending']);

    await dbRun('INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)', [3, 1, 5, '2026-06-02 16:30:00', 10000]);

    console.log("Seeding awal SQLite di Next.js sukses!");
  }
}
