// src/admin/Dashboard.jsx
import { Link } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

export default function AdminDashboard() {

  const totalHuruf = 26;
  const totalArtikel = 3;

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">

        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-6">Selamat datang di panel admin BISINDO</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Huruf Kamus */}
            <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Total Huruf Kamus</div>
                <div className="text-3xl font-bold text-gray-800">{totalHuruf}</div>
                <div className="text-xs text-gray-500">Huruf A-Z dalam kamus</div>
              </div>
              <div className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M18 14h.01M15 11h3M12 11h.01M9 11h.01M7 21h10v-2a3 3 0 00-5.356-1.857M7 21H5a2 2 0 01-2-2v-6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>

            {/* Total Artikel */}
            <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Total Artikel</div>
                <div className="text-3xl font-bold text-gray-800">{totalArtikel}</div>
                <div className="text-xs text-gray-500">Artikel yang dipublikasikan</div>
              </div>
              <div className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 56a2 2 0 110-4 2 2 0 010 4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Navigasi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kelola Kamus */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                📝 Kelola Kamus
              </h3>
              <p className="text-gray-600 mb-4">Edit deskripsi dan gambar untuk huruf A–Z</p>
              <Link
                to="/admin/kamus"
                className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Buka Kamus →
              </Link>
            </div>

            {/* Kelola Artikel */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                📄 Kelola Artikel
              </h3>
              <p className="text-gray-600 mb-4">Tambah, edit, atau hapus artikel</p>
              <Link
                to="/admin/artikel"
                className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Buka Artikel →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}