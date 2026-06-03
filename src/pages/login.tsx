import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Leaf, Recycle, Check, Phone, Lock, ArrowRight, Info, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [nomorHp, setNomorHp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse query params for errors or success messages from callbacks
    if (router.query.error) {
      setError(router.query.error as string);
    }
    if (router.query.success) {
      setSuccess(router.query.success as string);
    }
  }, [router.query]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomor_hp: nomorHp, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      setSuccess('Login berhasil! Mengalihkan ke dashboard...');
      
      // Redirect to respective cockpit based on role
      if (data.role === 'Nasabah') {
        router.push('/dashboard/nasabah');
      } else if (data.role === 'Petugas') {
        router.push('/dashboard/petugas');
      } else if (data.role === 'Pengepul') {
        router.push('/dashboard/pengepul');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem internal.');
    } finally {
      setLoading(false);
    }
  };

  const fillForm = (hp: string, pass: string) => {
    setNomorHp(hp);
    setPassword(pass);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between hover:scroll-auto">
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
                Selamat datang di Sistem Informasi Bank Sampah Digital. Kami membantu masyarakat mengelola sampah menjadi tabungan bernilai tinggi guna mewujudkan lingkungan hijau bebas limbah.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/10 p-1 rounded-full text-emerald-300">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Setor Sampah Mudah</h4>
                    <p className="text-xs text-emerald-200">Sampah ditimbang, langsung jadi saldo rupiah.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/10 p-1 rounded-full text-emerald-300">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Penarikan Saldo Cepat</h4>
                    <p className="text-xs text-emerald-200">Tarik tabungan digital Anda kapan saja.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/10 p-1 rounded-full text-emerald-300">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Sirkular Ekonomi Terpadu</h4>
                    <p className="text-xs text-emerald-200">Gudang terkelola transparan untuk mitra pengepul besar.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-emerald-500/30 text-xs text-emerald-200">
              Ubah limbah menjadi berkah &bull; v1.0
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Masuk Akun</h2>
              <p className="text-xs text-slate-500 mt-1">Gunakan nomor handphone Anda untuk masuk ke dashboard</p>
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

            <form onSubmit={handleLogin} className="space-y-4">
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
                id="login_btn"
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition duration-150 shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Memvalidasi...' : 'Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Test Accounts Helper Box */}
            <div id="test_accounts_guide" className="mt-8 border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex items-center gap-2 mb-2 text-slate-700">
                <Info className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Akun Demo Pengujian (Password: <span className="font-mono text-emerald-600">password123</span>)</span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
                <button 
                  onClick={() => fillForm('081234567890', 'password123')} 
                  type="button"
                  className="text-left bg-white hover:bg-emerald-50 border border-slate-200 p-2 rounded-lg transition cursor-pointer"
                >
                  <span className="font-bold text-emerald-800">[PETUGAS]</span> Budi Petugas <br />
                  <span className="text-slate-400 font-mono text-[11px]">HP: 081234567890</span>
                </button>
                <button 
                  onClick={() => fillForm('081299999999', 'password123')} 
                  type="button"
                  className="text-left bg-white hover:bg-emerald-50 border border-slate-200 p-2 rounded-lg transition cursor-pointer"
                >
                  <span className="font-bold text-emerald-800">[NASABAH]</span> Siti Nasabah <br />
                  <span className="text-slate-400 font-mono text-[11px]">HP: 081299999999</span>
                </button>
                <button 
                  onClick={() => fillForm('081388888888', 'password123')} 
                  type="button"
                  className="text-left bg-white hover:bg-emerald-50 border border-slate-200 p-2 rounded-lg transition cursor-pointer"
                >
                  <span className="font-bold text-emerald-800">[PENGEPUL]</span> Rudi Pengepul <br />
                  <span className="text-slate-400 font-mono text-[11px]">HP: 081388888888</span>
                </button>
              </div>
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
