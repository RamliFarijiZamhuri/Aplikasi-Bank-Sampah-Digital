import type { NextApiRequest, NextApiResponse } from 'next';
import { dbGet, dbRun } from '../../../lib/db';
import { getSessionUser } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Metode tidak diperbolehkan' });
  }

  const user = getSessionUser(req);
  if (!user || user.role !== 'Petugas') {
    return res.status(401).json({ message: 'Akses tidak sah' });
  }

  const id_tarik = parseInt(req.body.id_tarik);
  if (!id_tarik) {
    return res.status(400).json({ message: 'ID pengajuan tidak valid' });
  }

  try {
    // Start Transaction
    await dbRun('BEGIN TRANSACTION;');

    // Get specific withdrawal details
    const wd = await dbGet(`
      SELECT ps.*, u.saldo, u.id_user FROM penarikan_saldo ps 
      JOIN users u ON ps.id_user = u.id_user 
      WHERE ps.id_tarik = ? AND ps.status = 'Pending'
    `, [id_tarik]);

    if (!wd) {
      await dbRun('ROLLBACK;');
      return res.status(404).json({ message: 'Data pengajuan tidak ditemukan atau sudah diproses' });
    }

    // Verify balance covers the amount at confirmation day
    if (wd.saldo < wd.jumlah_tarik) {
      await dbRun('ROLLBACK;');
      return res.status(400).json({ 
        message: `Saldo Nasabah tidak mencukupi untuk disetujui! (Saldo: Rp ${wd.saldo.toLocaleString('id-ID')} - Pengajuan: Rp ${wd.jumlah_tarik.toLocaleString('id-ID')})` 
      });
    }

    // 1. Update status to Success
    await dbRun('UPDATE penarikan_saldo SET status = "Success" WHERE id_tarik = ?', [id_tarik]);

    // 2. Debit nasabah's official balance
    await dbRun('UPDATE users SET saldo = saldo - ? WHERE id_user = ?', [wd.jumlah_tarik, wd.id_user]);

    // Commit Transaction
    await dbRun('COMMIT;');

    return res.status(200).json({ 
      status: 'success', 
      message: 'Pengajuan penarikan dana berhasil disetujui. Saldo nasabah terpotong aman.' 
    });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    try {
      await dbRun('ROLLBACK;');
    } catch (rbErr) {
      console.error('Rollback error:', rbErr);
    }
    return res.status(500).json({ message: 'Sistem gagal menyelesaikan proses persetujuan' });
  }
}
