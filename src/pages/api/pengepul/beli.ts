import type { NextApiRequest, NextApiResponse } from 'next';
import { dbGet, dbRun } from '../../../lib/db';
import { getSessionUser } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Metode tidak diperbolehkan' });
  }

  const user = getSessionUser(req);
  if (!user || user.role !== 'Pengepul') {
    return res.status(401).json({ message: 'Akses tidak sah' });
  }

  const id_kategori = parseInt(req.body.id_kategori);
  const berat_kg = parseFloat(req.body.berat_kg);

  if (isNaN(id_kategori) || isNaN(berat_kg) || berat_kg <= 0) {
    return res.status(400).json({ message: 'Nilai pembelian tidak valid.' });
  }

  try {
    // 1. Begin transaction
    await dbRun('BEGIN TRANSACTION;');

    // 2. Fetch inventory statuses
    const statusGudang = await dbGet(`
      SELECT 
        k.id_kategori,
        k.harga_per_kg,
        (COALESCE((SELECT SUM(ds.berat_kg) FROM detail_setor ds WHERE ds.id_kategori = k.id_kategori), 0) - 
         COALESCE((SELECT SUM(pp.berat_kg) FROM pembelian_pengepul pp WHERE pp.id_kategori = k.id_kategori), 0)) AS stok_sekarang
      FROM kategori_sampah k
      WHERE k.id_kategori = ?
    `, [id_kategori]);

    if (!statusGudang) {
      await dbRun('ROLLBACK;');
      return res.status(404).json({ message: 'Kategori sampah tidak ditemukan' });
    }

    const availableStock = statusGudang.stok_sekarang || 0;

    // 3. Stock checks
    if (berat_kg > availableStock) {
      await dbRun('ROLLBACK;');
      return res.status(400).json({ 
        message: `Stok gudang tidak mencukupi! Stok tersedia hanya ${availableStock.toFixed(1)} Kg` 
      });
    }

    // 4. Record calculation
    const total_bayar = berat_kg * statusGudang.harga_per_kg;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 5. Insert rows
    await dbRun(`
      INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar)
      VALUES (?, ?, ?, ?, ?)
    `, [user.id, id_kategori, berat_kg, nowStr, total_bayar]);

    await dbRun('COMMIT;');

    return res.status(200).json({
      status: 'success',
      message: `Pembelian berhasil! Membeli ${berat_kg.toFixed(1)} Kg seharga Rp ${total_bayar.toLocaleString('id-ID')}`
    });
  } catch (err) {
    console.error('Pengepul purchase error:', err);
    try {
      await dbRun('ROLLBACK;');
    } catch (rb) {}
    return res.status(500).json({ message: 'Gagal menyelesaikan transaksi pembelian.' });
  }
}
