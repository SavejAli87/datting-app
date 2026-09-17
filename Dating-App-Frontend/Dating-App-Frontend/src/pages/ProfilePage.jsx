import React, { useState, useEffect } from 'react';
import { User, Camera, Save, MapPin, Heart, Shield, Sparkles } from 'lucide-react';
import { getMyProfile, updateBasicProfile, uploadProfileImage } from '../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'Ananya Verma',
    bio: 'Coffee lover & avid reader 📚☕',
    gender: 'FEMALE',
    interestedIn: 'MALE',
    location: 'Mumbai, India',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then(res => { if (res.data) setProfile(res.data); })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadProfileImage(formData);
      if (res.data && res.data.url) {
        setProfile(p => ({ ...p, imageUrl: res.data.url }));
      }
    } catch (err) {}
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBasicProfile(profile);
    } catch (e) {}
    setSaving(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Header Photo Upload */}
        <div className="flex flex-col items-center">
          <div className="relative group w-28 h-28">
            <img
              src={profile.imageUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-rose-100 shadow-md"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-rose-500 text-white rounded-full shadow-lg cursor-pointer hover:bg-rose-600 transition">
              <Camera className="w-4 h-4" />
              <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
            </label>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-3">{profile.fullName}</h2>
          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" /> {profile.location}
          </span>
        </div>

        {/* Form Details */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={e => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Bio</label>
            <textarea
              rows="3"
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Gender</label>
              <select
                value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Interested In</label>
              <select
                value={profile.interestedIn}
                onChange={e => setProfile({ ...profile, interestedIn: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="MALE">Men</option>
                <option value="FEMALE">Women</option>
                <option value="EVERYONE">Everyone</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>
    </div>
  );
}
