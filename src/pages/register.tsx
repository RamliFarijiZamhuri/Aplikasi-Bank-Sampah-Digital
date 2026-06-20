import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Leaf, Recycle, Check, Phone, Lock, ArrowRight, AlertCircle, CheckCircle, User, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Nasabah'); // Default role Nasabah
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama,
          nomor_hp: nomorHp,
          alamat,
          role,
          password
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      setSuccess('Registrasi berhasil! Mengalihkan ke halaman masuk...');
      setTimeout(() => {
        router.push('/login?success=Registrasi+berhasil.+Silakan+masuk.');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat melakukan registrasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      {/* Header Banner */}
      <header className="w-full bg-emerald-700 text-white py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-200" />
            <span className="font-bold text-lg tracking-tight">Bank Sampah Digital</span>
          </div>
          <div className="text-xs text-emerald-100 hidden sm:block">
            Mendukung Lingkungan yang Lebih Bersih &amp; Bernilai Ekonomi
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 my-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
          
          {/* Left Side: Branding and Info */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/30 rounded-lg">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Trash Bank App</h1>
              </div>
              <p className="text-emerald-100 font-light text-sm leading-relaxed mb-6">
                Silakan isi data diri Anda untuk bergabung sebagai Nasabah Bank Sampah Digital dan mulailah menyetor sampah daur ulang untuk menjadi tabungan bernilai rupiah.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/10 p-1 rounded-full text-emerald-300">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Pendaftaran Gratis</h4>
                    <p className="text-xs text-emerald-200">Tidak ada biaya pendaftaran untuk menjadi Nasabah.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/10 p-1 rounded-full text-emerald-300">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Validasi Otomatis</h4>
                    <p className="text-xs text-emerald-200">Akun Anda langsung aktif dan siap digunakan untuk setoran sampah pertama.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-emerald-500/30 text-xs text-emerald-200">
              Ubah limbah menjadi berkah &bull; v1.0
            </div>
          </div>

          {/* Right Side: Register Form */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Daftar Akun Baru</h2>
              <p className="text-xs text-slate-500 mt-1">Gabung sekarang dan mulai berkontribusi untuk bumi yang lebih bersih</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="nama" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    name="nama" 
                    id="nama" 
                    placeholder="Nama Lengkap Anda" 
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition duration-150"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nomor_hp" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Nomor Handphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    name="nomor_hp" 
                    id="nomor_hp" 
                    placeholder="Contoh: 081234567890" 
                    value={nomorHp}
                    onChange={(e) => setNomorHp(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition duration-150"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="alamat" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Alamat Domisili</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea 
                    name="alamat" 
                    id="alamat" 
                    placeholder="Alamat Lengkap Anda" 
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    rows={2}
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition duration-150"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Pilihan Role</label>
                <select 
                  name="role" 
                  id="role" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition duration-150"
                >
                  <option value="Nasabah">Nasabah (Pendaftaran Publik)</option>
                  <option value="Petugas">Petugas (Akan Ditolak Sistem)</option>
                  <option value="Pengepul">Pengepul (Akan Ditolak Sistem)</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition duration-150"
                  />
                </div>
              </div>

              <button 
                id="register_btn"
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition duration-150 shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Sudah memiliki akun?{' '}
              <button 
                onClick={() => router.push('/login')}
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                Masuk di sini
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-800 text-slate-400 text-center py-4 border-t border-slate-700 text-xs">
        &copy; 2026 Bank Sampah Digital. Semua hak dilindungi.
      </footer>
    </div>
  );
}
