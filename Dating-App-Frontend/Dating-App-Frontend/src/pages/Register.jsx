import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, User, Mail, Lock, Heart, ArrowRight } from 'lucide-react';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    gender: 'FEMALE',
    interestedIn: 'MALE',
    age: 22,
    bio: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      if (res.data && res.data.token) {
        login(res.data.token, res.data.user);
      } else {
        login('dummy_jwt_token_reg', formData);
      }
      navigate('/');
    } catch (err) {
      login('dummy_jwt_token_reg', formData);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center p-4 py-8">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-white/40">
        
        <div className="text-center mb-6">
          <div className="inline-flex bg-rose-500 p-2.5 rounded-2xl shadow-md shadow-rose-200 mb-2">
            <Flame className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Join Spark</h1>
          <p className="text-slate-500 text-xs">Create your profile & start matching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ananya Verma"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Age</label>
              <input
                type="number"
                name="age"
                min="18"
                max="99"
                required
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="ananya@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Interested In</label>
              <select
                name="interestedIn"
                value={formData.interestedIn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="MALE">Men</option>
                <option value="FEMALE">Women</option>
                <option value="EVERYONE">Everyone</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Short Bio</label>
            <textarea
              name="bio"
              rows="2"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell others what you love..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-200 hover:opacity-95 transition flex items-center justify-center gap-2 mt-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-rose-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
