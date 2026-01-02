// src/pages/ArtikelDetail.jsx
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';

// Data dummy artikel (sama seperti di Artikel.jsx)
const articles = [
  {
    id: 1,
    title: "Tiga Hal yang Harus Diketahui Mengenai Bahasa Isyarat",
    content: `
      <p>Bahasa Isyarat merupakan bentuk komunikasi yang digunakan oleh komunitas Tuli atau orang-orang dengan gangguan pendengaran. Cara komunikasi dalam bahasa isyarat tidak hanya sekadar dengan menggerakkan tangan, tetapi juga memerlukan ekspresi wajah tertentu agar maknanya lebih tersampaikan.</p>
      <p>Penasaran dengan fakta-fakta menarik tentang bahasa isyarat lainnya? Yuk, simak artikel berikut ini.</p>
      <h3>Setiap Daerah Memiliki Bahasa Isyarat yang Berbeda</h3>
      <p>Di Indonesia, terdapat berbagai jenis Bahasa Isyarat yang berbeda di setiap daerah. Variasi ini muncul karena perbedaan yang berkembang di kalangan komunitas Tuli, yang menyesuaikan ciri khas dan budaya pada masing-masing wilayah. Jadi tidak perlu terkejut jika Sahabat LBI menemukan isyarat yang berbeda saat mempelajarinya di wilayah Jakarta dan Yogyakarta.</p>
      <h3>Ada Dua Jenis Bahasa Isyarat</h3>
      <p>Pada umumnya, terdapat dua sistem isyarat bahasa yang digunakan oleh komunitas Tuli di Indonesia, yaitu Sistem Bahasa Isyarat Indonesia (SIBI) dan Bahasa Isyarat Indonesia (BISINDO). Meskipun keduanya adalah jenis sistem isyarat bahasa, terdapat perbedaan yang cukup signifikan antara keduanya. SIBI adalah sistem isyarat bahasa yang diakui oleh pemerintah dan digunakan dalam pengajaran di Sekolah Luar Biasa (SLB). SIBI dirancang untuk mempresentasikan tata bahasa lisan Indonesia ke dalam bentuk isyarat buatan. Struktur SIBI mengikuti pola bahasa lisan Indonesia, dengan adanya awalan dan akhiran. Sementara itu, BISINDO adalah sistem isyarat bahasa yang berkembang secara alami di tengah komunitas Tuli yang biasa digunakan dalam kehidupan sehari-hari. Nah, BISINDO inilah yang memiliki variasi penggunaan isyarat di setiap daerah, dengan tata bahasa yang berbeda dari bahasa lisan yang biasa digunakan oleh teman dengar.</p>
    `,
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+1",
    slug: "tiga-hal-yang-harus-diketahui-mengenai-bahasa-isyarat"
  },
  {
    id: 2,
    title: "Hari Bahasa Isyarat Internasional: Komunikasi Tanpa Suara",
    content: `
      <p>Tepat pada tanggal 23 September, seluruh dunia memperingati Hari Bahasa Isyarat Internasional di setiap tahunnya. Peringatan ini telah diresmikan oleh PBB didasarkan pada sejarah berdirinya World Federation of The Deaf (WFD) pada tahun 1951. Hari Bahasa Isyarat Internasional menyoroti pentingnya penggunaan bahasa isyarat dan memperjuangkan hak-hak individu, khususnya untuk teman tuli atau tunarungu.</p>
      <p>Peringatan ini juga bertujuan untuk meningkatkan kesadaran masyarakat akan pentingnya bahasa isyarat sebagai bagian dari warisan budaya manusia dan sebagai alat komunikasi yang sah.</p>
    `,
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+2",
    slug: "hari-bahasa-isyarat-internasional-komunikasi-tanpa-suara"
  },
  {
    id: 3,
    title: "Setiap Daerah Memiliki Bahasa Isyarat yang Berbeda",
    content: `
      <p>Di Indonesia, terdapat berbagai jenis Bahasa Isyarat yang berbeda di setiap daerah. Variasi ini muncul karena perbedaan yang berkembang di kalangan komunitas Tuli, yang menyesuaikan ciri khas dan budaya pada masing-masing wilayah. Jadi tidak perlu terkejut jika Sahabat LBI menemukan isyarat yang berbeda saat mempelajarinya di wilayah Jakarta dan Yogyakarta.</p>
      <p>Perbedaan ini justru menunjukkan kekayaan budaya lokal yang ada di Indonesia, dan menjadi tantangan sekaligus peluang untuk membangun standar komunikasi yang inklusif.</p>
    `,
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+3",
    slug: "setiap-daerah-memiliki-bahasa-isyarat-yang-berbeda"
  },
  {
    id: 4,
    title: "Ada Dua Jenis Bahasa Isyarat",
    content: `
      <p>Pada umumnya, terdapat dua sistem isyarat bahasa yang digunakan oleh komunitas Tuli di Indonesia, yaitu Sistem Bahasa Isyarat Indonesia (SIBI) dan Bahasa Isyarat Indonesia (BISINDO). Meskipun keduanya adalah jenis sistem isyarat bahasa, terdapat perbedaan yang cukup signifikan antara keduanya.</p>
      <p>SIBI adalah sistem isyarat bahasa yang diakui oleh pemerintah dan digunakan dalam pengajaran di Sekolah Luar Biasa (SLB). SIBI dirancang untuk mempresentasikan tata bahasa lisan Indonesia ke dalam bentuk isyarat buatan. Struktur SIBI mengikuti pola bahasa lisan Indonesia, dengan adanya awalan dan akhiran.</p>
      <p>Sementara itu, BISINDO adalah sistem isyarat bahasa yang berkembang secara alami di tengah komunitas Tuli yang biasa digunakan dalam kehidupan sehari-hari. Nah, BISINDO inilah yang memiliki variasi penggunaan isyarat di setiap daerah, dengan tata bahasa yang berbeda dari bahasa lisan yang biasa digunakan oleh teman dengar.</p>
    `,
    cover_image: "https://via.placeholder.com/600x300?text=Gambar+Artikel+4",
    slug: "ada-dua-jenis-bahasa-isyarat"
  }
];

export default function ArtikelDetail() {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 flex justify-center">
          <div className="w-[1000px] text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-600">Silakan kembali ke <Link to="/artikel" className="text-blue-600">halaman artikel</Link>.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        {/* CONTAINER FIXED WIDTH 1000px */}
        <div className="w-[1000px]">
          <Link to="/artikel" className="inline-flex items-center gap-1 text-blue-600 mb-6 hover:underline">
            ← Kembali ke Artikel
          </Link>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{article.title}</h1>
              <div
                className="prose prose-lg text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/artikel"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Kembali ke Artikel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}