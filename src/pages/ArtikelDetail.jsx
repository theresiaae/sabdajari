// src/pages/ArtikelDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';

export default function ArtikelDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/articles/${slug}`);
        if (!response.ok) throw new Error('Artikel tidak ditemukan');
        const data = await response.json();
        setArticle(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[1000px]">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (error) return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[1000px] text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/artikel')} 
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Kembali ke Artikel
          </button>
        </div>
      </main>
    </div>
  );

  if (!article) return null;

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[1000px]">
          <button 
            onClick={() => navigate('/artikel')} 
            className="inline-flex items-center gap-1 text-blue-600 mb-6 hover:underline"
          >
            ← Kembali ke Artikel
          </button>

          {/* 🖼️ COVER IMAGE - PENUH & TIDAK KEPOOTONG */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="relative w-full h-96 bg-gray-100">  {/* h-96 = 24rem = 384px */}
              <img
                src={`http://localhost:5000${article.cover_image}`}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x600?text=Gambar+Tidak+Tersedia';
                }}
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{article.title}</h1>
              <div 
                className="prose prose-lg text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/artikel')}
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Kembali ke Artikel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}