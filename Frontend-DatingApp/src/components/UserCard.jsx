import { Heart, X } from "lucide-react";

export default function UserCard({ user }) {
  return (
    <div className="relative w-80 h-[520px] rounded-3xl overflow-hidden shadow-2xl bg-white">

      <img
        src={user.profileImageUrl}
        alt={user.displayName}
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-2xl font-bold">
              {user.displayName}, {user.age}
            </h2>
            <p className="text-gray-300 text-sm">
              {user.city || "Unknown Location"}
            </p>
          </div>

          {user.online && (
            <span className="bg-green-500 text-xs text-white px-2 py-1 rounded-full">
              Online
            </span>
          )}
        </div>

      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-6">
        <button className="bg-white p-4 rounded-full shadow-lg hover:scale-110 transition">
          <X className="text-red-500" size={28} />
        </button>

        <button className="bg-pink-500 p-4 rounded-full shadow-lg hover:scale-110 transition">
          <Heart className="text-white" size={28} />
        </button>
      </div>
    </div>
  );
}