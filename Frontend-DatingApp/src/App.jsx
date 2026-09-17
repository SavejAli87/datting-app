import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Matches from "./pages/Matches";
import Subscription from "./pages/Subscription";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ProfileSetup from "./pages/ProfileSetup";

function App() {
  return (

    <BrowserRouter>

      <Navbar />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />



          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/subscription" element={<Subscription />} />


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;