// src/admin/EditKamus.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';

// Dummy data — NAMA FIELD SUDAH SESUAI DB
const letters = [
  { 
    letter: 'A', 
    image_path: '/A.jpg', 
    description: 'Gerakan untuk huruf A dalam bahasa isyarat Indonesia', 
    tips: 'Pastikan posisi tangan dan jari sesuai standar BISINDO untuk huruf A' 
  },
  { 
    letter: 'B', 
    image_path: '/B.jpg', 
    description: 'Gerakan untuk huruf B dalam bahasa isyarat Indonesia', 
    tips: 'Pastikan posisi tangan dan jari sesuai standar BISINDO untuk huruf B' 
  },
];

export default function EditKamus() {
  const { letter } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    letter: letter,
    image_path: '',
    description: '',
    tips: '',
  });

  const letterData = letters.find(l => l.letter === letter);

  useEffect(() => {
    if (letterData) {
      setFormData({
        letter: letterData.letter,
        image_path: letterData.image_path,
        description: letterData.description,
        tips: letterData.tips,
      });
    }
  }, [letterData]);

  if (!letterData) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarAdmin />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Huruf Tidak Ditemukan</h1>
            <p className="text-gray-600">
              Silakan kembali ke{' '}
              <Link to="/admin/kamus" className="text-blue-600">
                halaman kelola kamus
              </Link>
              .
            </p>
          </div>
        </main>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    console.log('File dipilih:', e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Perubahan untuk huruf ${letter} disimpan!`);
    // 🔜 Saat integrasi: kirim ke /api/letters/:letter dengan method PUT
  };

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto p-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Huruf {letter}</h1>
          <p className="text-gray-600 mb-6">Edit deskripsi dan gambar untuk huruf {letter}</p>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-6">
            {/* Huruf */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Huruf</label>
              <input
                type="text"
                name="letter"
                value={formData.letter}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>

            {/* Gambar */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Bahasa Isyarat
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2">
                <img
                  src={letterData.image_path}
                  alt={`Gambar huruf ${letter}`}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Gerakan
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Tips */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tips & Trik
              </label>
              <textarea
                name="tips"
                value={formData.tips}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Simpan
              </button>
              <Link
                to="/admin/kamus"
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </Link>
            </div>
          </form>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-700">
                <div>Huruf</div>
                <div>Gambar</div>
                <div>Deskripsi</div>
                <div>Tips</div>
                <div>Aksi</div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50">
                <div className="font-bold text-blue-600">{letter}</div>
                <div>
                  <img
                    src={letterData.image_path}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>
                <div className="text-sm text-gray-700">{letterData.description}</div>
                <div className="text-sm text-gray-700">{letterData.tips}</div>
                <div>
                  <Link
                    to={`/admin/kamus/${letter}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    🖊️ Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}