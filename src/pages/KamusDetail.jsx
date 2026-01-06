// src/pages/KamusDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

export default function KamusDetail() {
  const { letter } = useParams();
  const navigate = useNavigate();
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data huruf dari backend
  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/letters/${letter}`);
        if (!response.ok) throw new Error('Huruf tidak ditemukan');
        const data = await response.json();
        setLetterData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLetter();
  }, [letter]);

  // Fetch semua huruf untuk navigasi
  const [allLetters, setAllLetters] = useState([]);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/letters');
        const data = await res.json();
        setAllLetters(data);
      } catch (err) {
        console.error("Gagal fetch semua huruf:", err);
      }
    };
    fetchAll();
  }, []);

  const currentIndex = allLetters.findIndex(l => l.letter === letter);
  const prevLetter = currentIndex > 0 ? allLetters[currentIndex - 1]?.letter : null;
  const nextLetter = currentIndex < allLetters.length - 1 ? allLetters[currentIndex + 1]?.letter : null;

  if (loading) return (
    <MainLayout>
      <div className="w-[1000px] mx-auto px-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-12 bg-gray-200 rounded w-1/6 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </MainLayout>
  );

  if (error) return (
    <MainLayout>
      <div className="w-[1000px] mx-auto px-6 text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/kamus')} 
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Kembali ke Kamus
        </button>
      </div>
    </MainLayout>
  );

  if (!letterData) return null;

  return (
    <MainLayout>
      <div className="w-[1000px] mx-auto px-6">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/kamus')} 
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            ← Kembali ke Kamus
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">HURUF</h1>
          <h2 className="text-8xl font-black text-gray-800 mb-3">{letterData.letter}</h2>
          <p className="text-xl text-gray-600">Bahasa Isyarat Indonesia</p>
        </div>

        <div className="w-full bg-gray-100 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Gerakan Tangan</h3>
          <div className="flex justify-center">
            <img
              src={`http://localhost:5000${letterData.image_path}`}
              alt={`Gerakan tangan huruf ${letterData.letter}`}
              className="rounded-lg shadow-md w-64 h-64 object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-hand.png'; // gambar placeholder
              }}
            />
          </div>
        </div>

        <div className="w-full bg-indigo-50 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📄 Deskripsi Gerakan
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{letterData.description}</p>
        </div>

        <div className="w-full bg-indigo-100 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💡 Tips & Trik
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {letterData.tips.split('\n').map((tip, index) => (
              <li key={index}>{tip.trim()}</li>
            ))}
          </ul>
        </div>

        <div className="w-full flex justify-center gap-3 mt-8">
          <button
            onClick={() => prevLetter && navigate(`/kamus/${prevLetter}`)}
            disabled={!prevLetter}
            className={`px-4 py-2 rounded ${
              prevLetter
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            ← Sebelumnya
          </button>

          <button
            onClick={() => navigate('/kamus')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kamus
          </button>

          <button
            onClick={() => nextLetter && navigate(`/kamus/${nextLetter}`)}
            disabled={!nextLetter}
            className={`px-4 py-2 rounded ${
              nextLetter
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            Berikutnya →
          </button>
        </div>
      </div>
    </MainLayout>
  );
}