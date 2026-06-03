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

  const id_kategori = parseInt(req.body.id_kategori);
  const harga_per_kg = parseFloat(req.body.harga_per_kg);

  if (isNaN(id_kategori) || isNaN(harga_per_kg) || harga_per_kg <= 0) {
    return res.status(400).json({ message: 'Kombinasi input kategori atau harga tidak valid.' });
  }

  try {
    await dbRun('UPDATE kategori_sampah SET harga_per_kg = ? WHERE id_kategori = ?', [harga_per_kg, id_kategori]);
    return res.status(200).json({ status: 'success', message: 'Katalog harga berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating price:', error);
    return res.status(500).json({ message: 'Gagal memperbarui katalog harga.' });
  }
}
