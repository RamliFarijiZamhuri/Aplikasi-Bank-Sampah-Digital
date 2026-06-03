import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { dbGet, initializeDatabase } from '../../../lib/db';
import { setSessionUser } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Metode tidak diperbolehkan' });
  }

  const { nomor_hp, password } = req.body;
  if (!nomor_hp || !password) {
    return res.status(400).json({ message: 'Mohon isi Nomor HP dan kata sandi Anda!' });
  }

  try {
    // Ensure DB is seeded and set up
    await initializeDatabase();

    const user = await dbGet('SELECT * FROM users WHERE nomor_hp = ?', [nomor_hp]);
    if (!user) {
      return res.status(401).json({ message: 'Nomor HP atau kata sandi tidak cocok!' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Nomor HP atau kata sandi tidak cocok!' });
    }

    // Set HTTP-only Cookie
    setSessionUser(res, {
      id: user.id_user,
      nama: user.nama,
      role: user.role,
      nomor_hp: user.nomor_hp
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil!',
      role: user.role
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan sistem internal. Silakan coba lagi.' });
  }
}
