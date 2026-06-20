import type { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../../actions/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Metode tidak diperbolehkan' });
  }

  try {
    const result = await registerUser(req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Registration API error:', error);
    return res.status(400).json({ message: error.message || 'Terjadi kesalahan saat registrasi' });
  }
}
