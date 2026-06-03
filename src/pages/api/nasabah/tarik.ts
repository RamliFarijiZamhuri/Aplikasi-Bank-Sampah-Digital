import type { NextApiRequest, NextApiResponse } from 'next';
import { dbGet, dbRun } from '../../../lib/db';
import { getSessionUser } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Metode tidak diperbolehkan' });
  }

  const user = getSessionUser(req);
  if (!user || user.role !== 'Nasabah') {
    return res.status(401).json({ message: 'Akses tidak sah' });
  }

  const jumlah_tarik = parseFloat(req.body.jumlah_tarik);
  if (isNaN(jumlah_tarik) || jumlah_tarik <= 0) {
    return res.status(400).json({ message: 'Nominal penarikan tidak valid' });
  }

  try {
    // Check balance first
    const uRow = await dbGet('SELECT saldo FROM users WHERE id_user = ?', [user.id]);
    if (!uRow || uRow.saldo < jumlah_tarik) {
      return res.status(400).json({ 
        message: `Saldo tidak mencukupi. Saldo Anda saat ini Rp ${(uRow?.saldo || 0).toLocaleString('id-ID')}` 
      });
    }

    // Insert request with status 'Pending'
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await dbRun(
      'INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, "Pending")',
      [user.id, jumlah_tarik, nowStr]
    );

    return res.status(200).json({ 
      status: 'success', 
      message: 'Pengajuan penarikan saldo berhasil dikirim. Silakan tunggu validasi petugas.' 
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan sistem internal.' });
  }
}
