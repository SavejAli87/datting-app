import TinderCard from "react-tinder-card";
import { motion } from "framer-motion";

export default function SwipeCard({ user, onSwipe }) {
  return (
    <TinderCard
      className="absolute"
      onSwipe={(dir) => onSwipe(dir, user.id)}
      preventSwipe={["up", "down"]}
    >
      <motion.div
        whileTap={{ scale: 1.05 }}
        className="bg-white w-80 h-[500px] rounded-3xl shadow-2xl overflow-hidden"
      >
        <img
          src={user.image}
          className="w-full h-96 object-cover"
        />

        <div className="p-4">
          <h2 className="text-2xl font-bold">
            {user.name}, {user.age}
          </h2>

          <div className="flex items-center mt-2">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">
              Online
            </span>
          </div>
        </div>
      </motion.div>
    </TinderCard>
  );
}