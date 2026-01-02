// src/admin/TambahArtikel.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';

export default function TambahArtikel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    cover_image: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    console.log('File dipilih:', e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    alert(`Artikel "${formData.title}" berhasil ditambahkan!`);
    
    navigate('/admin/artikel');
  };

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
        {/* CONTAINER FIXED WIDTH 1000px */}
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tambah Artikel Baru</h1>
          <p className="text-gray-600 mb-6">Isi form di bawah untuk menambahkan artikel baru</p>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-6">
            {/* Judul */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Artikel
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Gambar Cover */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Cover
              </label>
              <input
                type="file"
                name="cover"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Isi Artikel */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Isi Artikel
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="10"
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
                to="/admin/artikel"
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}