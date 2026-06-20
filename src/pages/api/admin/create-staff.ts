import type { NextApiRequest, NextApiResponse } from 'next';
import { createStaffAccount } from '../../../actions/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diperbolehkan' });
  }

  try {
    const result = await createStaffAccount(req.body, req, res);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Create staff API error:', error);
    return res.status(400).json({ message: error.message || 'Gagal membuat akun staff' });
  }
}
