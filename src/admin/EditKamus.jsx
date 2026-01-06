// src/admin/EditKamus.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';

export default function EditKamus() {
  const { letter } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    tips: '',
  });
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch data huruf
  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/letters/${letter}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Huruf tidak ditemukan');
        const data = await response.json();
        setFormData({
          description: data.description,
          tips: data.tips,
        });
        setCurrentImage(data.image_path);
        setLoading(false);
      } catch (err) {
        alert(err.message);
        navigate('/admin/kamus');
      }
    };
    fetchLetter();
  }, [letter, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tips', formData.tips);
      if (newImage) {
        formDataToSend.append('image', newImage);
      }

      const response = await fetch(`http://localhost:5000/api/letters/${letter}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Gagal menyimpan perubahan');
      
      alert('Perubahan berhasil disimpan!');
      navigate('/admin/kamus');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-[1000px] animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Huruf {letter}</h1>
          <p className="text-gray-600 mb-6">Edit deskripsi dan gambar untuk huruf {letter}</p>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Huruf</label>
              <input
                type="text"
                value={letter}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Bahasa Isyarat
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2">
                <img
                  src={`http://localhost:5000${currentImage}`}
                  alt={`Gambar huruf ${letter}`}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => e.target.src = '/placeholder.png'}
                />
              </div>
            </div>

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
                disabled={submitting}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
              <Link
                to="/admin/kamus"
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