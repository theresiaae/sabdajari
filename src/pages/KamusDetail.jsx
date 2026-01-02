// src/pages/KamusDetail.jsx
import { useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { letters } from '../data/letters';

export default function KamusDetail() {
  const { letter } = useParams();
  const letterData = letters.find(l => l.letter === letter);

  if (!letterData) {
    return (
      <MainLayout>
        <div className="w-full px-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Huruf Tidak Ditemukan</h1>
          <p className="text-gray-600">
            Silakan kembali ke <a href="/kamus" className="text-blue-600">halaman kamus</a>.
          </p>
        </div>
      </MainLayout>
    );
  }

  const currentIndex = letters.findIndex(l => l.letter === letter);
  const prevLetter = currentIndex > 0 ? letters[currentIndex - 1].letter : null;
  const nextLetter = currentIndex < letters.length - 1 ? letters[currentIndex + 1].letter : null;

  return (
    <MainLayout>
      {/* Container FIXED WIDTH - SEMUA HURUF SAMA LEBAR */}
      <div className="w-[1000px] mx-auto px-6">
        
        {/* Back Button */}
        <div className="mb-8">
          <a href="/kamus" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            ← Kembali ke Kamus
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">HURUF</h1>
          <h2 className="text-8xl font-black text-gray-800 mb-3">{letterData.letter}</h2>
          <p className="text-xl text-gray-600">Bahasa Isyarat Indonesia</p>
        </div>

        {/* Gerakan Tangan */}
        <div className="w-full bg-gray-100 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Gerakan Tangan</h3>
          <div className="flex justify-center">
            <img
              src={letterData.image_path}
              alt={`Gerakan tangan huruf ${letterData.letter}`}
              className="rounded-lg shadow-md w-64 h-64 object-contain"
            />
          </div>
        </div>

        {/* Deskripsi Gerakan */}
        <div className="w-full bg-indigo-50 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📄 Deskripsi Gerakan
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{letterData.description}</p>
        </div>

        {/* Tips & Trik */}
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

        {/* Navigation Buttons */}
        <div className="w-full flex justify-center gap-3 mt-8">
          <a
            href={prevLetter ? `/kamus/${prevLetter}` : "#"}
            className={`px-4 py-2 rounded ${
              prevLetter
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            ← Sebelumnya
          </a>

          <a
            href="/kamus"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kamus
          </a>

          <a
            href={nextLetter ? `/kamus/${nextLetter}` : "#"}
            className={`px-4 py-2 rounded ${
              nextLetter
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            Berikutnya →
          </a>
        </div>

      </div>
    </MainLayout>
  );
}