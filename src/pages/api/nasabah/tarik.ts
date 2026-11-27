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
  const nama_bank = typeof req.body.nama_bank === 'string' ? req.body.nama_bank.trim() : '';
  const nomor_rekening = typeof req.body.nomor_rekening === 'string' ? req.body.nomor_rekening.trim() : '';
  const atas_nama = typeof req.body.atas_nama === 'string' ? req.body.atas_nama.trim() : '';

  if (isNaN(jumlah_tarik) || jumlah_tarik <= 0) {
    return res.status(400).json({ message: 'Nominal penarikan tidak valid' });
  }

  if (!nama_bank || !nomor_rekening || !atas_nama) {
    return res.status(400).json({
      message: 'Mohon lengkapi tujuan transfer (Nama Bank/E-Wallet, Nomor Rekening/HP, dan Atas Nama).'
    });
  }

  try {
    // Check balance and subtract any pending withdrawals so user cannot over-request
    const uRow = await dbGet('SELECT saldo FROM users WHERE id_user = ?', [user.id]);
    const pendingRow = await dbGet(
      "SELECT COALESCE(SUM(jumlah_tarik), 0) AS total_pending FROM penarikan_saldo WHERE id_user = ? AND status = 'Pending'",
      [user.id]
    );

    const saldoTotal = uRow?.saldo || 0;
    const totalPending = pendingRow?.total_pending || 0;
    const saldoTersedia = Math.max(0, saldoTotal - totalPending);

    if (!uRow || saldoTersedia < jumlah_tarik) {
      return res.status(400).json({
        message: `Saldo tersedia tidak mencukupi. Saldo tersedia: Rp ${saldoTersedia.toLocaleString('id-ID')} (Total: Rp ${saldoTotal.toLocaleString('id-ID')}, Pending: Rp ${totalPending.toLocaleString('id-ID')})`
      });
    }

    // Insert request with status 'Pending'
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await dbRun(
      'INSERT INTO penarikan_saldo (id_user, jumlah_tarik, nama_bank, nomor_rekening, atas_nama, tanggal_pengajuan, status) VALUES (?, ?, ?, ?, ?, ?, "Pending")',
      [user.id, jumlah_tarik, nama_bank, nomor_rekening, atas_nama, nowStr]
    );

    return res.status(200).json({ 
      status: 'success', 
      message: `Pengajuan transfer ke ${nama_bank} (${nomor_rekening}) berhasil dikirim. Silakan tunggu validasi petugas.` 
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan sistem internal.' });
  }
}
