// src/pages/Register.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sabdajari from '../assets/Sabdajari.png';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    navigate('/');
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
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors mt-8"
            >
              Daftar
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