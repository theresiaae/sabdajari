// src/admin/EditArtikel.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';

// Dummy data — NAMA FIELD SUDAH DIPERBAIKI
const articles = [
  { 
    id: 1, 
    title: 'Pengenalan Bahasa Isyarat Indonesia', 
    slug: 'pengenalan-bahasa-isyarat-indonesia', 
    cover_image: '/cover1.jpg', 
    content: 'Bahasa Isyarat Indonesia (BISINDO) adalah bahasa isyarat yang digunakan oleh komunitas Tuli di Indonesia. BISINDO memiliki struktur dan tata bahasa yang unik dan berbeda dari bahasa isyarat negara lain.' 
  },
  { 
    id: 2, 
    title: 'Sejarah Bahasa Isyarat di Indonesia', 
    slug: 'sejarah-bahasa-isyarat-di-indonesia', 
    cover_image: '/cover2.jpg', 
    content: 'Sejarah Bahasa Isyarat di Indonesia dimulai sejak zaman kolonial Belanda, ketika para guru asing memperkenalkan sistem isyarat pertama kali di sekolah-sekolah untuk anak-anak Tuli.' 
  },
];

export default function EditArtikel() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    cover_image: '',
    content: '',
  });

  const articleData = articles.find(a => a.slug === slug);

  useEffect(() => {
    if (articleData) {
      setFormData({
        title: articleData.title,
        cover_image: articleData.cover_image,
        content: articleData.content,
      });
    }
  }, [articleData]);

  if (!articleData) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarAdmin />
        <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
          <div className="w-[1000px] text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-600">
              Silakan kembali ke{' '}
              <Link to="/admin/artikel" className="text-blue-600">
                halaman kelola artikel
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
    alert(`Artikel "${formData.title}" disimpan!`);
  };

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
        {/* CONTAINER FIXED WIDTH 1000px */}
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Artikel</h1>
          <p className="text-gray-600 mb-6">Edit artikel yang sudah ada</p>

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
              <div className="mt-2">
                <img
                  src={articleData.cover_image}
                  alt={`Cover artikel ${articleData.title}`}
                  className="w-full h-40 object-cover rounded"
                />
              </div>
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

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-700">
                <div>Judul</div>
                <div>Gambar</div>
                <div>Aksi</div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50">
                <div className="text-sm text-gray-700">{articleData.title}</div>
                <div>
                  <img
                    src={articleData.cover_image}
                    alt=""
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
                <div>
                  <Link
                    to={`/admin/artikel/${articleData.slug}`}
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