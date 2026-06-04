import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil cookie session yang diset oleh aplikasi
  const sessionCookie = request.cookies.get('bank_sampah_session')?.value;

  let user: { id: number; nama: string; role: 'Nasabah' | 'Petugas' | 'Pengepul'; nomor_hp: string } | null = null;

  if (sessionCookie) {
    try {
      // Decode base64 menggunakan atob yang didukung Edge Runtime
      const decoded = atob(sessionCookie);
      user = JSON.parse(decoded);
    } catch (e) {
      // Sesi tidak valid / error parsing
    }
  }

  // Cek otorisasi rute dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      // Arahkan ke halaman login jika belum autentikasi
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'Silakan masuk terlebih dahulu untuk mengakses dashboard.');
      return NextResponse.redirect(loginUrl);
    }

    // Batasi akses rute berdasarkan role masing-masing
    if (pathname.startsWith('/dashboard/nasabah')) {
      if (user.role !== 'Nasabah') {
        return NextResponse.redirect(new URL(getRedirectUrl(user.role), request.url));
      }
    }

    if (pathname.startsWith('/dashboard/petugas')) {
      if (user.role !== 'Petugas') {
        return NextResponse.redirect(new URL(getRedirectUrl(user.role), request.url));
      }
    }

    if (pathname.startsWith('/dashboard/pengepul')) {
      if (user.role !== 'Pengepul') {
        return NextResponse.redirect(new URL(getRedirectUrl(user.role), request.url));
      }
    }
  }

  return NextResponse.next();
}

/**
 * Mendapatkan rute dashboard default berdasarkan role user
 */
function getRedirectUrl(role: string): string {
  switch (role) {
    case 'Nasabah':
      return '/dashboard/nasabah';
    case 'Petugas':
      return '/dashboard/petugas';
    case 'Pengepul':
      return '/dashboard/pengepul';
    default:
      return '/login';
  }
}

// Hanya jalankan middleware pada rute dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};
