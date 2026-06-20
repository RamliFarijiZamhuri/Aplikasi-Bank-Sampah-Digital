import bcrypt from 'bcryptjs';
import { dbRun, dbGet } from '../lib/db';

export interface RegisterInput {
  nama: string;
  nomor_hp: string;
  alamat?: string;
  role: string;
  password?: string;
}

/**
 * Registrasi publik untuk pengguna baru.
 * HANYA diperbolehkan untuk mendaftar sebagai role 'Nasabah'.
 */
export async function registerUser(input: RegisterInput) {
  const { nama, nomor_hp, alamat, role, password } = input;

  if (!nama || !nomor_hp || !role || !password) {
    throw new Error('Semua field wajib diisi');
  }

  // Normalisasi check role
  const normalizedRole = role.trim().toLowerCase();

  // Tolak jika mendaftar sebagai Petugas atau Pengepul melalui form publik
  if (normalizedRole === 'petugas' || normalizedRole === 'pengepul') {
    throw new Error('Pendaftaran petugas atau pengepul harus dilakukan secara manual oleh Admin/Staff');
  }

  if (normalizedRole !== 'nasabah') {
    throw new Error('Halaman registrasi publik hanya dapat digunakan untuk pendaftaran role NASABAH');
  }

  // Pastikan nomor hp belum terdaftar
  const existingUser = await dbGet('SELECT * FROM users WHERE nomor_hp = ?', [nomor_hp]);
  if (existingUser) {
    throw new Error('Nomor HP sudah terdaftar');
  }

  // Hashing password menggunakan bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await dbRun(
    'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
    [nama, nomor_hp, alamat || '', 'Nasabah', hashedPassword, 0]
  );

  return {
    success: true,
    userId: result.lastID,
    message: 'Registrasi nasabah berhasil!'
  };
}
