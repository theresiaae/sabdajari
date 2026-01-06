// src/components/DropZone.jsx
import { useDrop } from 'react-dnd';

export default function DropZone({ index, letter, droppedLetter, correctAnswer, onDrop, showFeedback, image_path }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LETTER',
    drop: (item) => {
      if (!droppedLetter) {
        onDrop(item.letter, index);
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [droppedLetter, index]);

  const isCorrect = showFeedback && droppedLetter === correctAnswer;

  return (
    <div
      ref={drop}
      className={`w-full h-40 bg-white rounded-xl border-2 flex flex-col items-center justify-center p-4 cursor-pointer transition ${
        isOver ? 'border-blue-500 bg-blue-50' : 
        droppedLetter ? 
          (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') :
          'border-gray-300 hover:border-gray-400'
      }`}
    >
      {/* Gambar Gesture */}
      <div className="w-20 h-20 mb-2">
        <img
          src={`http://localhost:5000${image_path}`}
          alt={`Gerakan tangan huruf ${letter}`}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            e.target.src = '/placeholder-hand.png'; // gambar placeholder
          }}
        />
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        {droppedLetter ? `Seret huruf ${droppedLetter}` : 'Seret huruf ke sini'}
      </div>
      {showFeedback && (
        <div className={`mt-2 text-xs font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? '✓ Benar' : '✗ Salah'}
        </div>
      )}
    </div>
  );
}