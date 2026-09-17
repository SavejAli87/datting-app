import { motion } from "framer-motion";

export default function FilterModel({ open }) {
  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: open ? 0 : 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6"
    >
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      <label>Age Range</label>
      <input type="range" className="w-full mb-4" />

      <button className="bg-pink-500 text-white px-4 py-2 rounded w-full">
        Apply
      </button>
    </motion.div>
  );
}