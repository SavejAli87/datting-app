import { motion } from "framer-motion";

export default function Subscription() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-96 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Premium</h2>
        <p className="mb-6">Unlimited Swipes + Super Boost</p>

        <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full">
          Upgrade Now
        </button>
      </motion.div>
    </div>
  );
}