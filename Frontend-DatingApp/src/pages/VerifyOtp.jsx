import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function VerifyOtp() {

    const navigate = useNavigate();

    const sessionId = localStorage.getItem("sessionId");

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const verifyOtp = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {

            const response = await axios.post("/verify-register/otp", {

                sessionId,
                otp

            });

            setMessage("✅ OTP Verified Successfully");

            // JWT token agar backend bhej raha hai
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            setTimeout(() => {

                navigate("/dashboard");

            }, 1000);

        } catch (error) {

            const msg =
                error.response?.data?.message ||
                error.response?.data ||
                "Invalid OTP";

            setMessage("❌ " + msg);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-96">

                <h2 className="text-3xl font-bold text-center text-pink-600 mb-2">
                    Verify OTP
                </h2>

                <p className="text-center text-gray-500 mb-6">
                    Enter the OTP sent to your mobile number
                </p>

                <form onSubmit={verifyOtp} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Enter 6 Digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                        className="w-full p-3 border rounded-lg text-center text-xl tracking-[8px] focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-3 rounded-lg text-white font-semibold ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-pink-500 hover:bg-pink-600"
                        }`}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>

                {message && (
                    <p
                        className={`text-center mt-5 font-medium ${
                            message.startsWith("✅")
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {message}
                    </p>
                )}

            </div>

        </div>

    );
}