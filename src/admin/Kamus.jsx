// src/admin/Kamus.jsx
import { Link } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

// Dummy data — nanti ganti dengan fetch dari API
const letters = [
  { letter: 'A', image: '/A.jpg', description: 'Gerakan untuk huruf A dalam bahasa isyarat Indonesia', tips: 'Pastikan posisi tangan dan jari sesuai standar BISINDO untuk huruf A' },
  { letter: 'B', image: '/B.jpg', description: 'Gerakan untuk huruf B dalam bahasa isyarat Indonesia', tips: 'Pastikan posisi tangan dan jari sesuai standar BISINDO untuk huruf B' },
  { letter: 'C', image: '/C.jpg', description: 'Gerakan untuk huruf C dalam bahasa isyarat Indonesia', tips: 'Pastikan posisi tangan dan jari sesuai standar BISINDO untuk huruf C' },
  { letter: 'D', image: '/D.jpg', description: 'Gerakan untuk huruf D dalam bahasa isyarat Indonesia', tips: 'Pastikan posisi tangan dan jari sesuai standar BISINDO untuk huruf D' },
  { letter: 'E', image: '/E.jpg', description: 'Gerakan untuk huruf E dalam bahasa isyarat Indonesia', tips: 'Pastikan posisi tangan dan jari sesuai standar BISINDO untuk huruf E' },
];

export default function AdminKamus() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
        {/* CONTAINER FIXED WIDTH 1000px */}
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Kamus</h1>
          <p className="text-gray-600 mb-6">Edit deskripsi dan gambar untuk setiap huruf A–Z</p>

          {/* Table Header */}
          <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-700">
              <div>Huruf</div>
              <div>Gambar</div>
              <div>Deskripsi Gerakan</div>
              <div>Tips & Trik</div>
              <div>Aksi</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="bg-white rounded-b-xl shadow-md">
            {letters.map((letter, index) => (
              <div
                key={letter.letter}
                className={`grid grid-cols-6 gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="font-bold text-blue-600">{letter.letter}</div>
                <div>
                  <img
                    src={letter.image}
                    alt={`Gambar huruf ${letter.letter}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>
                <div className="text-sm text-gray-700">{letter.description}</div>
                <div className="text-sm text-gray-700">{letter.tips}</div>
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