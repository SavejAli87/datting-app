import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function ProfileSetup() {

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    displayName: "",
    gender: "",
    orientation: "",
    age: "",
    dob: "",
    bio: "",
    language: "",
    appearance: "",
    bodyType: "",
    height: "",
    englishLevel: "",
    ethnicity: "",
    lookingFor: "",
    smoke: "",
    drink: ""
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (photo) {
        data.append("photo", photo);
      }

      await axios.post(`/profile/${userId}/setup`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Profile Setup Successfully ❤️");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Profile Setup Failed");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-center text-pink-600 mb-8">
          Complete Your Profile ❤️
        </h1>

        {/* IMPORTANT: Form yahan se start hoga */}
        <form onSubmit={handleSubmit}>
          {/* Photo */}
<div className="flex justify-center mb-8">
  <div className="text-center">
    <img
      src={preview || "https://via.placeholder.com/180"}
      alt="Profile"
      className="w-40 h-40 rounded-full object-cover border-4 border-pink-400 mx-auto"
    />

    <input
      type="file"
      accept="image/*"
      onChange={handleImage}
      className="mt-4"
    />
  </div>
</div>

<div className="grid md:grid-cols-2 gap-5">

  <input
    type="text"
    name="displayName"
    placeholder="Display Name"
    value={formData.displayName}
    onChange={handleChange}
    className="border rounded-xl p-3"
  />

  <select
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>

  <select
    name="orientation"
    value={formData.orientation}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">Orientation</option>
    <option value="Straight">Straight</option>
    <option value="Gay">Gay</option>
    <option value="Lesbian">Lesbian</option>
    <option value="Bisexual">Bisexual</option>
  </select>

  <input
    type="number"
    name="age"
    placeholder="Age"
    value={formData.age}
    onChange={handleChange}
    className="border rounded-xl p-3"
  />

  <input
    type="date"
    name="dob"
    value={formData.dob}
    onChange={handleChange}
    className="border rounded-xl p-3"
  />

  <input
    type="number"
    name="height"
    placeholder="Height (CM)"
    value={formData.height}
    onChange={handleChange}
    className="border rounded-xl p-3"
  />

  <input
    type="text"
    name="language"
    placeholder="Language"
    value={formData.language}
    onChange={handleChange}
    className="border rounded-xl p-3"
  />

  <textarea
    rows="4"
    name="bio"
    placeholder="Tell Something About Yourself..."
    value={formData.bio}
    onChange={handleChange}
    className="border rounded-xl p-3 md:col-span-2"
  />

  <select
    name="appearance"
    value={formData.appearance}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">Appearance</option>
    <option value="Average">Average</option>
    <option value="Attractive">Attractive</option>
    <option value="Very Attractive">Very Attractive</option>
  </select>

  <select
    name="bodyType"
    value={formData.bodyType}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">Body Type</option>
    <option value="Slim">Slim</option>
    <option value="Fit">Fit</option>
    <option value="Athletic">Athletic</option>
    <option value="Average">Average</option>
    <option value="Heavy">Heavy</option>
  </select>

  <select
    name="englishLevel"
    value={formData.englishLevel}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">English Level</option>
    <option value="Basic">Basic</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Fluent">Fluent</option>
  </select>

  <input
    type="text"
    name="ethnicity"
    placeholder="Ethnicity"
    value={formData.ethnicity}
    onChange={handleChange}
    className="border rounded-xl p-3"
  />

  <select
    name="lookingFor"
    value={formData.lookingFor}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">Looking For</option>
    <option value="Friendship">Friendship</option>
    <option value="Relationship">Relationship</option>
    <option value="Marriage">Marriage</option>
  </select>

  <select
    name="smoke"
    value={formData.smoke}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">Smoke</option>
    <option value="No">No</option>
    <option value="Sometimes">Sometimes</option>
    <option value="Yes">Yes</option>
  </select>

  <select
    name="drink"
    value={formData.drink}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >
    <option value="">Drink</option>
    <option value="No">No</option>
    <option value="Sometimes">Sometimes</option>
    <option value="Yes">Yes</option>
  </select>

  <div className="md:col-span-2 mt-6">
    <button
      type="submit"
      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl text-lg"
    >
      Complete Profile ❤️
    </button>
  </div>

</div>

</form>

</div>
</div>
);
}