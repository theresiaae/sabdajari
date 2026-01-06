// src/admin/Artikel.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

export default function AdminArtikel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();
        setArticles(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Gagal menghapus artikel');
      
      // Refresh daftar
      setArticles(articles.filter(a => a.slug !== slug));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-[1000px]">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {Array(5).fill().map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (error) return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-[1000px] text-center py-12">
          <h2 className="text-xl text-red-600 mb-2">Error: {error}</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Artikel</h1>
          <p className="text-gray-600 mb-6">Tambah, edit, atau hapus artikel</p>

          <div className="mb-6">
            <Link
              to="/admin/artikel/tambah"
              className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Tambah Artikel
            </Link>
          </div>

          <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-700">
              <div>Judul</div>
              <div>Tanggal</div>
              <div>Aksi</div>
            </div>
          </div>

          <div className="bg-white rounded-b-xl shadow-md">
            {articles.map((article, index) => (
              <div
                key={article.slug}
                className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="text-sm text-gray-700">{article.title}</div>
                <div className="text-sm text-gray-700">
                  {new Date(article.created_at).toLocaleDateString('id-ID')}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/artikel/${article.slug}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    🖊️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article.slug)}
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