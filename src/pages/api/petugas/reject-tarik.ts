import type { NextApiRequest, NextApiResponse } from 'next';
import { dbRun } from '../../../lib/db';
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
  const catatan = typeof req.body.catatan === 'string' && req.body.catatan.trim()
    ? req.body.catatan.trim()
    : 'Ditolak oleh petugas';
  if (!id_tarik) {
    return res.status(400).json({ message: 'ID pengajuan tidak valid' });
  }

  try {
    // Mark pending request as Rejected and store reason instead of deleting history
    const result = await dbRun(
      'UPDATE penarikan_saldo SET status = "Rejected", catatan = ? WHERE id_tarik = ? AND status = "Pending"',
      [catatan, id_tarik]
    );
    if (!result || result.changes === 0) {
      return res.status(404).json({ message: 'Data pengajuan tidak ditemukan atau sudah diproses' });
    }
    return res.status(200).json({ status: 'success', message: 'Pengajuan penarikan berhasil ditolak' });
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    return res.status(500).json({ message: 'Gagal menolak pengajuan penarikan.' });
  }
}
