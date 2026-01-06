// src/admin/EditArtikel.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';

export default function EditArtikel() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [currentCover, setCurrentCover] = useState('');
  const [newCover, setNewCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/articles/${slug}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Artikel tidak ditemukan');
        const data = await response.json();
        setFormData({
          title: data.title,
          content: data.content,
        });
        setCurrentCover(data.cover_image);
        setLoading(false);
      } catch (err) {
        alert(err.message);
        navigate('/admin/artikel');
      }
    };
    fetchArticle();
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      if (newCover) {
        formDataToSend.append('cover', newCover);
      }

      const response = await fetch(`http://localhost:5000/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menyimpan perubahan');
      }
      
      alert('Artikel berhasil diperbarui!');
      navigate('/admin/artikel');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-[1000px]">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Artikel</h1>
          <p className="text-gray-600 mb-6">Edit artikel yang sudah ada</p>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-6">
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
                  src={`http://localhost:5000${currentCover}`}
                  alt={`Cover artikel ${formData.title}`}
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => e.target.src = '/placeholder.png'}
                />
              </div>
            </div>

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
                disabled={submitting}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
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