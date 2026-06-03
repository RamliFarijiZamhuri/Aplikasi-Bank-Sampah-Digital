import type { NextApiRequest, NextApiResponse } from 'next';
import { clearSessionUser } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  clearSessionUser(res);
  return res.status(200).json({ status: 'success', message: 'Berhasil keluar' });
}
