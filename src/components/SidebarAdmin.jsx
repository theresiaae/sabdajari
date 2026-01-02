// src/components/SidebarAdmin.jsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SidebarAdmin() {
  const [userName, setUserName] = useState("Admin");
  const location = useLocation();

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin";
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  // Menu admin hanya 2
  const menu = [
    { icon: "📚", label: "Kelola Kamus", path: "/admin/kamus" },
    { icon: "📰", label: "Kelola Artikel", path: "/admin/artikel" },
  ];

  return (
    <aside className="w-52 bg-blue-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">👤</div>
          <div className="flex-1">
            <div className="font-medium">{userName}</div>
            <div className="text-xs text-blue-200">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menu Admin */}
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

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full bg-blue-700 text-white py-2 px-3 rounded-lg hover:bg-blue-800 transition text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}