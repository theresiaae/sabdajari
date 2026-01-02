// src/pages/Kamus.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LetterCard from '../components/lettercard';
import { letters } from '../data/letters';

export default function Kamus() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLetters = letters.filter(letter =>
    letter.letter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white">
        <div className="w-full px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kamus Bahasa Isyarat Indonesia</h1>
          <p className="text-gray-600 mb-6">
            Pelajari alfabet bahasa isyarat Indonesia dengan mudah dan interaktif. Klik huruf mana saja untuk melihat gerakan tangan yang tepat.
          </p>

          {/* Search Bar — Di tengah & lebih pendek */}
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
              <LetterCard key={letter.letter} letterData={letter} />
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