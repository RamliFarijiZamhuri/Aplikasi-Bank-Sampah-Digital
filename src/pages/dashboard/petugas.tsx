import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSessionUser, SessionUser } from '../../lib/session';
import { dbAll, dbGet, initializeDatabase } from '../../lib/db';
import { Leaf, LogOut, CheckSquare, PlusCircle, Scale, Save, Inbox, Edit3, Trash2, Clock, Wallet, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';

interface PetugasDashboardProps {
  user: SessionUser;
  nasabah_list: any[];
  kategori: any[];
  total_setor_count: number;
  all_setor_list: any[];
  pending_withdrawals: any[];
}

export default function PetugasDashboard({
  user,
  nasabah_list,
  kategori,
  total_setor_count,
  all_setor_list,
  pending_withdrawals
}: PetugasDashboardProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form input builders
  const [idNasabah, setIdNasabah] = useState('');
  const [selectedKategoriId, setSelectedKategoriId] = useState('');
  const [beratKg, setBeratKg] = useState('');
  const [buildingReceipt, setBuildingReceipt] = useState<any[]>([]);

  // Update Harga Form states
  const [updateKategoriId, setUpdateKategoriId] = useState('');
  const [hargaBaru, setHargaBaru] = useState('');

  // Register Staff Form states
  const [staffNama, setStaffNama] = useState('');
  const [staffNomorHp, setStaffNomorHp] = useState('');
  const [staffAlamat, setStaffAlamat] = useState('');
  const [staffRole, setStaffRole] = useState('Petugas');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffSubmitting, setStaffSubmitting] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login?success=Berhasil+keluar');
  };

  const handleCategoryPriceSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUpdateKategoriId(value);
    const selectedItem = kategori.find(k => k.id_kategori === parseInt(value));
    if (selectedItem) {
      setHargaBaru(selectedItem.harga_per_kg.toString());
    }
  };

  const addItemToReceipt = () => {
    setError('');
    setSuccess('');

    if (!selectedKategoriId) {
      alert("Pilih kategori sampah terlebih dahulu!");
      return;
    }

    const berat = parseFloat(beratKg);
    if (isNaN(berat) || berat <= 0) {
      alert("Masukkan berat sampah yang valid (> 0)!");
      return;
    }

    const selectedOption = kategori.find(k => k.id_kategori === parseInt(selectedKategoriId));
    if (!selectedOption) return;

    const idKategori = selectedOption.id_kategori;
    const namaKategori = selectedOption.nama_kategori;
    const hargaPerKg = selectedOption.harga_per_kg;

    // Check if item already exists in builders
    const existIdx = buildingReceipt.findIndex(item => item.id_kategori === idKategori);
    if (existIdx > -1) {
      const updated = [...buildingReceipt];
      updated[existIdx].berat_kg += berat;
      updated[existIdx].subtotal = updated[existIdx].berat_kg * updated[existIdx].harga_per_kg;
      setBuildingReceipt(updated);
    } else {
      setBuildingReceipt(prev => [
        ...prev,
        {
          id_kategori: idKategori,
          nama_kategori: namaKategori,
          harga_per_kg: hargaPerKg,
          berat_kg: berat,
          subtotal: berat * hargaPerKg
        }
      ]);
    }

    // Reset weight/category builder input
    setBeratKg('');
    setSelectedKategoriId('');
  };

  const removeItemFromReceipt = (idx: number) => {
    setBuildingReceipt(prev => prev.filter((_, i) => i !== idx));
  };

  const receiptGrandTotal = buildingReceipt.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleSubmitSetor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idNasabah) {
      setError('Harap pilih nasabah penerima!');
      return;
    }

    if (buildingReceipt.length === 0) {
      setError('Tambahkan minimal 1 item sampah ke dalam tabel setoran sebelum menyimpan!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/petugas/setor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_nasabah: parseInt(idNasabah),
          items: buildingReceipt
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyimpan transaksi');
      }

      setSuccess(data.message || 'Transaksi setor sampah berhasil disimpan!');
      setBuildingReceipt([]);
      setIdNasabah('');
      
      // Refresh state from database
      router.replace(router.asPath);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan setoran.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveTarik = async (idTarik: number) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/petugas/approve-tarik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tarik: idTarik })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyetujui penarikan');
      }

      setSuccess(data.message || 'Penarikan berhasil disetujui');
      router.replace(router.asPath);
    } catch (err: any) {
      setError(err.message || 'Gagal menyetujui penarikan');
    }
  };

  const handleRejectTarik = async (idTarik: number) => {
    setError('');
    setSuccess('');

    if (!confirm('Apakah Anda yakin ingin menolak pengajuan ini?')) {
      return;
    }

    try {
      const res = await fetch('/api/petugas/reject-tarik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tarik: idTarik })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menolak penarikan');
      }

      setSuccess(data.message || 'Pengajuan penarikan ditolak');
      router.replace(router.asPath);
    } catch (err: any) {
      setError(err.message || 'Gagal menolak penarikan');
    }
  };

  const handleUpdateHarga = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const idKat = parseInt(updateKategoriId);
    const price = parseFloat(hargaBaru);

    if (isNaN(idKat) || isNaN(price) || price <= 0) {
      setError('Masukkan harga baru yang valid!');
      return;
    }

    try {
      const res = await fetch('/api/petugas/update-harga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_kategori: idKat, harga_per_kg: price })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui harga');
      }

      setSuccess(data.message || 'Harga kategori berhasil diperbarui!');
      setUpdateKategoriId('');
      setHargaBaru('');
      router.replace(router.asPath);
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui harga.');
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!staffNama || !staffNomorHp || !staffRole || !staffPassword) {
      setError('Semua field wajib diisi (kecuali alamat)!');
      return;
    }

    setStaffSubmitting(true);
    try {
      const res = await fetch('/api/admin/create-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: staffNama,
          nomor_hp: staffNomorHp,
          alamat: staffAlamat,
          role: staffRole,
          password: staffPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal membuat akun staff');
      }

      setSuccess(data.message || `Akun ${staffRole} berhasil dibuat secara manual.`);
      // Reset form
      setStaffNama('');
      setStaffNomorHp('');
      setStaffAlamat('');
      setStaffRole('Petugas');
      setStaffPassword('');
      router.replace(router.asPath);
    } catch (err: any) {
      setError(err.message || 'Gagal membuat akun staff.');
    } finally {
      setStaffSubmitting(false);
    }
  };

  // Group setoran logs
  const groupedSetor: Record<number, {
    id_setor: number;
    tanggal_setor: string;
    nama_nasabah: string;
    nomor_hp_nasabah: string;
    nama_petugas: string;
    total: number;
    details: any[];
  }> = {};

  all_setor_list.forEach((item) => {
    if (!groupedSetor[item.id_setor]) {
      groupedSetor[item.id_setor] = {
        id_setor: item.id_setor,
        tanggal_setor: item.tanggal_setor,
        nama_nasabah: item.nama_nasabah,
        nomor_hp_nasabah: item.nomor_hp_nasabah,
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Petugas</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola transaksi timbangan setoran sampah warga, persetujuan penarikan saldo, serta update katalog harga.</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Setoran Form and Recent Transactions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form Input Timbangan Setoran Cepat */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Input Setoran Sampah Baru</h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">Fast Entry</span>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmitSetor} className="space-y-6">
                  {/* Pilih Nasabah */}
                  <div>
                    <label htmlFor="id_nasabah" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-sans">Pilih Nasabah (Warga)</label>
                    <select 
                      name="id_nasabah" 
                      id="id_nasabah" 
                      required
                      value={idNasabah}
                      onChange={(e) => setIdNasabah(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    >
                      <option value="" disabled>-- Pilih Nasabah Penerima --</option>
                      {nasabah_list.map((nasabah) => (
                        <option key={nasabah.id_user} value={nasabah.id_user}>
                          {nasabah.nama} &bull; {nasabah.nomor_hp} (Saldo: Rp {nasabah.saldo.toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Builder Section */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex lg:items-end flex-wrap gap-4 mb-4">
                      {/* Select Kategori */}
                      <div className="flex-grow min-w-[200px]">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Kategori Sampah</label>
                        <select 
                          id="select-kategori" 
                          value={selectedKategoriId}
                          onChange={(e) => setSelectedKategoriId(e.target.value)}
                          className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs leading-normal font-sans"
                        >
                          <option value="" disabled>-- Pilih Kategori --</option>
                          {kategori.map((kat) => (
                            <option key={kat.id_kategori} value={kat.id_kategori}>
                              {kat.nama_kategori} (Rp {kat.harga_per_kg.toLocaleString('id-ID')}/Kg)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Input Berat */}
                      <div className="w-32">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Berat (Kg)</label>
                        <input 
                          type="number" 
                          id="input-berat" 
                          step="0.1" 
                          min="0.1" 
                          placeholder="0.0"
                          value={beratKg}
                          onChange={(e) => setBeratKg(e.target.value)}
                          className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono"
                        />
                      </div>

                      {/* Tambah Button */}
                      <div>
                        <button 
                          type="button" 
                          onClick={addItemToReceipt}
                          className="w-full lg:w-auto py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Tambah Item</span>
                        </button>
                      </div>
                    </div>

                    {/* Receipt Table */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                            <th className="px-4 py-2">Kategori</th>
                            <th className="px-4 py-2 text-right">Harga / Kg</th>
                            <th className="px-4 py-2 text-right">Berat (Kg)</th>
                            <th className="px-4 py-2 text-right">Subtotal</th>
                            <th className="px-4 py-2 text-center w-16">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {buildingReceipt.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic font-sans font-normal">
                                Belum ada item ditambahkan. Gunakan pilihan di atas untuk menambah sampah timbangan.
                              </td>
                            </tr>
                          ) : (
                            buildingReceipt.map((item, index) => (
                              <tr key={index} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-semibold text-slate-800">{item.nama_kategori}</td>
                                <td className="px-4 py-3 text-right font-mono text-slate-600">Rp {item.harga_per_kg.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-900 font-mono">{item.berat_kg.toFixed(1)} Kg</td>
                                <td className="px-4 py-3 text-right text-emerald-800 font-semibold font-mono">Rp {item.subtotal.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3 text-center">
                                  <button 
                                    type="button" 
                                    onClick={() => removeItemFromReceipt(index)}
                                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                            <td colSpan={3} className="px-4 py-3 text-right text-xs uppercase tracking-wider font-bold">Grand Total:</td>
                            <td className="px-4 py-3 text-right text-emerald-700 font-mono text-sm">Rp {receiptGrandTotal.toLocaleString('id-ID')}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{submitting ? 'Menyimpan...' : 'Simpan Transaksi Setor & Update Saldo'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Riwayat Setoran Terbaru di Sistem */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Daftar Setoran Terbaru (Nasabah)</h3>
                <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">{sortedGroupedIds.length} Setoran</span>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-6 py-3">Tanggal Setor</th>
                      <th className="px-6 py-3">Nasabah</th>
                      <th className="px-6 py-3">Timbangan Item</th>
                      <th className="px-6 py-3 text-right">Total Tabungan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                    {sortedGroupedIds.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          Belum ada transaksi di dalam sistem.
                        </td>
                      </tr>
                    ) : (
                      sortedGroupedIds.map((id) => {
                        const tr = groupedSetor[id];
                        return (
                          <tr key={id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-3 font-mono text-slate-400 whitespace-nowrap">
                              {new Date(tr.tanggal_setor).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-3">
                              <div className="font-bold text-slate-800">{tr.nama_nasabah}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{tr.nomor_hp_nasabah}</div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex flex-wrap gap-1">
                                {tr.details.map((detail, dIdx) => (
                                  <span key={dIdx} className="inline-flex bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide mr-1 mb-1 font-semibold">
                                    {detail.nama_kategori}: {detail.berat_kg} Kg
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-emerald-800 font-mono whitespace-nowrap">
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

          </div>

          {/* Column 3: Approvals and Price Updates */}
          <div className="space-y-8">
            
            {/* Persetujuan Penarikan Saldo */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-emerald-50/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">Antrean Persetujuan Saldo</h3>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full font-mono">
                  {pending_withdrawals.length}
                </span>
              </div>

              <div className="p-6">
                {pending_withdrawals.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-10 h-10 text-slate-200" />
                    <span className="font-medium">Tidak ada antrean penarikan dana pending saat ini.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pending_withdrawals.map((tarik) => (
                      <div key={tarik.id_tarik} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between hover:border-emerald-500 transition duration-150">
                        <div className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{tarik.nama_nasabah}</h4>
                              <span className="text-[10px] font-mono text-slate-400">Hp: {tarik.nomor_hp_nasabah}</span>
                            </div>
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-mono font-bold">
                              Rp {tarik.jumlah_tarik.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Diajukan: {new Date(tarik.tanggal_pengajuan).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Wallet className="w-3 h-3 text-emerald-600" />
                            <span>Saldo Terakhir: <strong className="text-slate-800 font-mono">Rp {tarik.saldo_nasabah.toLocaleString('id-ID')}</strong></span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-3">
                          <button 
                            onClick={() => handleApproveTarik(tarik.id_tarik)}
                            type="button"
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center text-[11px] rounded-lg shadow-sm transition block cursor-pointer"
                          >
                            Approve / Setujui
                          </button>
                          <button 
                            onClick={() => handleRejectTarik(tarik.id_tarik)}
                            type="button"
                            className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-center text-[11px] rounded-lg transition block cursor-pointer"
                          >
                            Tolak / Batalkan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Update Kategori Sampah */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Perbarui Harga Sampah</h3>
              </div>

              <div className="p-6">
                <form onSubmit={handleUpdateHarga} className="space-y-4">
                  <div>
                    <label htmlFor="update_id_kategori" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">Pilih Kategori Sampah</label>
                    <select 
                      name="id_kategori" 
                      id="update_id_kategori" 
                      required 
                      value={updateKategoriId}
                      onChange={handleCategoryPriceSelected}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="" disabled>-- Pilih Kategori --</option>
                      {kategori.map((kat) => (
                        <option key={kat.id_kategori} value={kat.id_kategori}>
                          {kat.nama_kategori} (Sekarang: Rp {kat.harga_per_kg}/Kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="harga_baru" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">Harga Baru Per Kg (Rupiah)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                        Rp
                      </div>
                      <input 
                        type="number" 
                        name="harga_per_kg" 
                        id="harga_baru" 
                        required 
                        min="100" 
                        step="50" 
                        placeholder="Contoh: 2500"
                        value={hargaBaru}
                        onChange={(e) => setHargaBaru(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition cursor-pointer">
                    Perbarui Harga Katalog
                  </button>
                </form>
              </div>
            </div>

            {/* Form Registrasi Staff Baru */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Tambah Petugas / Pengepul</h3>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreateStaff} className="space-y-4">
                  <div>
                    <label htmlFor="staff_nama" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">Nama Lengkap</label>
                    <input 
                      type="text" 
                      id="staff_nama" 
                      required 
                      placeholder="Nama Lengkap Staff"
                      value={staffNama}
                      onChange={(e) => setStaffNama(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="staff_nomor_hp" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">Nomor HP</label>
                    <input 
                      type="text" 
                      id="staff_nomor_hp" 
                      required 
                      placeholder="Contoh: 0812xxxxxxxx"
                      value={staffNomorHp}
                      onChange={(e) => setStaffNomorHp(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="staff_alamat" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">Alamat (Opsional)</label>
                    <textarea 
                      id="staff_alamat" 
                      rows={2}
                      placeholder="Alamat Lengkap"
                      value={staffAlamat}
                      onChange={(e) => setStaffAlamat(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="staff_role" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">Pilihan Role</label>
                    <select 
                      id="staff_role" 
                      required
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white transition"
                    >
                      <option value="Petugas">Petugas</option>
                      <option value="Pengepul">Pengepul</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="staff_password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">Kata Sandi</label>
                    <input 
                      type="password" 
                      id="staff_password" 
                      required 
                      placeholder="••••••••"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white transition"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={staffSubmitting}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    {staffSubmitting ? 'Memproses...' : 'Daftarkan Staff Baru'}
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-6 border-t border-slate-700 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 Bank Sampah Digital. Semua hak dilindungi &bull; Tata Kelola Hijau Mandiri Sektor Petugas.</p>
        </div>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSessionUser(context.req);
  if (!user || user.role !== 'Petugas') {
    return {
      redirect: {
        destination: '/login?error=Silakan+masuk+terlebih+dahulu',
        permanent: false,
      },
    };
  }

  try {
    await initializeDatabase();

    const nasabah_list = await dbAll("SELECT id_user, nama, nomor_hp, saldo FROM users WHERE role = 'Nasabah' ORDER BY nama ASC");
    const kategori = await dbAll('SELECT * FROM kategori_sampah ORDER BY id_kategori ASC');
    
    const countRow = await dbGet('SELECT COUNT(DISTINCT id_setor) AS c FROM transaksi_setor');
    const total_setor_count = countRow ? countRow.c : 0;

    // Detailed deposit list
    const all_setor_list = await dbAll(`
      SELECT ts.id_setor, ts.tanggal_setor, ds.berat_kg, ds.subtotal, k.nama_kategori, 
             u_nasabah.nama AS nama_nasabah, u_nasabah.nomor_hp AS nomor_hp_nasabah, 
             u_petugas.nama AS nama_petugas
      FROM transaksi_setor ts
      JOIN detail_setor ds ON ts.id_setor = ds.id_setor
      JOIN kategori_sampah k ON ds.id_kategori = k.id_kategori
      JOIN users u_nasabah ON ts.id_user = u_nasabah.id_user
      JOIN users u_petugas ON ts.id_petugas = u_petugas.id_user
      ORDER BY ts.tanggal_setor DESC
    `);

    // Pending withdrawal requests with user current details
    const pending_withdrawals = await dbAll(`
      SELECT ps.*, u.nama AS nama_nasabah, u.nomor_hp AS nomor_hp_nasabah, u.saldo AS saldo_nasabah
      FROM penarikan_saldo ps
      JOIN users u ON ps.id_user = u.id_user
      WHERE ps.status = 'Pending'
      ORDER BY ps.tanggal_pengajuan ASC
    `);

    return {
      props: {
        user,
        nasabah_list: JSON.parse(JSON.stringify(nasabah_list)),
        kategori: JSON.parse(JSON.stringify(kategori)),
        total_setor_count,
        all_setor_list: JSON.parse(JSON.stringify(all_setor_list)),
        pending_withdrawals: JSON.parse(JSON.stringify(pending_withdrawals))
      }
    };
  } catch (err) {
    console.error('Error on Petugas dashboard getServerSideProps:', err);
    return {
      notFound: true
    };
  }
};
