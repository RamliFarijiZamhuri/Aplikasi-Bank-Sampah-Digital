import sqlite3 from 'sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';
import bcrypt from 'bcryptjs';

function resolveDbPath(): string {
  const localDbPath = path.resolve(process.cwd(), 'database.sqlite');

  // Di Vercel atau environment read-only, gunakan /tmp yang writable
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join(os.tmpdir(), 'database.sqlite');
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(localDbPath)) {
      try {
        fs.copyFileSync(localDbPath, tmpDbPath);
      } catch {
        // Abaikan jika gagal menyalin; initializeDatabase akan membuat DB baru
      }
    }
    return tmpDbPath;
  }

  try {
    fs.accessSync(process.cwd(), fs.constants.W_OK);
    return localDbPath;
  } catch {
    return path.join(os.tmpdir(), 'database.sqlite');
  }
}

// Setup SQLite Connection
const dbPath = resolveDbPath();
export const db = new sqlite3.Database(dbPath);

const rawRun = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const rawGet = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const rawAll = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

let initPromise: Promise<void> | null = null;
let isInitialized = false;

// Database Auto-Initialization if tables or dummy data don't exist
export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await rawRun('PRAGMA foreign_keys = ON;');

    await rawRun(`
      CREATE TABLE IF NOT EXISTS users (
        id_user INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nomor_hp TEXT UNIQUE NOT NULL,
        alamat TEXT,
        role TEXT CHECK(role IN ('Nasabah', 'Petugas', 'Pengepul')) NOT NULL,
        password TEXT NOT NULL,
        saldo REAL DEFAULT 0
      );
    `);

    await rawRun(`
      CREATE TABLE IF NOT EXISTS kategori_sampah (
        id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kategori TEXT NOT NULL,
        harga_per_kg REAL NOT NULL
      );
    `);

    await rawRun(`
      CREATE TABLE IF NOT EXISTS transaksi_setor (
        id_setor INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_petugas INTEGER NOT NULL,
        tanggal_setor TEXT NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_petugas) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `);

    await rawRun(`
      CREATE TABLE IF NOT EXISTS detail_setor (
        id_detail INTEGER PRIMARY KEY AUTOINCREMENT,
        id_setor INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (id_setor) REFERENCES transaksi_setor (id_setor) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `);

    await rawRun(`
      CREATE TABLE IF NOT EXISTS penarikan_saldo (
        id_tarik INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_tarik_dummy INTEGER,
        jumlah_tarik REAL NOT NULL,
        tanggal_pengajuan TEXT NOT NULL,
        status TEXT CHECK(status IN ('Pending', 'Success')) DEFAULT 'Pending',
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `);

    await rawRun(`
      CREATE TABLE IF NOT EXISTS pembelian_pengepul (
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

    const userCountRow = await rawGet('SELECT COUNT(*) AS count FROM users');
    if (!userCountRow || userCountRow.count === 0) {
      console.log('Data user kosong. Menjalankan seed data dummy...');

      const salt = await bcrypt.genSalt(10);
      const hashedDefaultPassword = await bcrypt.hash('password123', salt);

      const petugasRes = await rawRun(
        'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
        ['Budi Petugas', '081234567890', 'Kantor Bank Sampah Indah', 'Petugas', hashedDefaultPassword, 0]
      );
      const petugasId = petugasRes.lastID;

      const nasabahRes = await rawRun(
        'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
        ['Siti Nasabah', '081299999999', 'Jl. Mawar No. 12, RT 02/03', 'Nasabah', hashedDefaultPassword, 50000]
      );
      const nasabahId = nasabahRes.lastID;

      const pengepulRes = await rawRun(
        'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
        ['Rudi Pengepul', '081388888888', 'Gudang Sukses Makmur, Bekasi', 'Pengepul', hashedDefaultPassword, 0]
      );
      const pengepulId = pengepulRes.lastID;

      const katCountRow = await rawGet('SELECT COUNT(*) AS count FROM kategori_sampah');
      let katPetId = 1;
      let katKardusId = 2;
      if (!katCountRow || katCountRow.count === 0) {
        const kat1 = await rawRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', ['Plastik PET', 2000]);
        const kat2 = await rawRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', ['Kardus', 1500]);
        await rawRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', ['Besi', 5000]);
        katPetId = kat1.lastID;
        katKardusId = kat2.lastID;
      }

      const setorRes = await rawRun(
        'INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)',
        [nasabahId, petugasId, '2026-06-01 10:00:00']
      );
      const setorId = setorRes.lastID;

      await rawRun(
        'INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)',
        [setorId, katPetId, 15, 30000]
      );
      await rawRun(
        'INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)',
        [setorId, katKardusId, 20, 30000]
      );
      await rawRun('UPDATE users SET saldo = saldo + ? WHERE id_user = ?', [60000, nasabahId]);

      await rawRun(
        'INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)',
        [nasabahId, 10000, '2026-06-02 14:00:00', 'Success']
      );
      await rawRun(
        'INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)',
        [nasabahId, 25000, '2026-06-03 09:00:00', 'Pending']
      );

      await rawRun(
        'INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)',
        [pengepulId, katPetId, 5, '2026-06-02 16:30:00', 10000]
      );

      console.log('Seeding awal SQLite sukses!');
    }

    isInitialized = true;
  })().catch((err) => {
    initPromise = null;
    throw err;
  });

  return initPromise;
}

export const dbRun = async (query: string, params: any[] = []): Promise<any> => {
  await initializeDatabase();
  return rawRun(query, params);
};

export const dbGet = async (query: string, params: any[] = []): Promise<any> => {
  await initializeDatabase();
  return rawGet(query, params);
};

export const dbAll = async (query: string, params: any[] = []): Promise<any[]> => {
  await initializeDatabase();
  return rawAll(query, params);
};
