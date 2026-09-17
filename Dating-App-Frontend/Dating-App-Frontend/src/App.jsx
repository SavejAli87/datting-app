import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SwipeCards from './components/SwipeCards';
import Login from './pages/Login';
import Register from './pages/Register';
import Matches from './pages/Matches';
import ProfilePage from './pages/ProfilePage';
import { AuthContext, AuthProvider } from './context/AuthContext';

function ProtectedLayout() {
  const [showFilter, setShowFilter] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showSub, setShowSub] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        onOpenSupport={() => setShowSupport(true)}
        onOpenSubscription={() => setShowSub(true)}
      />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<SwipeCards onOpenFilter={() => setShowFilter(true)} />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Search Filters</h3>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Max Distance (km)</label>
              <input type="range" min="1" max="100" defaultValue="50" className="w-full accent-rose-500" />
            </div>
            <button
              onClick={() => setShowFilter(false)}
              className="w-full py-2.5 bg-rose-500 text-white font-bold rounded-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-3">
            <h3 className="text-xl font-bold text-slate-800">Help & Support</h3>
            <textarea placeholder="Describe your issue..." rows="3" className="w-full p-3 bg-slate-50 border rounded-xl text-xs"></textarea>
            <div className="flex gap-2">
              <button onClick={() => setShowSupport(false)} className="flex-1 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button onClick={() => setShowSupport(false)} className="flex-1 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs">
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="text-2xl font-black text-slate-800">Spark Premium ⚡</h3>
            <p className="text-xs text-slate-500">Get unlimited likes, see who liked you & send superlikes!</p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-2xl font-extrabold text-amber-600">₹299</span> / month
            </div>
            <button onClick={() => setShowSub(false)} className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 font-bold text-slate-900 rounded-xl">
              Upgrade Now
            </button>
            <button onClick={() => setShowSub(false)} className="text-xs text-slate-400 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
