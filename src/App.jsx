// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Kamus from './pages/Kamus';
import KamusDetail from './pages/KamusDetail';
import Scan from './pages/Scan';
import Artikel from './pages/Artikel';
import ArtikelDetail from './pages/ArtikelDetail';
import Kuis from './pages/Kuis';
import Login from './pages/Login';
import Register from './pages/Register';

// Import halaman admin
import AdminDashboard from './admin/Dashboard';
import AdminKamus from './admin/Kamus';
import AdminArtikel from './admin/Artikel';
import EditKamus from './admin/EditKamus';
import EditArtikel from './admin/EditArtikel';
import TambahArtikel from './admin/TambahArtikel';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kamus" element={<Kamus />} />
        <Route path="/kamus/:letter" element={<KamusDetail />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/artikel/:slug" element={<ArtikelDetail />} />
        <Route path="/kuis" element={<Kuis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

                {/* Admin Pages — hanya bisa diakses jika login sebagai admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/kamus" element={<AdminKamus />} />
        <Route path="/admin/kamus/:letter" element={<EditKamus />} />
        <Route path="/admin/artikel" element={<AdminArtikel />} />
        <Route path="/admin/artikel/:slug" element={<EditArtikel />} />
        <Route path="/admin/artikel/tambah" element={<TambahArtikel />} />

      </Routes>
    </BrowserRouter>
  );
}