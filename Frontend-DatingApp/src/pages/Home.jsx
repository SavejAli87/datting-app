import { useEffect, useState } from "react";
import axios from "../api/axios";
import UserCard from "../components/UserCard";
import SkeletonCard from "../components/SkeletonCard";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users/feed");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <Navbar />

      <div className="flex-1 flex justify-center p-4">
        {loading ? (
          <SkeletonCard />
        ) : users.length === 0 ? (
          <p className="text-gray-500 mt-20">No more matches 💔</p>
        ) : (
          <UserCard user={users[0]} />
        )}
      </div>

      <BottomNav />
    </div>
  );
}