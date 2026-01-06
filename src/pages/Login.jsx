// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import sabdajari from '../assets/sabdajari.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 Ambil pesan dari register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tampilkan pesan dari register
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ''
  );

  // Jika sudah login → redirect ke Home
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  // src/pages/Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login gagal');

    // 🔥 Simpan token & user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // 🔥 Redirect berdasarkan role
    if (data.user.role === 'admin') {
      navigate('/admin'); 
    } else {
      navigate('/');
    }
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-[500px]">
          {/* Logo for Mobile */}
          <div className="text-center mb-12 lg:hidden">
            <img src={sabdajari} alt="Sabda Jari Logo" className="mx-auto w-64 mb-6" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Selamat Datang!
          </h1>

          {/* 🔥 Pesan sukses dari register */}
          {successMessage && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <a href="#" className="text-sm text-blue-600 mt-3 inline-block hover:underline">
                Lupa Kata Sandi?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors mt-8 disabled:opacity-50"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>

            <p className="text-center text-base text-gray-600 mt-8">
              Belum punya akun?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}