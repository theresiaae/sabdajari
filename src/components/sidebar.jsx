// src/components/sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [userName, setUserName] = useState("Sabda Jari");
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 🔥 Cek apakah user sudah login (ada token)
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(user.name || "Sabda Jari");
      setUserEmail(user.email || "");
    } else {
      setIsLoggedIn(false);
      setUserName("Sabda Jari");
      setUserEmail("");
    }
  }, []);

  const handleLogout = () => {
    // 🔥 Hapus semua data login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menu = [
    { icon: "🏠", label: "Beranda", path: "/" },
    { icon: "📚", label: "Kamus", path: "/kamus" },
    { icon: "❓", label: "Kuis", path: "/kuis" },
    { icon: "📷", label: "Scan", path: "/scan" },
    { icon: "📰", label: "Artikel", path: "/artikel" }, 
  ];

  return (
    <aside className="w-53 bg-blue-900 text-white flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">👤</div>
          <div className="flex-1">
            <div className="font-medium">{userName}</div>
            {userEmail && <div className="text-xs text-blue-200 truncate">{userEmail}</div>}
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-800 text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {isLoggedIn && (
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full bg-blue-700 text-white py-2 px-3 rounded-lg hover:bg-blue-800 transition text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}