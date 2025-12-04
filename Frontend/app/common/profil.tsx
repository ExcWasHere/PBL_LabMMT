import { useState, useEffect, type ChangeEvent } from "react";
import { User, Mail, Phone, Briefcase, Camera, ArrowLeft } from "lucide-react";

const ProfilPage = () => {
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: "",
    photo: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const getPhotoUrl = (raw?: string) => {
    if (!raw) return "../member/person1.jpg";
    if (raw.startsWith("/uploads")) {
      return `http://localhost:3000${raw}`;
    }
    return raw;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:3000/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const profileData = {
          name: data.name ?? data.fullname ?? data.username ?? "KetuaLab",
          role: data.role ?? "Lab Member",
          email: data.email ?? "user@gmail.com",
          phone: data.phone ?? data.phoneNumber ?? "08123456789",
          bio: data.bio ?? data.status ?? "Belum ada bio",
          photo: data.photo ?? "",
        };
        setProfile(profileData);
        setEditData({
          bio: profileData.bio,
          photo: profileData.photo,
        });
      } else {
        loadFromLocalStorage();
      }
    } catch (e) {
      console.error("Error loading profile:", e);
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        const profileData = {
          name: parsed.name ?? parsed.fullname ?? parsed.username ?? "KetuaLab",
          role: parsed.role ?? "Lab Member",
          email: parsed.email ?? "user@gmail.com",
          phone: parsed.phone ?? parsed.phoneNumber ?? "08123456789",
          bio: parsed.bio ?? parsed.status ?? "Belum ada bio",
          photo: parsed.photo ?? "",
        };
        setProfile(profileData);
        setEditData({
          bio: profileData.bio,
          photo: profileData.photo,
        });
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditData((prev) => ({ ...prev, photo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let latestPhoto = profile.photo;
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const photoResponse = await fetch(
          "http://localhost:3000/user/photo",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: formData,
          }
        );

        if (!photoResponse.ok) {
          const errorText = await photoResponse.text();
          console.error(
            "Gagal update photo:",
            photoResponse.status,
            errorText
          );
          alert("Gagal menyimpan foto profil.");
          return;
        }

        const photoData = await photoResponse.json();
        latestPhoto = photoData.photo;

        setProfile((prev) => ({ ...prev, photo: latestPhoto }));
      }
      const bioResponse = await fetch("http://localhost:3000/user/bio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ bio: editData.bio }),
      });

      if (!bioResponse.ok) {
        const errorText = await bioResponse.text();
        console.error("Gagal update bio:", bioResponse.status, errorText);
        alert("Gagal menyimpan bio.");
        return;
      }

      const bioData = await bioResponse.json();
      setProfile((prev) => ({ ...prev, bio: bioData.bio }));
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.bio = bioData.bio;
        user.photo = latestPhoto;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setIsEditing(false);
      setPhotoFile(null);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Gagal menyimpan profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      bio: profile.bio,
      photo: profile.photo,
    });
    setPhotoFile(null);
    setIsEditing(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: "url(/latar-belakang.svg)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/60 rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Profil Saya</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-linear-to-r from-orange-400 to-orange-600"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Photo Section */}
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div className="relative">
                <img
                  src={
                    isEditing
                      ? editData.photo || getPhotoUrl(profile.photo)
                      : getPhotoUrl(profile.photo)
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600 transition shadow-lg">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {profile.name}
              </h2>
              <p className="text-gray-600">{profile.role}</p>
            </div>

            {/* Info Sections */}
            <div className="space-y-6">
              {/* Non-editable Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">
                      Email
                    </span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">
                      No. HP
                    </span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.phone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <User size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">
                      Nama Lengkap
                    </span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">
                      Role
                    </span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.role}</p>
                </div>
              </div>

              {/* Editable Bio */}
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <User size={20} className="text-orange-500" />
                  <span className="text-sm font-semibold text-gray-600">
                    Bio
                  </span>
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Ceritakan tentang dirimu..."
                  />
                ) : (
                  <p className="text-gray-800 ml-6 whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3 justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-lg"
                >
                  Edit Profil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;