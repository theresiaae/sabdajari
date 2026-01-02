// src/components/LetterCard.jsx
import { Link } from 'react-router-dom';

export default function lettercard({ letterData }) {
  return (
    <Link
      to={`/kamus/${letterData.letter}`}
      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg p-4 text-center transition duration-200 flex flex-col items-center"
    >
      <div className="text-4xl font-bold mb-2">{letterData.letter}</div>
      <div className="text-xs text-gray-600">Huruf {letterData.letter}</div>
    </Link>
  );
}