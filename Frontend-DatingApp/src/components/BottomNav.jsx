import { Home, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-inner flex justify-around py-3 fixed bottom-0 w-full">
      
      <button onClick={() => navigate("/dashboard")}>
        <Home className="text-gray-600" />
      </button>

      <button onClick={() => navigate("/matches")}>
        <Heart className="text-gray-600" />
      </button>

      <button onClick={() => navigate("/profile")}>
        <User className="text-gray-600" />
      </button>

    </div>
  );
}