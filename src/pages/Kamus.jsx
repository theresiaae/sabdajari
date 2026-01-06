// src/pages/Kamus.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';

export default function Kamus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari backend
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/letters');
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();
        setLetters(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  const filteredLetters = letters.filter(letter =>
    letter.letter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="w-full px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-6 mx-auto"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {Array(26).fill().map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
      <main className="flex-1 p-6">
        <div className="w-full px-6">
          <div className="text-center py-12">
            <h2 className="text-xl text-red-600 mb-2">Error: {error}</h2>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-white">
        <div className="w-full px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kamus Bahasa Isyarat Indonesia</h1>
          <p className="text-gray-600 mb-6">
            Pelajari alfabet bahasa isyarat Indonesia dengan mudah dan interaktif. Klik huruf mana saja untuk melihat gerakan tangan yang tepat.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Cari Huruf A-Z..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Grid Letters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filteredLetters.map((letter) => (
              <Link
                key={letter.letter}
                to={`/kamus/${letter.letter}`}
                className="block"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:bg-indigo-50 transition-colors">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {letter.letter}
                  </div>
                  <div className="text-xs text-gray-500">Huruf {letter.letter}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-sm text-gray-500">
            Total: {letters.length} huruf • Klik huruf untuk melihat gerakan tangan
          </div>
          <div className="mt-2 text-sm text-gray-500">
            💡 Tip: Gunakan kotak pencarian untuk menemukan huruf dengan cepat
          </div>
        </div>
      </main>
    </div>
  );
}