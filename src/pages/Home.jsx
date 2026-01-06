// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import ilustrasiHome from '../assets/ilustrasihome.jpg';

export default function Home() {
  const [todayLetter, setTodayLetter] = useState(null);

  // Fetch huruf hari ini dari backend
  useEffect(() => {
    const fetchTodayLetter = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/letters');
        if (!response.ok) throw new Error('Gagal mengambil data');
        const letters = await response.json();
        
        // Hitung huruf hari ini: 1 Jan = A, 2 Jan = B, ..., 26 Jan = Z, 27 Jan = A, dst
        const today = new Date();
        const letterIndex = (today.getDate() - 1) % 26;
        setTodayLetter(letters[letterIndex]);
      } catch (error) {
        // Fallback ke huruf 'N' seperti desain awalmu
        setTodayLetter({
          letter: 'N',
          image_path: '',
          description: 'Rapatkan tangan dengan ibu jari di bawah jari telunjuk, tengah, dan manis.'
        });
      }
    };
    fetchTodayLetter();
  }, []);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <div className="flex gap-3 mb-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                ⭐ 26 Huruf Lengkap
              </span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                💡 Mudah DiPelajari
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Belajar <br />
              <span className="text-blue-600">BISINDO</span> <br />
              dengan Mudah
            </h1>
            <p className="mt-2 text-gray-600 max-w-md">
              Kuasai 26 huruf alfabet dalam Bahasa Isyarat Indonesia melalui pembelajaran interaktif yang menyenangkan.
            </p>
          </div>

          {/* Illustration */}
          <div className="hidden md:block">
            <img
              src={ilustrasiHome}
              className="rounded-lg shadow-md max-w-[230px] w-full object-contain"
            />
          </div>
        </header>

        {/* Wave Separator */}
        <div className="h-12 bg-gradient-to-r from-blue-100 to-blue-200 relative">
          <svg
            className="absolute bottom-0 w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#7e3cef3c"
              fillOpacity="1"
              d="M0,160L48,154.7C96,149,192,139,288,144C384,149,480,171,576,165.3C672,160,768,128,864,117.3C960,107,1056,117,1152,133.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Huruf Hari Ini */}
          <section className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Huruf Hari Ini</h2>
            <div className="bg-blue-50 p-6 rounded-xl max-w-md mx-auto">
              <div className="text-6xl font-bold text-blue-700 mb-2">
                {todayLetter ? todayLetter.letter : 'N'}
              </div>
              <img
                src={
                  todayLetter && todayLetter.image_path
                    ? `http://localhost:5000${todayLetter.image_path}`
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='20' text-anchor='middle' fill='%2394a3b8'%3EN Isyarat%3C/text%3E%3C/svg%3E"
                }
                alt={`Cara membuat huruf ${todayLetter ? todayLetter.letter : 'N'}`}
                className="mx-auto mb-4 rounded w-24 h-24 object-contain"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='20' text-anchor='middle' fill='%2394a3b8'%3EN Isyarat%3C/text%3E%3C/svg%3E";
                }}
              />
              <p className="text-sm text-gray-600">
                {todayLetter 
                  ? `Cara membuat: ${todayLetter.description.substring(0, 80)}${todayLetter.description.length > 80 ? '...' : ''}`
                  : 'Rapatkan tangan dengan ibu jari di bawah jari telunjuk, tengah, dan manis.'
                }
              </p>
            </div>
          </section>

          {/* Motivasi & Tips Belajar */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Motivasi & Tips Belajar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Motivasi */}
              <div className="bg-gray-100 p-5 rounded-lg text-center">
                <div className="text-4xl mb-2">💙</div>
                <p className="text-sm">
                  "Setiap huruf yang dipelajari adalah langkah menuju komunikasi yang lebih baik."
                </p>
              </div>

              {/* Tips Pembelajaran */}
              <div className="bg-blue-100 p-5 rounded-lg text-center">
                <div className="text-4xl mb-2">💡</div>
                <p className="text-sm">
                  Latih gerakan tangan Anda secara perlahan dan berulang untuk hasil yang optimal.
                </p>
              </div>

              {/* Tentang SIBI */}
              <div className="bg-blue-50 p-5 rounded-lg text-center">
                <div className="text-4xl mb-2">📖</div>
                <p className="text-sm">
                  Sistem Bahasa Isyarat Indonesia (SIBI) adalah bahasa resmi komunitas Tuli di Indonesia.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Mulai Belajar */}
          <section className="bg-blue-600 text-white p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-2">Siap Memulai Perjalanan Belajar Anda?</h2>
            <p className="mb-4">
              Jelajahi kamus lengkap huruf A–Z dan mulai belajar bahasa isyarat Indonesia sekarang juga
            </p>
            <Link
              to="/kamus"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition"
            >
              📚 Mulai Belajar →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}