import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Flame, MessageSquare, User, Bell, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getNotifications } from '../services/api';

export default function Navbar({ onOpenSupport, onOpenSubscription }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    getNotifications()
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setUnreadCount(res.data.filter(n => !n.read).length);
        }
      })
      .catch(() => {});
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 px-4 lg:px-8 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-rose-500 to-pink-500 p-2 rounded-2xl shadow-md shadow-rose-200 group-hover:scale-105 transition">
            <Flame className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
            Spark
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`p-2.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 font-semibold text-sm transition ${
              isActive('/') 
                ? 'bg-rose-50 text-rose-600' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="hidden sm:inline">Discover</span>
          </Link>

          <Link
            to="/matches"
            className={`p-2.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 font-semibold text-sm transition ${
              isActive('/matches') 
                ? 'bg-rose-50 text-rose-600' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Matches</span>
          </Link>

          <Link
            to="/profile"
            className={`p-2.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 font-semibold text-sm transition ${
              isActive('/profile') 
                ? 'bg-rose-50 text-rose-600' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          {/* Premium Plan Button */}
          <button
            onClick={onOpenSubscription}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold text-xs shadow-sm hover:opacity-95 transition"
          >
            <Sparkles className="w-4 h-4 fill-slate-900" />
            <span>Premium</span>
          </button>

          {/* Support */}
          <button
            onClick={onOpenSupport}
            title="Help & Support"
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            title="Logout"
            className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
