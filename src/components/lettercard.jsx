// src/components/lettercard.jsx
import { Link } from 'react-router-dom';

export default function LetterCard({ letterData }) {
  return (
    <Link to={`/kamus/${letterData.letter}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
        <div className="text-3xl font-bold text-gray-800 mb-2">
          {letterData.letter}
        </div>
        <img
          src={`http://localhost:5000${letterData.image_path}`}
          alt={`Huruf ${letterData.letter}`}
          className="w-16 h-16 mx-auto object-contain"
          onError={(e) => {
            e.target.src = '/placeholder-hand.png'; // gambar placeholder
          }}
        />
      </div>
    </Link>
  );
}