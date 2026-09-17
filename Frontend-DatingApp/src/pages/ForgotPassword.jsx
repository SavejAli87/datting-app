import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const sendOtp = async () => {

        if (!mobile) {
            setMessage("Please enter mobile number");
            return;
        }

        setLoading(true);

        try {

            const res = await axios.post("/forgot-password/send-otp", {

                mobile

            });

            localStorage.setItem("resetMobile", mobile);

            setMessage(res.data);

            setTimeout(() => {

                navigate("/reset-password");

            },1000);

        } catch (err) {

            setMessage(err.response?.data || "Failed to send OTP");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-pink-100">

            <div className="bg-white p-8 rounded-xl shadow-xl w-96">

                <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
                    Forgot Password
                </h2>

                <input
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChange={(e)=>setMobile(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-5"
                />

                <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600"
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>

                {message && (
                    <p className="mt-4 text-center text-sm text-green-600">
                        {message}
                    </p>
                )}

            </div>

        </div>

    );

}