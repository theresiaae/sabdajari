// src/admin/Artikel.jsx
import { Link } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

// Dummy data — nanti ganti dengan fetch dari API
const articles = [
  { id: 1, title: 'Pengenalan Bahasa Isyarat Indonesia', date: '19 Desember 2025', slug: 'pengenalan-bahasa-isyarat-indonesia' },
  { id: 2, title: 'Sejarah Bahasa Isyarat di Indonesia', date: '18 Desember 2025', slug: 'sejarah-bahasa-isyarat-di-indonesia' },
  { id: 3, title: 'Tips Belajar Bahasa Isyarat untuk Pemula', date: '17 Desember 2025', slug: 'tips-belajar-bahasa-isyarat-untuk-pemula' },
];

export default function AdminArtikel() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
        {/* CONTAINER FIXED WIDTH 1000px */}
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Artikel</h1>
          <p className="text-gray-600 mb-6">Tambah, edit, atau hapus artikel</p>

          {/* Add Article Button */}
          <div className="mb-6">
            <Link
              to="/admin/artikel/tambah"
              className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Tambah Artikel
            </Link>
          </div>

          {/* Table Header */}
          <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-700">
              <div>Judul</div>
              <div>Tanggal</div>
              <div>Aksi</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="bg-white rounded-b-xl shadow-md">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="text-sm text-gray-700">{article.title}</div>
                <div className="text-sm text-gray-700">{article.date}</div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/artikel/${article.slug}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    🖊️ Edit
                  </Link>
                  <button
                    onClick={() => alert(`Artikel "${article.title}" dihapus!`)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}