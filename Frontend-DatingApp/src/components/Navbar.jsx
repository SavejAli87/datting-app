import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-bold text-pink-600"
        >
          LoveConnect 💖
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">

          <Link
            to="/dashboard"
            className={`font-medium ${isActive("/dashboard")
                ? "text-pink-600"
                : "text-gray-600 hover:text-pink-600"
              }`}
          >
            Home
          </Link>

          <Link
            to="/matches"
            className={`font-medium ${isActive("/matches")
                ? "text-pink-600"
                : "text-gray-600 hover:text-pink-600"
              }`}
          >
            Matches
          </Link>

          <Link
            to="/profile"
            className={`font-medium ${isActive("/profile")
                ? "text-pink-600"
                : "text-gray-600 hover:text-pink-600"
              }`}
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-3">

          <Link
            to="/dashboard"
            className="block text-gray-700 hover:text-pink-600"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/matches"
            className="block text-gray-700 hover:text-pink-600"
            onClick={() => setOpen(false)}
          >
            Matches
          </Link>

          <Link
            to="/profile"
            className="block text-gray-700 hover:text-pink-600"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          <button
            onClick={() => navigate("/subscription")}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow"
          >
            <Crown size={18} />
            Premium
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}