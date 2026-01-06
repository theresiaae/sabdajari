// src/admin/Kamus.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

export default function AdminKamus() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/letters/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
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

  if (loading) return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-[1000px]">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Kamus</h1>
          <p className="text-gray-600 mb-6">Edit deskripsi dan gambar untuk setiap huruf A–Z</p>

          <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-700">
              <div>Huruf</div>
              <div>Gambar</div>
              <div>Deskripsi Gerakan</div>
              <div>Tips & Trik</div>
              <div>Aksi</div>
            </div>
          </div>

          <div className="bg-white rounded-b-xl shadow-md">
            {letters.map((letter, index) => (
              <div
                key={letter.letter}
                className={`grid grid-cols-6 gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="font-bold text-blue-600">{letter.letter}</div>
                <div>
                  <img
                    src={`http://localhost:5000${letter.image_path}`}
                    alt={`Gambar huruf ${letter.letter}`}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => e.target.src = '/placeholder.png'}
                  />
                </div>
                <div className="text-sm text-gray-700">{letter.description.substring(0, 50)}...</div>
                <div className="text-sm text-gray-700">{letter.tips.substring(0, 50)}...</div>
                <div>
                  <Link
                    to={`/admin/kamus/${letter.letter}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    🖊️ Edit
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