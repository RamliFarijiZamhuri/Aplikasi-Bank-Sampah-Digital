import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { dbRun, dbGet } from '../lib/db';
import { getSessionUser } from '../lib/session';

export interface CreateStaffInput {
  nama: string;
  nomor_hp: string;
  alamat?: string;
  role: 'Petugas' | 'Pengepul';
  password?: string;
}

/**
 * Mendaftarkan akun 'Petugas' atau 'Pengepul' secara manual oleh pengelola (Admin/Staff).
 * Menggunakan `getServerSession` dari NextAuth dengan fallback ke `getSessionUser` kustom.
 */
export async function createStaffAccount(input: CreateStaffInput, req?: any, res?: any, authOptions?: any) {
  let currentUserRole: string | null = null;

  // 1. Coba verifikasi session menggunakan getServerSession NextAuth
  try {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user) {
      currentUserRole = (session.user as any).role;
    }
  } catch (e) {
    // NextAuth belum terkonfigurasi secara penuh, lanjut ke fallback
  }

  // 2. Fallback: Verifikasi menggunakan getSessionUser kustom jika NextAuth mengembalikan null
  if (!currentUserRole && req) {
    const customUser = getSessionUser(req);
    if (customUser) {
      currentUserRole = customUser.role;
    }
  }

  // Pastikan hanya role Petugas / Admin yang diizinkan mendaftarkan staff
  if (!currentUserRole || (currentUserRole !== 'Petugas' && currentUserRole !== 'Admin')) {
    throw new Error('Akses ditolak: Hanya Admin/Staff yang dapat melakukan aksi ini.');
  }

  const { nama, nomor_hp, alamat, role, password } = input;

  if (!nama || !nomor_hp || !role || !password) {
    throw new Error('Semua field wajib diisi');
  }

  // Memastikan role yang dibuat adalah Petugas atau Pengepul
  const targetRole = role.trim();
  const normalizedRole = targetRole.charAt(0).toUpperCase() + targetRole.slice(1).toLowerCase();

  if (normalizedRole !== 'Petugas' && normalizedRole !== 'Pengepul') {
    throw new Error('Hanya dapat mendaftarkan akun dengan role Petugas atau Pengepul.');
  }

  // Cek apakah nomor hp sudah terdaftar
  const existingUser = await dbGet('SELECT * FROM users WHERE nomor_hp = ?', [nomor_hp]);
  if (existingUser) {
    throw new Error('Nomor HP sudah terdaftar');
  }

  // Hash password menggunakan bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await dbRun(
    'INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)',
    [nama, nomor_hp, alamat || '', normalizedRole, hashedPassword, 0]
  );

  return {
    success: true,
    userId: result.lastID,
    message: `Akun ${normalizedRole} berhasil dibuat secara manual.`
  };
}
