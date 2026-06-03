import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSessionUser, SessionUser } from '../../lib/session';
import { dbGet, dbAll, initializeDatabase } from '../../lib/db';
import { Leaf, LogOut, Clock, Wallet, Info, Banknote, Send, History, Tag, Package, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

interface NasabahDashboardProps {
  user: SessionUser;
  balance: number;
  total_berat: number;
  total_pendapatan: number;
  total_tertarik: number;
  list_setor: any[];
  list_tarik: any[];
  kategori: any[];
}

export default function NasabahDashboard({
  user,
  balance,
  total_berat,
  total_pendapatan,
  total_tertarik,
  list_setor,
  list_tarik,
  kategori
}: NasabahDashboardProps) {
  const router = useRouter();
  const [jumlahTarik, setJumlahTarik] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login?success=Berhasil+keluar');
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const parsedNum = parseFloat(jumlahTarik);
    if (isNaN(parsedNum) || parsedNum <= 0) {
      setError('Nominal penarikan tidak valid');
      return;
    }

    if (parsedNum > balance) {
      setError(`Saldo tidak mencukupi! Saldo Anda hanya Rp ${balance.toLocaleString('id-ID')}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/nasabah/tarik', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jumlah_tarik: parsedNum }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengirim pengajuan penarikan');
      }

      setSuccess(data.message || 'Pengajuan penarikan berhasil terkirim!');
      setJumlahTarik('');
      
      // Refresh server-side props to update table queues
      router.replace(router.asPath);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim pengajuan.');
    } finally {
      setSubmitting(false);
    }
  };

  // Group setoran items by id_setor
  const groupedSetor: Record<number, {
    id_setor: number;
    tanggal_setor: string;
    nama_petugas: string;
    total: number;
    details: any[];
  }> = {};

  list_setor.forEach((item) => {
    if (!groupedSetor[item.id_setor]) {
      groupedSetor[item.id_setor] = {
        id_setor: item.id_setor,
        tanggal_setor: item.tanggal_setor,
        nama_petugas: item.nama_petugas,
        total: 0,
        details: []
      };
    }
    groupedSetor[item.id_setor].details.push(item);
    groupedSetor[item.id_setor].total += item.subtotal;
  });

  const sortedGroupedIds = Object.keys(groupedSetor)
    .map(Number)
    .sort((a, b) => b - a);

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
        {/* Greeting row */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Halo, {user.nama}!</h1>
            <p className="text-sm text-slate-500 mt-1">Pantau perkembangan saldo, riwayat setor sampah, dan ajukan penarikan dana Anda.</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-100 text-emerald-800 py-1.5 px-3 rounded-lg font-mono">
            <Clock className="w-4 h-4" />
            <span>Hari Ini: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Message Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg text-sm text-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Statistics Grid & Quick Action */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card Saldo */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
              <Wallet className="w-48 h-48" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-widest block">Saldo Tabungan Saat Ini</span>
              <span className="text-4xl font-black mt-2 block tracking-tight">
                Rp {(balance || 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs text-emerald-200">
              <span>ID Nasabah: #{user.id}</span>
              <span>No HP: {user.nomor_hp}</span>
            </div>
          </div>

          {/* Card Stats Ringkas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-48">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Ringkasan Tabungan Anda</span>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border-l-2 border-emerald-500 pl-3">
                  <span className="text-[11px] text-slate-400 block uppercase font-medium">Beban Setor</span>
                  <span className="text-lg font-bold text-slate-800 font-mono">{(total_berat || 0).toFixed(1)} Kg</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3">
                  <span className="text-[11px] text-slate-400 block uppercase font-medium">Total Akumulasi</span>
                  <span className="text-lg font-bold text-slate-800 font-mono">Rp {(total_pendapatan || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1 pt-2 border-t border-slate-100">
              <Info className="w-3.5 h-3.5" />
              Dihitung otomatis dari seluruh transaksi sukses.
            </div>
          </div>

          {/* Form Pengajuan Penarikan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-800">Tarik Saldo</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 font-normal">Ajukan penarikan saldo ke rekening/pembayaran cash. Petugas akan memvalidasi pengajuan Anda.</p>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nominal Penarikan (Rupiah)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                    Rp
                  </div>
                  <input 
                    type="number" 
                    name="jumlah_tarik" 
                    value={jumlahTarik}
                    onChange={(e) => setJumlahTarik(e.target.value)}
                    required 
                    min="1000" 
                    step="500" 
                    placeholder="Min. 1.000"
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Main Content Grid (Tables) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left & Center Columns: Transaction histories */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Riwayat Setoran Sampah */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-600" />
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Riwayat Setoran Sampah</h3>
                </div>
                <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">{sortedGroupedIds.length} Transaksi</span>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-6 py-3">Tanggal Setor</th>
                      <th className="px-6 py-3">Petugas</th>
                      <th className="px-6 py-3">Detail Setoran</th>
                      <th className="px-6 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {sortedGroupedIds.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Info className="w-8 h-8 text-slate-300" />
                            <span>Belum ada transaksi setoran sampah.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedGroupedIds.map((id) => {
                        const tr = groupedSetor[id];
                        return (
                          <tr key={id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                              {new Date(tr.tanggal_setor).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-800 text-xs">
                              {tr.nama_petugas}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {tr.details.map((detail, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-full mr-1 mb-1">
                                    <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full"></span>
                                    {detail.nama_kategori}: <strong>{detail.berat_kg} Kg</strong>
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900 font-mono">
                              Rp {tr.total.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Riwayat Penarikan Saldo */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-600" />
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Riwayat Penarikan Dana</h3>
                </div>
                <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">{list_tarik.length} Pengajuan</span>
              </div>

              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Tanggal Pengajuan</th>
                      <th className="px-6 py-3 text-right">Jumlah Tarik</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-xs">
                    {list_tarik.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-sans">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Info className="w-8 h-8 text-slate-300" />
                            <span>Belum ada pengajuan penarikan dana.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      list_tarik.map((tarik) => (
                        <tr key={tarik.id_tarik} className="hover:bg-slate-50/50">
                          <td className="px-6 py-3 font-semibold text-slate-500">
                            #TRK-{tarik.id_tarik}
                          </td>
                          <td className="px-6 py-3 text-slate-500">
                            {new Date(tarik.tanggal_pengajuan).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-3 text-right font-bold text-slate-950">
                            Rp {tarik.jumlah_tarik.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {tarik.status === 'Pending' ? (
                              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-sans">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                Proses Verifikasi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-sans">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Dana Dikirim
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Garbage Catalog */}
          <div className="space-y-8">
            
            {/* Katalog Harga */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-emerald-50 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">Katalog Harga Hari Ini</h3>
              </div>

              <div className="p-6">
                <p className="text-xs text-slate-500 mb-4">Harga dapat berubah sewaktu-waktu sesuai dengan ketetapan pasar dan tata kelola pengelola Bank Sampah.</p>
                <div className="divide-y divide-slate-100">
                  {kategori.map((kat) => (
                    <div key={kat.id_kategori} className="flex items-center justify-between py-3.5 hover:bg-slate-50/50 px-2 rounded-lg transition duration-150">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-800">{kat.nama_kategori}</span>
                          <span className="text-[10px] text-slate-400 block tracking-wider font-mono uppercase">ID Kategori: {kat.id_kategori}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-700 font-extrabold text-sm font-mono block">Rp {kat.harga_per_kg.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-slate-400 block font-medium">per kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panduan Ramah Lingkungan */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>PANDUAN SETOR SAMPAH</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Sebelum membawa sampah ke Kantor Bank Sampah, pastikan:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 mt-2 pl-1 font-normal">
                <li>Sampah sudah dipilah sesuai dengan kategori (Plastik, Kertas/Kardus, Besi/Logam).</li>
                <li>Sampah plastik dalam keadaan sudah dibilas bersih dan kering.</li>
                <li>Laporkan nomor HP Anda yang terdaftar pada Petugas di meja loket timbangan.</li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-6 border-t border-slate-700 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 Bank Sampah Digital. Semua hak dilindungi &bull; Menabung untuk Hari Esok yang Lebih Hijau.</p>
        </div>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSessionUser(context.req);
  if (!user || user.role !== 'Nasabah') {
    return {
      redirect: {
        destination: '/login?error=Silakan+masuk+terlebih+dahulu',
        permanent: false,
      },
    };
  }

  try {
    await initializeDatabase();
    const userId = user.id;

    // Current Balance
    const userRow = await dbGet('SELECT saldo FROM users WHERE id_user = ?', [userId]);
    const balance = userRow ? userRow.saldo : 0;

    // Weight deposited (sum of kg)
    const weightRow = await dbGet(`
      SELECT SUM(ds.berat_kg) AS total_berat 
      FROM detail_setor ds 
      JOIN transaksi_setor ts ON ds.id_setor = ts.id_setor 
      WHERE ts.id_user = ?
    `, [userId]);
    const total_berat = weightRow ? weightRow.total_berat : 0;

    // Total income from deposits (sum of subtotal)
    const incomeRow = await dbGet(`
      SELECT SUM(ds.subtotal) AS total_pendapatan 
      FROM detail_setor ds 
      JOIN transaksi_setor ts ON ds.id_setor = ts.id_setor 
      WHERE ts.id_user = ?
    `, [userId]);
    const total_pendapatan = incomeRow ? incomeRow.total_pendapatan : 0;

    // Successful withdrawals
    const wdRow = await dbGet(`
      SELECT SUM(jumlah_tarik) AS total_tertarik 
      FROM penarikan_saldo 
      WHERE id_user = ? AND status = 'Success'
    `, [userId]);
    const total_tertarik = wdRow ? wdRow.total_tertarik : 0;

    // Deposit details list
    const list_setor = await dbAll(`
      SELECT ts.id_setor, ts.tanggal_setor, ds.berat_kg, ds.subtotal, k.nama_kategori, u_petugas.nama AS nama_petugas
      FROM transaksi_setor ts
      JOIN detail_setor ds ON ts.id_setor = ds.id_setor
      JOIN kategori_sampah k ON ds.id_kategori = k.id_kategori
      JOIN users u_petugas ON ts.id_petugas = u_petugas.id_user
      WHERE ts.id_user = ?
      ORDER BY ts.tanggal_setor DESC
    `, [userId]);

    // Withdrawal list
    const list_tarik = await dbAll('SELECT * FROM penarikan_saldo WHERE id_user = ? ORDER BY tanggal_pengajuan DESC', [userId]);

    // Trash catalog list
    const kategori = await dbAll('SELECT * FROM kategori_sampah ORDER BY id_kategori ASC');

    return {
      props: {
        user,
        balance,
        total_berat: total_berat || 0,
        total_pendapatan: total_pendapatan || 0,
        total_tertarik: total_tertarik || 0,
        list_setor: JSON.parse(JSON.stringify(list_setor)),
        list_tarik: JSON.parse(JSON.stringify(list_tarik)),
        kategori: JSON.parse(JSON.stringify(kategori)),
      },
    };
  } catch (err) {
    console.error('Error on Nasabah dashboard getServerSideProps:', err);
    return {
      notFound: true,
    };
  }
};
