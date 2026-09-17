import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {

    const navigate = useNavigate();

    const mobile = localStorage.getItem("resetMobile");

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const resetPassword = async () => {

        if (newPassword !== confirmPassword) {

            setMessage("Passwords do not match");

            return;

        }

        try {

            const res = await axios.post("/forgot-password/reset", {

                mobile,
                otp,
                newPassword

            });

            setMessage(res.data);

            setTimeout(() => {

                navigate("/login");

            },1500);

        } catch (err) {

            setMessage(err.response?.data || "Reset Failed");

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-pink-100">

            <div className="bg-white p-8 rounded-xl shadow-xl w-96">

                <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
                    Reset Password
                </h2>

                <input
                    value={otp}
                    onChange={(e)=>setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full border rounded-lg p-3 mb-3"
                />

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full border rounded-lg p-3 mb-3"
                />

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full border rounded-lg p-3 mb-4"
                />

                <button
                    onClick={resetPassword}
                    className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600"
                >
                    Reset Password
                </button>

                {message && (

                    <p className="mt-4 text-center">

                        {message}

                    </p>

                )}

            </div>

        </div>

    );

}