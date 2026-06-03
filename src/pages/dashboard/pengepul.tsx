import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSessionUser, SessionUser } from '../../lib/session';
import { dbAll, initializeDatabase } from '../../lib/db';
import { Leaf, LogOut, Package, Info, History, Printer, ShoppingCart, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface PengepulDashboardProps {
  user: SessionUser;
  gudang_stok: any[];
  riwayat_pembelian: any[];
}

export default function PengepulDashboard({
  user,
  gudang_stok,
  riwayat_pembelian
}: PengepulDashboardProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [buying, setBuying] = useState(false);

  // Form states
  const [idKategori, setIdKategori] = useState('');
  const [beratKg, setBeratKg] = useState('');
  
  // Realtime estimators
  const [activeStok, setActiveStok] = useState(0);
  const [activeHarga, setActiveHarga] = useState(0);
  const [estimationWarning, setEstimationWarning] = useState('');
  const [estimasiBayar, setEstimasiBayar] = useState(0);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login?success=Berhasil+keluar');
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIdKategori(value);

    if (value === "") {
      setActiveStok(0);
      setActiveHarga(0);
      return;
    }

    const item = gudang_stok.find(g => g.id_kategori === parseInt(value));
    if (item) {
      const stock = parseFloat(item.stok_sekarang) || 0;
      const price = parseFloat(item.harga_per_kg) || 0;
      setActiveStok(stock);
      setActiveHarga(price);
    }
  };

  // Run calculation in sync with inputs
  useEffect(() => {
    const inputWeight = parseFloat(beratKg) || 0;
    setEstimasiBayar(inputWeight * activeHarga);

    if (inputWeight > activeStok && activeStok >= 0 && beratKg !== "") {
      setEstimationWarning(`Jumlah melebihi stok gudang! Stok tersedia hanya ${activeStok.toFixed(1)} Kg`);
    } else {
      setEstimationWarning('');
    }
  }, [beratKg, activeStok, activeHarga]);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const parsedId = parseInt(idKategori);
    const parsedWeight = parseFloat(beratKg);

    if (isNaN(parsedId)) {
      setError('Pilih item sampah gudang terlebih dahulu!');
      return;
    }

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Masukkan berat pembelian yang valid (> 0)');
      return;
    }

    if (parsedWeight > activeStok) {
      setError('Gagal membeli! Berat yang dimasukkan melebihi stok gudang.');
      return;
    }

    setBuying(true);
    try {
      const res = await fetch('/api/pengepul/beli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_kategori: parsedId, berat_kg: parsedWeight })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Pembelian gagal');
      }

      setSuccess(data.message || 'Pembelian berhasil!');
      // Reset fields
      setIdKategori('');
      setBeratKg('');
      setActiveStok(0);
      setActiveHarga(0);
      setEstimasiBayar(0);
      
      router.replace(router.asPath);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-emerald-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-200" />
              <span className="font-bold text-lg tracking-tight">Bank Sampah Digital</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold">{user.nama}</span>
                <span className="text-xs text-emerald-200 uppercase font-mono tracking-wider">Role: {user.role}</span>
              </div>
              <span className="bg-emerald-800 text-emerald-100 text-[11px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider md:hidden">
                {user.role}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Greeting & Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Portal Mitra Pengepul</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau stok bahan daur ulang di gudang utama, lakukan pembelian borongan, dan cetak manifest pengiriman niaga.</p>
        </div>

        {/* Message Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-center gap-2 font-sans font-normal">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg text-sm text-green-700 flex items-center gap-2 font-sans font-normal">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* LIVE STOK GUDANG UTAMA */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-emerald-700" />
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight uppercase font-sans">STATUS INVENTARIS GUDANG SAAT INI</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gudang_stok.map((item) => {
              const roundedStok = (parseFloat(item.stok_sekarang) || 0).toFixed(1);
              return (
                <div key={item.id_kategori} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
                  <div className="p-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Kategori Sampah</span>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 font-sans">
                      <Package className="w-5 h-5 text-emerald-600" />
                      {item.nama_kategori}
                    </h3>
                    
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-3xl font-black text-slate-900 font-mono">{roundedStok}</span>
                      <span className="text-sm font-bold text-slate-500 uppercase">Kg</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-normal">
                      <Info className="w-3.5 h-3.5" />
                      Stok dinamis di dalam gudang
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Harga Jual:</span>
                    <span className="text-emerald-700 font-bold font-mono">Rp {item.harga_per_kg.toLocaleString('id-ID')}/Kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN INTERACTIVE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Box 1: Form Pembelian Borongan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-1">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-sans">Beli Sampah Dari Gudang</h3>
            </div>

            <div className="p-6">
              <p className="text-xs text-slate-500 mb-6 font-normal">Pilih kategori sampah di gudang yang ingin Anda beli. Sistem akan memvalidasi stok gudang secara real-time.</p>
              
              <form onSubmit={handlePurchase} className="space-y-4">
                {/* Select Kategori */}
                <div>
                  <label htmlFor="id_kategori" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-sans">Item Sampah</label>
                  <select 
                    name="id_kategori" 
                    id="id_kategori" 
                    required 
                    value={idKategori}
                    onChange={handleCategorySelect}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    <option value="" disabled>-- Pilih Sampah Gudang --</option>
                    {gudang_stok.map((item) => (
                      <option key={item.id_kategori} value={item.id_kategori}>
                        {item.nama_kategori} (Stok: {(parseFloat(item.stok_sekarang) || 0).toFixed(1)} Kg &bull; Rp {item.harga_per_kg}/Kg)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input Berat */}
                <div>
                  <label htmlFor="berat_kg" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-sans">Berat Yang Dibeli (Kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    name="berat_kg" 
                    id="berat_kg" 
                    required 
                    placeholder="0.0" 
                    value={beratKg}
                    onChange={(e) => setBeratKg(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition font-mono"
                  />
                  {estimationWarning && (
                    <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{estimationWarning}</span>
                    </p>
                  )}
                </div>

                {/* Kalkulasi Estimasi Bayar */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 text-xs">
                  <div className="flex justify-between items-center text-slate-500 mb-1.5 font-sans">
                    <span>Harga Satuan:</span>
                    <span className="font-mono text-slate-700 font-bold">Rp {activeHarga.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 mb-3 font-sans">
                    <span>Tersedia di Gudang:</span>
                    <span className="font-mono text-slate-700 font-bold">{activeStok.toFixed(1)} Kg</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-slate-800 font-bold font-sans">
                    <span>Total Estimasi Bayar:</span>
                    <span className="font-mono text-base text-emerald-800 font-black">Rp {estimasiBayar.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={buying || !!estimationWarning}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center text-sm rounded-lg shadow-md transition duration-150 cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{buying ? 'Memproses...' : 'Proses Checkout Sampah'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Box 2: Riwayat Transaksi Pembelian & Manifest */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide font-sans">Riwayat Pembelian Mitra</h3>
              </div>
              <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">{riwayat_pembelian.length} Transaksi</span>
            </div>

            <div className="overflow-x-auto max-h-[460px]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="px-6 py-3">Tanggal Pembelian</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3 text-right">Berat (Kg)</th>
                    <th className="px-6 py-3 text-right">Total Transaksi</th>
                    <th className="px-6 py-3 text-center">Manifest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {riwayat_pembelian.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Info className="w-8 h-8 text-slate-300" />
                          <span>Mitra belum melakukan transaksi pembelian sampah gudang.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    riwayat_pembelian.map((beli) => (
                      <tr key={beli.id_pembelian} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 whitespace-nowrap text-xs text-slate-400 font-mono">
                          {new Date(beli.tanggal_pembelian).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-3.5 font-bold text-slate-800 text-xs">
                          {beli.nama_kategori}
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold text-slate-900 font-mono text-xs">
                          {(parseFloat(beli.berat_kg) || 0).toFixed(1)} Kg
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold text-emerald-800 font-mono text-xs">
                          Rp {beli.total_bayar.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <a 
                            href={`/dashboard/pengepul/manifest/${beli.id_pembelian}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 px-2.5 py-1 rounded text-[11px] font-bold transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Manifest</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-6 border-t border-slate-700 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 Bank Sampah Digital. Semua hak dilindungi &bull; Sirkular Hub Ekonomi Pengepul Makmur.</p>
        </div>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSessionUser(context.req);
  if (!user || user.role !== 'Pengepul') {
    return {
      redirect: {
        destination: '/login?error=Silakan+masuk+terlebih+dahulu',
        permanent: false,
      },
    };
  }

  try {
    await initializeDatabase();
    const pengepulId = user.id;

    // Get dynamic stock in warehouse (Total Deposited Kg - Total Purchased Kg by Pengepul)
    const gudang_stok = await dbAll(`
      SELECT 
        k.id_kategori,
        k.nama_kategori,
        k.harga_per_kg,
        COALESCE((SELECT SUM(ds.berat_kg) FROM detail_setor ds WHERE ds.id_kategori = k.id_kategori), 0) AS total_masuk,
        COALESCE((SELECT SUM(pp.berat_kg) FROM pembelian_pengepul pp WHERE pp.id_kategori = k.id_kategori), 0) AS total_keluar,
        (COALESCE((SELECT SUM(ds.berat_kg) FROM detail_setor ds WHERE ds.id_kategori = k.id_kategori), 0) - 
         COALESCE((SELECT SUM(pp.berat_kg) FROM pembelian_pengepul pp WHERE pp.id_kategori = k.id_kategori), 0)) AS stok_sekarang
      FROM kategori_sampah k
      ORDER BY k.id_kategori ASC
    `);

    // Previous purchases made by this Pengepul user
    const riwayat_pembelian = await dbAll(`
      SELECT pp.*, k.nama_kategori, k.harga_per_kg
      FROM pembelian_pengepul pp
      JOIN kategori_sampah k ON pp.id_kategori = k.id_kategori
      WHERE pp.id_user = ?
      ORDER BY pp.tanggal_pembelian DESC
    `, [pengepulId]);

    return {
      props: {
        user,
        gudang_stok: JSON.parse(JSON.stringify(gudang_stok)),
        riwayat_pembelian: JSON.parse(JSON.stringify(riwayat_pembelian))
      }
    };

  } catch (err) {
    console.error('Error in Pengepul server-side calculation:', err);
    return {
      notFound: true
    };
  }
};
