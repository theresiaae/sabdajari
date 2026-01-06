// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Halaman Publik
import Home from './pages/Home';
import Kamus from './pages/Kamus';
import KamusDetail from './pages/KamusDetail';
import Scan from './pages/Scan';
import Artikel from './pages/Artikel';
import ArtikelDetail from './pages/ArtikelDetail';
import Kuis from './pages/Kuis';
import Login from './pages/Login';
import Register from './pages/Register';

// Halaman Admin
import AdminDashboard from './admin/Dashboard';
import AdminKamus from './admin/Kamus';
import AdminArtikel from './admin/Artikel';
import EditKamus from './admin/EditKamus';
import EditArtikel from './admin/EditArtikel';
import TambahArtikel from './admin/TambahArtikel';

// Admin Route Guard
import { AdminRoute } from './admin/utils/AdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 HALAMAN PUBLIK (BISA DIKASES SEMUA ORANG) */}
        <Route path="/" element={<Home />} />
        <Route path="/kamus" element={<Kamus />} />
        <Route path="/kamus/:letter" element={<KamusDetail />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/artikel/:slug" element={<ArtikelDetail />} />
        <Route path="/kuis" element={<Kuis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 HALAMAN ADMIN (HANYA UNTUK ADMIN) */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/kamus" 
          element={
            <AdminRoute>
              <AdminKamus />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/kamus/:letter" 
          element={
            <AdminRoute>
              <EditKamus />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/artikel" 
          element={
            <AdminRoute>
              <AdminArtikel />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/artikel/:slug" 
          element={
            <AdminRoute>
              <EditArtikel />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/artikel/tambah" 
          element={
            <AdminRoute>
              <TambahArtikel />
            </AdminRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}