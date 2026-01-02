import { useState, useEffect } from 'react';
import Camera from './Camera';

export default function QuizQuestion({ letter, nextLetter, questionIndex, score, onCorrect, onWrong }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    startDetection();
  };

  const startDetection = () => {
    setIsDetecting(true);
    setTimeout(detectGesture, 3000);
  };

  const detectGesture = () => {
    const correct = Math.random() > 0.5;
    setIsCorrect(correct);
    setShowFeedback(true);
    setIsDetecting(false);

    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }
  };

  useEffect(() => {
    if (showFeedback) {
      const feedbackTimer = setTimeout(() => {
        setShowFeedback(false);
        
        if (quizStarted) {
          setTimeout(() => {
            nextLetter();
          }, 300);
        }
      }, 2000);

      return () => clearTimeout(feedbackTimer);
    }
  }, [showFeedback, quizStarted]);

  useEffect(() => {
    if (quizStarted && !showFeedback && !isDetecting) {
      if (questionIndex > 1) {
        startDetection();
      }
    }
  }, [questionIndex, quizStarted, showFeedback, isDetecting]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-6">
      {/* CONTAINER FIXED WIDTH 1000px - SAMA SEPERTI KAMUS */}
      <div className="w-[1000px] px-6">
        
        {/* Popup Feedback */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                {isCorrect ? <div className="text-5xl">✓</div> : <div className="text-5xl text-red-600">✕</div>}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {isCorrect ? 'Mantap! 🎉' : 'Belum Tepat 😔'}
              </h2>
              <p className="text-gray-600">
                {isCorrect 
                  ? `Anda Berhasil Menunjukan Huruf ${letter}!` 
                  : `Gerakan untuk Huruf ${letter}, belum tepat!`
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Otomatis lanjut ke Huruf berikutnya...
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="w-full flex justify-between items-center mb-3 bg-gray-200 rounded-lg px-4 py-2">
          <div className="text-sm text-gray-700 font-medium">
            Soal {questionIndex} dari 26
          </div>
          <div className="text-sm text-gray-700 font-medium">
            Skor: {score}
          </div>
        </div>

        {/* Instruction Box */}
        <div className="w-full bg-gray-200 rounded-lg p-3 mb-3 text-center">
          <h2 className="text-sm font-bold mb-1">Tunjukan Huruf</h2>
          <div className="text-7xl font-black text-gray-800">{letter}</div>
        </div>

        {/* Camera Area */}
        <div className="w-full bg-gray-300 rounded-lg p-4 mb-3 flex flex-col items-center">
          <div className="w-full max-w-[400px] ">
            <Camera showDetectionBox={isDetecting} />
          </div>

          <div className="text-center">
            {isDetecting ? (
              <div>
                <div className="animate-pulse text-green-600 font-semibold mb-1 text-sm">
                  🔍 Mendeteksi gerakan...
                </div>
                <p className="text-sm text-gray-600">
                  Tunjukkan huruf {letter} di dalam kotak hijau
                </p>
              </div>
            ) : !quizStarted ? (
              <button
                onClick={handleStartQuiz}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                ▶️ Mulai Kuis
              </button>
            ) : (
              <div className="text-gray-500 text-sm italic">
                Bersiap untuk soal berikutnya...
              </div>
            )}
          </div>
        </div>

        {/* Instruction Text */}
        {!quizStarted && (
          <div className="w-full border-3 border-blue-500 rounded-lg p-3 text-center">
            <p className="text-gray-700 text-xs">
              Klik "Mulai Kuis" untuk memulai deteksi gerakan tangan Anda
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}