import { Link } from 'react-router-dom';

export default function QuizResult({ score, correctCount, wrongCount, onClose }) {
  const handleRestartQuiz = () => {
    // Panggil onClose untuk memberi tahu parent (Kuis.jsx) untuk reset state
    if (onClose) {
      onClose(); // 👈 Ini yang akan reset state di Kuis.jsx
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold mb-2">Quiz Selesai!</h1>
          <p className="text-gray-600 mb-6">
            Anda telah menyelesaikan quiz bahasa isyarat Indonesia.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Total Skor</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">Benar</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-sm text-gray-600">Salah</div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              💡 Tips: Latih ulang huruf yang salah untuk hasil lebih baik!
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              to="/kamus"
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              📚 Lihat Kamus
            </Link>
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              🔄 Ulangi Kuis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}