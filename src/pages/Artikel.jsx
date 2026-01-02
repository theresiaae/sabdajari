// src/pages/Artikel.jsx
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';

// Data dummy artikel
const articles = [
  {
    id: 1,
    title: "Tiga Hal yang Harus Diketahui Mengenai Bahasa Isyarat",
    excerpt: "Bahasa Isyarat merupakan bentuk komunikasi yang digunakan oleh komunitas Tuli atau orang-orang dengan gangguan pendengaran. Cara komunikasi dalam bahasa isyarat tidak hanya sekadar dengan menggerakkan tangan, tetapi juga memerlukan ekspresi wajah tertentu agar maknanya lebih tersampaikan.",
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+1",
    slug: "tiga-hal-yang-harus-diketahui-mengenai-bahasa-isyarat"
  },
  {
    id: 2,
    title: "Hari Bahasa Isyarat Internasional: Komunikasi Tanpa Suara",
    excerpt: "Tepat pada tanggal 23 September, seluruh dunia memperingati Hari Bahasa Isyarat Internasional di setiap tahunnya. Peringatan ini telah diresmikan oleh PBB didasarkan pada sejarah berdirinya World Federation of The Deaf (WFD) pada tahun 1951. Hari Bahasa Isyarat Internasional menyoroti pentingnya penggunaan bahasa isyarat dan memperjuangkan hak-hak individu, khususnya untuk teman tuli atau tunarungu.",
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+2",
    slug: "hari-bahasa-isyarat-internasional-komunikasi-tanpa-suara"
  },
  {
    id: 3,
    title: "Setiap Daerah Memiliki Bahasa Isyarat yang Berbeda",
    excerpt: "Di Indonesia, terdapat berbagai jenis Bahasa Isyarat yang berbeda di setiap daerah. Variasi ini muncul karena perbedaan yang berkembang di kalangan komunitas Tuli, yang menyesuaikan ciri khas dan budaya pada masing-masing wilayah. Jadi tidak perlu terkejut jika Sahabat LBI menemukan isyarat yang berbeda saat mempelajarinya di wilayah Jakarta dan Yogyakarta.",
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+3",
    slug: "setiap-daerah-memiliki-bahasa-isyarat-yang-berbeda"
  },
  {
    id: 4,
    title: "Ada Dua Jenis Bahasa Isyarat",
    excerpt: "Pada umumnya, terdapat dua sistem isyarat bahasa yang digunakan oleh komunitas Tuli di Indonesia, yaitu Sistem Bahasa Isyarat Indonesia (SIBI) dan Bahasa Isyarat Indonesia (BISINDO). Meskipun keduanya adalah jenis sistem isyarat bahasa, terdapat perbedaan yang cukup signifikan antara keduanya. SIBI adalah sistem isyarat bahasa yang diakui oleh pemerintah dan digunakan dalam pengajaran di Sekolah Luar Biasa (SLB).",
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+4",
    slug: "ada-dua-jenis-bahasa-isyarat"
  }
];

export default function Artikel() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        {/* CONTAINER FIXED WIDTH 1000px */}
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Artikel</h1>
          <p className="text-gray-600 mb-6">Artikel tersedia untuk kamu baca.</p>

          {/* Articles Grid */}
          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h2>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Link
                    to={`/artikel/${article.slug}`}
                    className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}