// src/pages/Kuis.jsx
import { useState, useEffect } from 'react'; // ← tambahkan useEffect
import { useNavigate } from 'react-router-dom';
import LoginPromptModal from '../components/LoginPromptModal';
import Sidebar from '../components/sidebar';
import QuizResult from '../components/QuizResult';
import QuizSession from '../components/QuizSession';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Kuis() {
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isInQuiz, setIsInQuiz] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const sessions = [
    { id: 0, title: "Huruf A-E", letters: ["A","B","C","D","E"] },
    { id: 1, title: "Huruf F-J", letters: ["F","G","H","I","J"] },
    { id: 2, title: "Huruf K-O", letters: ["K","L","M","N","O"] },
    { id: 3, title: "Huruf P-T", letters: ["P","Q","R","S","T"] },
    { id: 4, title: "Huruf U-Z", letters: ["U","V","W","X","Y","Z"] }
  ];

  const [isLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const handleStartQuiz = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      startQuiz();
    }
  };

  const startQuiz = () => {
    setIsInQuiz(true);
    setCurrentSession(0);
    setAnswers({});
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setQuizFinished(false);
  };

  const handleSessionComplete = (sessionId, sessionScore, correctLetters) => {
    setAnswers(prev => ({ ...prev, [sessionId]: correctLetters }));
    setScore(prev => prev + sessionScore);
    setCorrectCount(prev => prev + correctLetters.length);
    setWrongCount(prev => prev + (sessions[sessionId].letters.length - correctLetters.length));

    if (sessionId < sessions.length - 1) {
      setCurrentSession(sessionId + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setIsInQuiz(false);
    setQuizFinished(false);
    setCurrentSession(0);
    setAnswers({});
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  };

  // 🔥 SIMPAN HASIL KE DATABASE
  const saveQuizResult = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/quiz/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          score: score,
          correct_count: correctCount,
          wrong_count: wrongCount
        })
      });

      if (response.ok) {
        console.log('✅ Hasil kuis berhasil disimpan ke database');
      } else {
        console.error('❌ Gagal simpan hasil kuis:', await response.json());
      }
    } catch (err) {
      console.error('❌ Error koneksi ke backend:', err);
    }
  };

  // Panggil saat quiz selesai
  useEffect(() => {
    if (quizFinished) {
      saveQuizResult();
    }
  }, [quizFinished]);

  if (quizFinished) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 flex justify-center">
          <div className="w-[1000px]">
            <QuizResult
              score={score}
              correctCount={correctCount}
              wrongCount={wrongCount}
              onClose={handleRestartQuiz}
            />
          </div>
        </main>
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
      </div>
    );
  }

  if (isInQuiz) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <DndProvider backend={HTML5Backend}>
            <QuizSession
              session={sessions[currentSession]}
              sessionId={currentSession}
              onSessionComplete={handleSessionComplete}
              sessions={sessions}
            />
          </DndProvider>
        </main>
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Kuis Bahasa Isyarat Indonesia
          </h1>
          <p className="text-gray-600 mb-6">
            Uji kemampuan Anda dalam bahasa isyarat Indonesia.
          </p>
          <div className="bg-gray-100 p-6 rounded-xl mb-8 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📋 Cara Bermain:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Drag huruf ke gambar gesture yang sesuai</li>
              <li>Klik "Cek Jawaban" setelah semua huruf ditempatkan</li>
              <li>Lanjut ke sesi berikutnya setelah selesai</li>
              <li>Selesaikan semua 5 sesi untuk melihat skor akhir</li>
            </ol>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              ▶️ Mulai Kuis
            </button>
          </div>
        </div>
      </main>

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </div>
  );
}