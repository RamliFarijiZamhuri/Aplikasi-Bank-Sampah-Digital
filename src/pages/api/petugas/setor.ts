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

  const id_nasabah = parseInt(req.body.id_nasabah);
  const items = req.body.items; // Expect array directly in JSON format

  if (!id_nasabah || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Parameter setoran tidak lengkap atau tidak valid' });
  }

  try {
    // 1. Begin transaction
    await dbRun('BEGIN TRANSACTION;');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 2. Insert master transaksi_setor
    const masterInsert = await dbRun(
      'INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)',
      [id_nasabah, user.id, nowStr]
    );
    const id_setor = masterInsert.lastID;

    let aggregateSubtotal = 0;

    // 3. For each item in receipt, load current price, insert details, sum subtotal
    for (const item of items) {
      const id_kategori = parseInt(item.id_kategori);
      const berat = parseFloat(item.berat_kg);
      
      if (isNaN(id_kategori) || isNaN(berat) || berat <= 0) {
        throw new Error('Data item timbangan tidak valid');
      }

      // Fetch official price per kg from DB
      const priceRow = await dbGet('SELECT harga_per_kg FROM kategori_sampah WHERE id_kategori = ?', [id_kategori]);
      if (!priceRow) {
        throw new Error('Kategori sampah tidak ditemukan');
      }

      const harga_per_kg = priceRow.harga_per_kg;
      const calculatedSubtotal = berat * harga_per_kg;
      aggregateSubtotal += calculatedSubtotal;

      await dbRun(
        'INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)',
        [id_setor, id_kategori, berat, calculatedSubtotal]
      );
    }

    // 4. Atomically credit user's database balance
    await dbRun(
      'UPDATE users SET saldo = saldo + ? WHERE id_user = ?',
      [aggregateSubtotal, id_nasabah]
    );

    // 5. Commit transaction
    await dbRun('COMMIT;');

    return res.status(200).json({
      status: 'success',
      message: `Setoran sampah berhasil disimpan. Saldo nasabah bertambah Rp ${aggregateSubtotal.toLocaleString('id-ID')}`
    });
  } catch (error: any) {
    console.error('Error in Petugas Setor transaction:', error);
    try {
      await dbRun('ROLLBACK;');
    } catch (rbErr) {
      console.error('Rollback error:', rbErr);
    }
    return res.status(500).json({ 
      message: error.message || 'Terjadi kesalahan sistem saat menyimpan data setoran. Transaksi dibatalkan.' 
    });
  }
}
