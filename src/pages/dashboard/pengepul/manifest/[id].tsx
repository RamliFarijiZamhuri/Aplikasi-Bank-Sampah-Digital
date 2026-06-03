import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSessionUser } from '../../../../lib/session';
import { dbGet, initializeDatabase } from '../../../../lib/db';
import { Printer, X, Recycle } from 'lucide-react';

interface ManifestPageProps {
  beli: {
    id_pembelian: number;
    tanggal_pembelian: string;
    nama_kategori: string;
    harga_per_kg: number;
    berat_kg: number;
    total_bayar: number;
    nama_pengepul: string;
    nomor_hp_pengepul: string;
    alamat_pengepul: string | null;
    id_user: number;
  };
}

export default function ManifestPage({ beli }: ManifestPageProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="bg-slate-100 min-h-screen p-0 sm:p-4 text-slate-800">
      {/* Floating Print Actions Bar (Hidden on print) */}
      <div className="max-w-3xl mx-auto bg-slate-800 text-white p-4 rounded-b-none sm:rounded-t-2xl shadow-lg flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold font-sans">Manifest Siap Dicetak</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition duration-100 shadow-md flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Sekarang</span>
          </button>
          <button 
            onClick={handleClose}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-lg transition duration-100 cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tutup Halaman</span>
          </button>
        </div>
      </div>

      {/* Manifest Content Area (Styled like A4 paper) */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 shadow-xl rounded-none sm:rounded-b-2xl min-h-[297mm] flex flex-col justify-between border border-slate-200 print:shadow-none print:border-none print:rounded-none">
        
        <div>
          {/* Manifest Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-black tracking-tight text-xl mb-1">
                <Recycle className="w-6 h-6 text-emerald-700" />
                <span className="font-sans">BANK SAMPAH DIGITAL INDONESIA</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm font-normal">
                Kantor Pusat Pelayanan Lingkungan Hidup, Jl. Hijau Sehat No. 100, Jakarta Raya
                <br />Telp: (021) 555-环保 &bull; Email: info@banksampahdigital.or.id
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="inline-block bg-slate-950 text-white font-black text-xs px-3 py-1 rounded tracking-widest uppercase mb-2 font-sans">
                MANIFEST PENJUALAN
              </span>
              <h2 className="font-mono font-bold text-slate-800 text-sm">
                No: MFT/BSD/{new Date(beli.tanggal_pembelian).getFullYear()}/{String(beli.id_pembelian).padStart(4, '0')}
              </h2>
            </div>
          </div>

          {/* Manifest Meta Details */}
          <div className="grid grid-cols-2 gap-8 my-8 text-xs text-slate-800">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-sans">Diterbitkan Untuk:</span>
              <h3 className="font-bold text-slate-900 text-sm mb-1 font-sans">{beli.nama_pengepul}</h3>
              <p className="font-light text-slate-600 leading-relaxed font-sans font-normal">
                <strong>Nomor HP:</strong> {beli.nomor_hp_pengepul}
                <br /><strong>Alamat Gudang:</strong> {beli.alamat_pengepul || 'Gudang Mitra Pengepul'}
                <br /><strong>Role Lisensi:</strong> Pengepul Besar Mitra BSD
              </p>
            </div>
            <div className="space-y-1.5 text-right sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-sans">Informasi Pengiriman:</span>
              <p className="font-light text-slate-600 leading-relaxed inline-block text-left sm:text-right font-sans font-normal">
                <strong>Tanggal Manifest:</strong> {new Date(beli.tanggal_pembelian).toLocaleString('id-ID')}
                <br /><strong>Lokasi Asal:</strong> Depo Gudang Bank Sampah Indah
                <br /><strong>Petugas Gudang:</strong> Admin BSD-Sektor 01
                <br /><strong>Status Niaga:</strong> <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">LUNAS / SELESAI</span>
              </p>
            </div>
          </div>

          {/* Shipping / Items Table */}
          <div className="mt-8">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2 font-sans">Rincian Muatan Niaga:</span>
            <table className="w-full text-left text-sm border-collapse font-sans">
              <thead>
                <tr className="border-y border-slate-900 bg-slate-50 font-bold text-slate-800 text-xs">
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Deskripsi Barang Daur Ulang</th>
                  <th className="px-4 py-3 text-right">Harga Per Kg</th>
                  <th className="px-4 py-3 text-right">Volume Berat (Kg)</th>
                  <th className="px-4 py-3 text-right">Total Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-4 font-mono font-bold">001</td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-slate-900 block">{beli.nama_kategori}</span>
                    <span className="text-xs text-slate-400 block font-normal">Bahan Daur Ulang Partikel Terpilah (Grade A)</span>
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-slate-600">Rp {beli.harga_per_kg.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-4 text-right font-mono font-bold">{(parseFloat(beli.berat_kg.toString()) || 0).toFixed(1)} Kg</td>
                  <td className="px-4 py-4 text-right font-mono font-semibold text-slate-900">Rp {beli.total_bayar.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-900 font-bold bg-slate-50 text-slate-900">
                  <td colSpan={3} className="px-4 py-3 text-right text-xs uppercase tracking-wider">Subtotal:</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{(parseFloat(beli.berat_kg.toString()) || 0).toFixed(1)} Kg</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">Rp {beli.total_bayar.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b-2 border-slate-900 font-black bg-slate-900 text-white">
                  <td colSpan={3} className="px-4 py-3 text-right text-xs uppercase tracking-wider">HARGA TOTAL MANIFEST (LUNAS):</td>
                  <td colSpan={2} className="px-4 py-3 text-right font-mono text-base">Rp {beli.total_bayar.toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Manifest Notes Block */}
          <div className="mt-8 text-[11px] text-slate-500 bg-slate-50 p-4 border border-slate-200 rounded-lg leading-relaxed font-normal">
            <strong>CATATAN CARGO:</strong> Manifest penjualan ini bertindak sebagai bukti timbang keluar gudang resmi dan tanda pelunasan pembayaran niaga daur ulang dari Bank Sampah Digital Indonesia. Seluruh material di atas telah dikeluarkan dari depo gudang dan beralih tanggung jawab muatan penuh kepada pihak pengepul terdaftar.
          </div>
        </div>

        {/* Signatures Panel (Bottom of paper) */}
        <div className="mt-16 pt-8 border-t border-slate-200 font-sans">
          <div className="grid grid-cols-2 text-center text-xs text-slate-800">
            <div className="space-y-16">
              <span>Pihak Penerima (Pengepul Mitra)</span>
              <div className="flex flex-col items-center">
                <span className="font-bold underline text-slate-900">{beli.nama_pengepul}</span>
                <span className="text-[10px] text-slate-400 font-normal">ID Mitra: #MIT-{beli.id_user}</span>
              </div>
            </div>
            <div className="space-y-16">
              <span>Pihak Pengelola (Petugas Gudang)</span>
              <div className="flex flex-col items-center">
                <span className="font-bold underline text-slate-900 text-slate-900">Admin Sektor Gudang BSD</span>
                <span className="text-[10px] text-slate-400 font-normal">Bank Sampah Digital Indonesia</span>
              </div>
            </div>
          </div>
        </div>

      </div>
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

  const { id } = context.query;
  const id_pembelian = parseInt(id as string);

  if (isNaN(id_pembelian)) {
    return { notFound: true };
  }

  try {
    await initializeDatabase();

    const beli = await dbGet(`
      SELECT pp.*, k.nama_kategori, k.harga_per_kg, u.nama AS nama_pengepul, u.nomor_hp AS nomor_hp_pengepul, u.alamat AS alamat_pengepul
      FROM pembelian_pengepul pp
      JOIN kategori_sampah k ON pp.id_kategori = k.id_kategori
      JOIN users u ON pp.id_user = u.id_user
      WHERE pp.id_pembelian = ? AND pp.id_user = ?
    `, [id_pembelian, user.id]);

    if (!beli) {
      return { notFound: true };
    }

    return {
      props: {
        beli: JSON.parse(JSON.stringify(beli)),
      },
    };
  } catch (err) {
    console.error('Error fetching manifest inside props:', err);
    return { notFound: true };
  }
};
