// src/components/SidebarAdmin.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SidebarAdmin() {
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState(""); // 🔥 TAMBAHKAN INI!
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "admin") {
      navigate("/");
      return;
    }
    
    setUserName(user.name || "Admin");
    setUserEmail(user.email || ""); // 🔥 SIMPAN EMAIL!
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menu = [
    { icon: "📊", label: "Dashboard", path: "/admin" },
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
            {/* 🔥 TAMPILKAN EMAIL JIKA ADA */}
            {userEmail && (
              <div className="text-xs text-blue-200 truncate">{userEmail}</div>
            )}
            {/* 🔥 JIKA TIDAK ADA EMAIL, TAMPILKAN "Admin Panel" */}
            {!userEmail && (
              <div className="text-xs text-blue-200">Admin Panel</div>
            )}
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