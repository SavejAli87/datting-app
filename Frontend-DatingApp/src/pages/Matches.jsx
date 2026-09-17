import { MessageCircle } from "lucide-react";

const matches = [
  {
    id: 1,
    name: "Aisha",
    age: 23,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    online: true,
    lastMessage: "Hey! How are you? 😊",
    unread: 2,
  },
  {
    id: 2,
    name: "Sofia",
    age: 25,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    online: false,
    lastMessage: "Let’s catch up soon!",
    unread: 0,
  },
];

export default function Matches() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <h2 className="text-3xl font-bold text-pink-600 mb-6">
        Your Matches 💕
      </h2>

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No matches yet 💔
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-4 flex items-center gap-4 relative"
            >
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-20 h-20 rounded-full object-cover"
                />

                {match.online && (
                  <span className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {match.name}, {match.age}
                </h3>
                <p className="text-gray-500 text-sm truncate">
                  {match.lastMessage}
                </p>
              </div>

              {/* Chat Icon */}
              <div className="relative">
                <MessageCircle className="text-pink-500" />

                {match.unread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {match.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}