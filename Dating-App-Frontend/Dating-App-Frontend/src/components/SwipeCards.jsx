import React, { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin, Sparkles, SlidersHorizontal, Info, Shield } from 'lucide-react';
import { getExploreCards, sendConnectionRequest } from '../services/api';

export default function SwipeCards({ onOpenFilter }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await getExploreCards();
      if (res.data && res.data.length > 0) {
        setCards(res.data);
      } else {
        setCards(mockData);
      }
    } catch (err) {
      setCards(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (currentIndex >= cards.length) return;
    const target = cards[currentIndex];

    if (action === 'LIKE' || action === 'SUPERLIKE') {
      try {
        const res = await sendConnectionRequest({
          receiverId: target.id,
          requestType: action
        });
        if (res.data && res.data.isMatch) {
          setMatchedUser(target);
        }
      } catch (e) {
        // Continue UI interaction
      }
    }
    setCurrentIndex(prev => prev + 1);
  };

  const currentCard = cards[currentIndex];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Finding potential matches near you...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col items-center">
      
      {/* Header Actions */}
      <div className="w-full flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Discover</h1>
          <p className="text-xs text-slate-500">Swipe right to connect</p>
        </div>
        <button
          onClick={onOpenFilter}
          className="p-2.5 bg-white shadow-sm border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 text-sm font-semibold"
        >
          <SlidersHorizontal className="w-4 h-4 text-rose-500" />
          <span>Filter</span>
        </button>
      </div>

      {/* Card Display */}
      {currentCard ? (
        <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
          <img
            src={currentCard.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
            alt={currentCard.fullName}
            className="w-full h-full object-cover object-center"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Badge */}
          {currentCard.verified && (
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1 border border-white/30">
              <Shield className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
              <span>Verified Profile</span>
            </div>
          )}

          {/* Info Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-extrabold">{currentCard.fullName || currentCard.name}</h2>
              <span className="text-2xl font-medium opacity-90">{currentCard.age || 24}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{currentCard.location || 'Mumbai, 3 km away'}</span>
            </div>

            <p className="text-sm text-slate-200 line-clamp-2 mt-1">
              {currentCard.bio || 'Love traveling, coffee dates, and deep conversations ☕✨'}
            </p>

            {/* Interests Chips */}
            {currentCard.interests && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {currentCard.interests.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-lg text-[11px] font-medium text-white border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full aspect-[3/4] bg-white border border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-center p-6 shadow-sm">
          <Sparkles className="w-12 h-12 text-amber-400 mb-3" />
          <h3 className="text-xl font-bold text-slate-800">No More Profiles</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            You've viewed all profiles in your location. Try broadening your filter preferences!
          </p>
          <button
            onClick={() => { setCurrentIndex(0); fetchCards(); }}
            className="mt-6 px-6 py-2.5 bg-rose-500 text-white font-semibold text-sm rounded-xl hover:bg-rose-600 transition shadow-md shadow-rose-200"
          >
            Refresh Feed
          </button>
        </div>
      )}

      {/* Control Action Buttons */}
      {currentCard && (
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => handleAction('REJECT')}
            className="p-4 bg-white text-rose-500 rounded-full shadow-lg hover:bg-rose-50 hover:scale-110 active:scale-95 transition border border-slate-100"
          >
            <X className="w-7 h-7 stroke-[3]" />
          </button>

          <button
            onClick={() => handleAction('SUPERLIKE')}
            className="p-3 bg-white text-sky-500 rounded-full shadow-lg hover:bg-sky-50 hover:scale-110 active:scale-95 transition border border-slate-100"
          >
            <Star className="w-6 h-6 fill-sky-500" />
          </button>

          <button
            onClick={() => handleAction('LIKE')}
            className="p-4 bg-gradient-to-tr from-rose-500 to-pink-500 text-white rounded-full shadow-xl shadow-rose-200 hover:scale-110 active:scale-95 transition"
          >
            <Heart className="w-7 h-7 fill-white" />
          </button>
        </div>
      )}

      {/* Match Modal */}
      {matchedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 animate-bounce-short">
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto" />
            <h2 className="text-3xl font-black text-slate-800">It's a Match!</h2>
            <p className="text-sm text-slate-600">
              You and <span className="font-bold text-rose-500">{matchedUser.fullName || matchedUser.name}</span> liked each other.
            </p>
            <button
              onClick={() => setMatchedUser(null)}
              className="w-full py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const mockData = [
  { id: 101, fullName: 'Aanya Verma', age: 23, location: 'Delhi, 4 km away', bio: 'Architect | Music Addict 🎧 | Coffee first!', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', interests: ['Music', 'Design', 'Travel'], verified: true },
  { id: 102, fullName: 'Rahul Sharma', age: 26, location: 'Mumbai, 2 km away', bio: 'Software Engineer & Fitness Freak 🏋️‍♂️', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800', interests: ['Coding', 'Gym', 'Movies'], verified: false },
  { id: 103, fullName: 'Priya Nair', age: 24, location: 'Bangalore, 5 km away', bio: 'Foodie 🍕 | Dog Mom 🐶 | Trekking', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', interests: ['Dogs', 'Trekking', 'Food'], verified: true }
];
