import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

const COOKIE_NAME = 'bank_sampah_session';

export interface SessionUser {
  id: number;
  nama: string;
  role: 'Nasabah' | 'Petugas' | 'Pengepul';
  nomor_hp: string;
}

export function serializeSession(user: SessionUser): string {
  const jsonStr = JSON.stringify(user);
  return Buffer.from(jsonStr).toString('base64');
}

export function deserializeSession(serialized: string): SessionUser | null {
  try {
    const jsonStr = Buffer.from(serialized, 'base64').toString('utf-8');
    return JSON.parse(jsonStr) as SessionUser;
  } catch {
    return null;
  }
}

// Get user session on server side (getServerSideProps or API handler)
export function getSessionUser(req: IncomingMessage & { cookies: Partial<Record<string, string>> }): SessionUser | null {
  const cookieVal = req.cookies[COOKIE_NAME];
  if (!cookieVal) return null;
  return deserializeSession(cookieVal);
}

// Set session user on API response
export function setSessionUser(res: NextApiResponse | ServerResponse, user: SessionUser) {
  const serialized = serializeSession(user);
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${serialized}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
}

// Clear session user on API response
export function clearSessionUser(res: NextApiResponse | ServerResponse) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
