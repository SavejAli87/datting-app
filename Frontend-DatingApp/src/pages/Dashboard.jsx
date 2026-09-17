import { Heart, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl font-bold text-pink-600 mb-6">
          Find Your Perfect Match 💕
        </h1>

        <p className="text-gray-600 max-w-xl mb-8">
          Connect with amazing people around the world. 
          Swipe, match and start your love story today.
        </p>

        <button
          onClick={() => navigate("/matches")}
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transition duration-300"
        >
          Start Matching
        </button>
      </section>

      {/* SWIPE CARDS PREVIEW */}
      <section className="flex justify-center gap-6 px-6 pb-16 flex-wrap">
        {[
          {
            name: "Sophia",
            age: 24,
            image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          },
          {
            name: "Emma",
            age: 22,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          },
          {
            name: "Olivia",
            age: 25,
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9"
          }
        ].map((user, index) => (
          <div
            key={index}
            className="relative w-72 h-96 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-300"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 w-full">
              <h3 className="text-white text-xl font-semibold">
                {user.name}, {user.age}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <Heart className="mx-auto text-pink-500 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">
              AI powered matching system to find your perfect partner.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <Users className="mx-auto text-purple-500 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Global Community</h3>
            <p className="text-gray-600">
              Connect with singles from all over the world.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <Star className="mx-auto text-yellow-500 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Premium Experience</h3>
            <p className="text-gray-600">
              Enjoy exclusive features with our premium plans.
            </p>
          </div>

        </div>
      </section>

      {/* PREMIUM CTA */}
      <section className="py-20 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <h2 className="text-4xl font-bold mb-6">
          Upgrade to Premium 💎
        </h2>

        <p className="mb-8">
          Unlock unlimited likes, see who liked you, and boost your profile.
        </p>

        <button
          onClick={() => navigate("/subscription")}
          className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          View Plans
        </button>
      </section>

    </div>
  );
}