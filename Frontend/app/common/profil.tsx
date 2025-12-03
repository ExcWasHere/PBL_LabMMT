import { useState, useEffect, type ChangeEvent } from "react";
import { User, Mail, Phone, Briefcase, Camera, ArrowLeft } from "lucide-react";

const ProfilPage = () => {
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    status: "",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    photo: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        const profileData = {
          name: parsed.name ?? parsed.fullname ?? parsed.username ?? "KetuaLab",
          role: parsed.role ?? "Lab Member",
          email: parsed.email ?? "user@gmail.com",
          phone: parsed.phone ?? parsed.phoneNumber ?? "08123456789",
          status: parsed.status ?? "Available",
          photo: parsed.photo ?? "../member/person1.jpg",
        };
        setProfile(profileData);
        setEditData({
          status: profileData.status,
          photo: profileData.photo,
        });
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  }, []);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditData((prev) => ({ ...prev, photo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile((prev) => ({
      ...prev,
      status: editData.status,
      photo: editData.photo || prev.photo,
    }));

    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  const handleCancel = () => {
    setEditData({
      status: profile.status,
      photo: profile.photo,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
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
          <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Photo Section */}
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div className="relative">
                <img
                  src={isEditing ? editData.photo || profile.photo : profile.photo}
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

              {/* Editable Status */}
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-600">
                    Status
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.status}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full ml-6 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Contoh: Available, Busy, In a meeting..."
                  />
                ) : (
                  <p className="text-gray-800 ml-6">{profile.status}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3 justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-lg"
                  >
                    Simpan Perubahan
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