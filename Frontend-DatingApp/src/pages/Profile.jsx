import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Profile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {

    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {

      try {

        const res = await axios.get(`/profile/me/${userId}`);

        setProfile(res.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, [userId]);

  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    );

  }

  if (!profile) {

    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Profile Not Found
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-pink-500 h-44"></div>

        <div className="px-8 pb-8">

          <div className="-mt-16 flex flex-col md:flex-row gap-6 items-center">

            <img
              src={
                profile.profileImageUrl
                  ? profile.profileImageUrl
                  : "https://via.placeholder.com/180"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
            />

            <div>

              <h2 className="text-4xl font-bold">

                {profile.name}

              </h2>

              <p className="text-gray-600">

                @{profile.displayName}

              </p>

              <p className="text-pink-500">

                {profile.email}

              </p>

              {profile.verifiedSelfie ? (

                <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  ✔ Verified
                </span>

              ) : (

                <span className="inline-block mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  Verification Pending
                </span>

              )}

            </div>

          </div>

          <div className="mt-8">

            <h3 className="text-2xl font-bold mb-3">

              About Me

            </h3>

            <div className="bg-gray-100 rounded-xl p-5">

              {profile.bio || "No Bio"}

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

            <div className="bg-pink-50 rounded-xl p-4">
              <b>Language</b>
              <p>{profile.language || "-"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <b>Appearance</b>
              <p>{profile.appearance || "-"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <b>Body Type</b>
              <p>{profile.bodyType || "-"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <b>Height</b>
              <p>{profile.height ? profile.height + " cm" : "-"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <b>English Level</b>
              <p>{profile.englishLevel || "-"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <b>Ethnicity</b>
              <p>{profile.ethnicity || "-"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <b>Smoke</b>
              <p>{profile.smoke || "-"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <b>Drink</b>
              <p>{profile.drink || "-"}</p>
            </div>

          </div>

          <div className="mt-10">

            <h3 className="text-2xl font-bold mb-4">

              Gallery

            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {profile.images && profile.images.length > 0 ? (

                profile.images.map((img, index) => (

                  <img
                    key={index}
                    src={img}
                    alt="Gallery"
                    className="w-full h-40 rounded-xl object-cover"
                  />

                ))

              ) : (

                <p>No Images Uploaded</p>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}