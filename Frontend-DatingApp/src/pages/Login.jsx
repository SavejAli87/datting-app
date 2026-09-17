import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/login", {
        mobile,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/profile");
    } catch {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-pink-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <input
          className="w-full border p-3 mb-4 rounded"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 mb-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right mb-4">
          <Link
            to="/forgot-password"
            className="text-pink-600 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-600"
        >
          Login
        </button>

      </div>
    </div>
  );
}