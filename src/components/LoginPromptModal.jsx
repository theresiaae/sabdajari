// src/components/LoginPromptModal.jsx
import { useNavigate } from 'react-router-dom';

export default function LoginPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Dulu untuk Mencoba Kuis</h2>
        <p className="text-gray-600 mb-6">
          Untuk menyimpan hasil dan melacak kemajuanmu, kamu perlu membuat akun terlebih dahulu.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              navigate('/login');
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Daftar / Login
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}