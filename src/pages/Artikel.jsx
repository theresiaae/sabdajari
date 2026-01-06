// src/pages/Artikel.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';

export default function Artikel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles/');
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

  if (loading) return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-[1000px]">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="space-y-6">
              {Array(4).fill().map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (error) return (
    <div className="flex h-screen bg-white">
      <Sidebar />
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
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Artikel</h1>
          <p className="text-gray-600 mb-6">Artikel tersedia untuk kamu baca.</p>

          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.slug} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* 🖼️ COVER IMAGE - TIDAK KEPOOTONG */}
                <div className="relative w-full h-64 bg-gray-100">
<img
  src={`http://localhost:5000${article.cover_image}`}
  alt={article.title}
  className="absolute inset-0 w-full h-full object-cover object-center"
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/600x300?text=Gambar+Tidak+Tersedia';
  }}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h2>
                  <p className="text-gray-600 mb-4">{article.content.substring(0, 150)}...</p>
                  <Link
                    to={`/artikel/${article.slug}`}
                    className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}