// src/components/QuizSession.jsx
import { useState, useEffect } from 'react';
import DraggableLetter from './DraggableLetter';
import DropZone from './DropZone';

export default function QuizSession({ session, sessionId, onSessionComplete, sessions }) {
  const [droppedLetters, setDroppedLetters] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [correctList, setCorrectList] = useState([]); // ← tambahkan ini
  const [showSessionResult, setShowSessionResult] = useState(false);

  const shuffledLetters = [...session.letters].sort(() => Math.random() - 0.5);

  useEffect(() => {
    setDroppedLetters({});
    setShowFeedback(false);
    setSessionScore(0);
    setCorrectLetters([]);
    setCorrectList([]);
    setShowSessionResult(false);
  }, [session]);

  const handleDrop = (letter, index) => {
    if (!droppedLetters[index]) {
      setDroppedLetters(prev => ({ ...prev, [index]: letter }));
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    const list = [];

    session.letters.forEach((correctLetter, index) => {
      const userLetter = droppedLetters[index];
      if (userLetter === correctLetter) {
        correct++;
        list.push(correctLetter);
      }
    });

    setSessionScore(correct * 10);
    setCorrectLetters(list);
    setCorrectList(list); // ← simpan ke state
    setShowFeedback(true);
    setShowSessionResult(true);
  };

  const nextSession = () => {
    onSessionComplete(sessionId, sessionScore, correctList); // ← pakai dari state
    setShowSessionResult(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6">
      {/* Progress Bar */}
      <div className="w-[1000px] px-6 mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Sesi {sessionId + 1} dari 5</span>
          <span>{Math.round(((sessionId + 1) / 5) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((sessionId + 1) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Session Title */}
      <div className="w-[1000px] px-6 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Sesi {sessionId + 1}: {session.title}</h2>
      </div>

      {/* Drop Zones */}
      <div className="w-[1000px] px-6 grid grid-cols-5 gap-4 mb-6">
        {session.letters.map((letter, index) => (
          <DropZone
            key={index}
            index={index}
            letter={letter}
            correctAnswer={letter}
            droppedLetter={droppedLetters[index]}
            onDrop={handleDrop}
            showFeedback={showFeedback}
          />
        ))}
      </div>

      {/* Draggable Letters */}
      <div className="w-[1000px] px-6 mb-6">
        <h3 className="text-sm font-semibold mb-2">Pilih Huruf:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {shuffledLetters.map((letter) => (
            <DraggableLetter
              key={letter}
              letter={letter}
            />
          ))}
        </div>
      </div>

      {/* Button Check */}
      {!showFeedback ? (
        <div className="w-[1000px] px-6">
          <button
            onClick={checkAnswers}
            disabled={Object.keys(droppedLetters).length !== session.letters.length}
            className={`w-full py-2 px-6 rounded-lg font-medium transition ${
              Object.keys(droppedLetters).length === session.letters.length
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Cek Jawaban →
          </button>
        </div>
      ) : (
        // Feedback After Check — HAPUS INI, GANTI DENGAN POPUP
        <div className="w-[1000px] px-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold mb-2">Sesi Selesai!</h2>
            <div className="text-4xl font-black text-blue-600 mb-2">
              {correctLetters.length}/{session.letters.length}
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Jawaban benar di sesi ini
            </p>
            <button
              onClick={nextSession}
              className="w-full py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Lanjut ke Sesi Berikutnya →
            </button>
          </div>
        </div>
      )}

      {/* Popup Hasil Sesi */}
      {showSessionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-bold mb-2">Sesi Selesai!</h2>
            <p className="text-gray-600 mb-4">Tetap semangat! Coba lagi!</p>
            <div className="text-3xl font-black text-blue-600 mb-2">
              {correctList.length}/{session.letters.length}
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Jawaban benar di sesi ini
            </p>
            {sessionId === sessions.length - 1 ? (
              <button
                onClick={nextSession}
                className="w-full py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Lihat Hasil Keseluruhan →
              </button>
            ) : (
              <button
                onClick={nextSession}
                className="w-full py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Lanjut ke Sesi Berikutnya →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}