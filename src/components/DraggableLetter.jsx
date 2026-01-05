// src/components/DraggableLetter.jsx
import { useDrag } from 'react-dnd';

export default function DraggableLetter({ letter }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LETTER',
    item: { letter },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [letter]);

  return (
    <div
      ref={drag}
      className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg cursor-move transition ${
        isDragging ? 'opacity-50' : 'bg-white border border-gray-300 hover:bg-gray-100'
      }`}
    >
      {letter}
    </div>
  );
}