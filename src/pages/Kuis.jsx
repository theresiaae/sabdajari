// src/pages/Kuis.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPromptModal from '../components/LoginPromptModal';
import Sidebar from '../components/sidebar';
import QuizQuestion from '../components/QuizQuestion';
import QuizResult from '../components/QuizResult';

export default function Kuis() {
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isInQuiz, setIsInQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const [isLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
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
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setQuizFinished(false);
  };

  const handleCorrect = () => {
    setScore(prev => prev + 10);
    setCorrectCount(prev => prev + 1);
    nextQuestionAfterDelay();
  };

  const handleWrong = () => {
    setWrongCount(prev => prev + 1);
    nextQuestionAfterDelay();
  };

  const nextQuestionAfterDelay = () => {
    setTimeout(() => {
      if (currentQuestionIndex < 25) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const currentLetter = letters[currentQuestionIndex];
  const nextLetter =
    currentQuestionIndex < 25 ? letters[currentQuestionIndex + 1] : null;

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
              onClose={() => {
                setIsInQuiz(false);
                setQuizFinished(false);
                setCurrentQuestionIndex(0);
                setScore(0);
                setCorrectCount(0);
                setWrongCount(0);
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  if (isInQuiz) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <QuizQuestion
            letter={currentLetter}
            nextLetter={nextLetter}
            questionIndex={currentQuestionIndex + 1}
            score={score}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        {/* CONTAINER FIXED WIDTH 1000px */}
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Kuis Bahasa Isyarat Indonesia
          </h1>
          <p className="text-gray-600 mb-6">
            Uji kemampuan Anda dalam bahasa isyarat Indonesia dengan teknologi deteksi gerakan real-time.
          </p>
          <div className="bg-gray-100 p-6 rounded-xl mb-8 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📋 Cara Bermain:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Izinkan akses kamera untuk deteksi gerakan tangan</li>
              <li>Tunjukkan huruf sesuai instruksi yang muncul</li>
              <li>Dapatkan feedback langsung dan lanjut ke huruf berikutnya</li>
              <li>Selesaikan semua 26 huruf untuk mendapat skor akhir</li>
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
          <div className="mt-4 text-sm text-gray-500 text-center">
            💡 Tips: Gunakan kotak pencarian untuk menemukan huruf dengan cepat
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