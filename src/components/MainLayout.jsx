// src/components/MainLayout.jsx
import Sidebar from './sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-12xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}