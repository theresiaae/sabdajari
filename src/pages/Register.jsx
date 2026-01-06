// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sabdajari from '../assets/sabdajari.png'; // pastikan huruf kecil!

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔥 Kirim ke backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registrasi gagal');

      // 🔥 SETELAH DAFTAR → LANGSUNG KE HALAMAN LOGIN!
      navigate('/login', { 
        state: { 
          message: 'Registrasi berhasil! Silakan login dengan akun Anda.' 
        } 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Side - Logo (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="w-[500px]">
          <img src={sabdajari} alt="Sabda Jari Logo" className="w-full object-contain" />
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-[500px]">
          {/* Logo for Mobile */}
          <div className="text-center mb-12 lg:hidden">
            <img src={sabdajari} alt="Sabda Jari Logo" className="mx-auto w-64 mb-6" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Buat Akun Baru
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="selena"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Email
              </label>
              <input
                type="email"
                placeholder="nanda@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-base"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors mt-8 disabled:opacity-50"
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>

            <p className="text-center text-base text-gray-600 mt-8">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Masuk
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}