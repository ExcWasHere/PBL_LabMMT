import { useState, useEffect, type ChangeEvent } from "react";
import { User, Mail, Phone, Briefcase, Camera, ArrowLeft } from "lucide-react";

type SocialLinks = {
  linkedin?: string;
  email?: string;
  scholar?: string;
  sinta?: string;
  cv?: string;
};

type Profile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  photo: string;
  // lecture/admin ya ges
  nip?: string;
  nidn?: string;
  prodi?: string;
  jabatan_akademik?: string;
  tags: string[];
  pendidikan: string[];
  sertifikasi: string[];
  matkul_ganjil: string[];
  matkul_genap: string[];
  social_links?: SocialLinks;
};

type EditData = {
  bio: string;
  photo: string;
  nip: string;
  nidn: string;
  prodi: string;
  jabatan_akademik: string;
  tags: string;
  pendidikan: string;
  sertifikasi: string;
  matkul_ganjil: string;
  matkul_genap: string;
  linkedin: string;
  emailSocial: string;
  scholar: string;
  sinta: string;
  cv: string;
};

const ProfilPage = () => {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    nip: "",
    nidn: "",
    prodi: "",
    jabatan_akademik: "",
    tags: [],
    pendidikan: [],
    sertifikasi: [],
    matkul_ganjil: [],
    matkul_genap: [],
    social_links: {},
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    bio: "",
    photo: "",
    nip: "",
    nidn: "",
    prodi: "",
    jabatan_akademik: "",
    tags: "",
    pendidikan: "",
    sertifikasi: "",
    matkul_ganjil: "",
    matkul_genap: "",
    linkedin: "",
    emailSocial: "",
    scholar: "",
    sinta: "",
    cv: "",
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

  const arrToTextarea = (arr?: string[]) => (arr || []).join("\n");
  const textareaToArr = (txt?: string) =>
    (txt || "")
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const userRes = await fetch("http://localhost:3000/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      if (!userRes.ok) {
        loadFromLocalStorage();
        return;
      }

      const userData = await userRes.json();
      const base = {
        name: userData.name ?? userData.fullname ?? userData.username ?? "User",
        role: (userData.role ?? "mahasiswa").toLowerCase(),
        email: userData.email ?? "",
        phone: userData.phone ?? userData.phoneNumber ?? "",
        bio: userData.bio ?? userData.status ?? "",
        photo: userData.photo ?? "",
      };
      if (base.role === "dosen" || base.role === "admin") {
        try {
          const memberRes = await fetch("http://localhost:3000/member/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          });

          if (memberRes.ok) {
            const member = await memberRes.json();
            const social: SocialLinks = member.social_links ?? {};

            const merged: Profile = {
              ...base,
              nip: member.nip ?? "",
              nidn: member.nidn ?? "",
              prodi: member.prodi ?? "",
              jabatan_akademik: member.jabatan_akademik ?? "",
              tags: Array.isArray(member.tags) ? member.tags : textareaToArr(member.tags),
              pendidikan: Array.isArray(member.pendidikan) ? member.pendidikan : textareaToArr(member.pendidikan),
              sertifikasi: Array.isArray(member.sertifikasi) ? member.sertifikasi : textareaToArr(member.sertifikasi),
              matkul_ganjil: Array.isArray(member.matkul_ganjil) ? member.matkul_ganjil : textareaToArr(member.matkul_ganjil),
              matkul_genap: Array.isArray(member.matkul_genap) ? member.matkul_genap : textareaToArr(member.matkul_genap),
              social_links: social,
              photo: member.photoUrl ?? base.photo,
              bio: member.bio ?? base.bio,
            };
            setProfile(merged);
            setEditData({
              bio: merged.bio,
              photo: merged.photo,
              nip: merged.nip ?? "",
              nidn: merged.nidn ?? "",
              prodi: merged.prodi ?? "",
              jabatan_akademik: merged.jabatan_akademik ?? "",
              tags: (merged.tags || []).join(", "),
              pendidikan: arrToTextarea(merged.pendidikan),
              sertifikasi: arrToTextarea(merged.sertifikasi),
              matkul_ganjil: arrToTextarea(merged.matkul_ganjil),
              matkul_genap: arrToTextarea(merged.matkul_genap),
              linkedin: merged.social_links?.linkedin ?? "",
              emailSocial: merged.social_links?.email ?? "",
              scholar: merged.social_links?.scholar ?? "",
              sinta: merged.social_links?.sinta ?? "",
              cv: merged.social_links?.cv ?? "",
            });
            return;
          } else {
            setProfile(base as any);
            setEditData((prev) => ({ ...prev, bio: base.bio, photo: base.photo }));
            return;
          }
        } catch (err) {
          console.error("member/me fetch failed:", err);
          setProfile(base as any);
          setEditData((prev) => ({ ...prev, bio: base.bio, photo: base.photo }));
          return;
        }
      }
      setProfile(base as any);
      setEditData((prev) => ({ ...prev, bio: base.bio, photo: base.photo }));
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
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const profileData: Profile = {
        name: parsed.name ?? parsed.fullname ?? parsed.username ?? "User",
        role: parsed.role ?? "mahasiswa",
        email: parsed.email ?? "",
        phone: parsed.phone ?? "",
        bio: parsed.bio ?? "",
        photo: parsed.photo ?? "",
        nip: parsed.nip ?? "",
        nidn: parsed.nidn ?? "",
        prodi: parsed.prodi ?? "",
        jabatan_akademik: parsed.jabatan_akademik ?? "",
        tags: parsed.tags ?? [],
        pendidikan: parsed.pendidikan ?? [],
        sertifikasi: parsed.sertifikasi ?? [],
        matkul_ganjil: parsed.matkul_ganjil ?? [],
        matkul_genap: parsed.matkul_genap ?? [],
        social_links: parsed.social_links ?? {},
      };
      setProfile(profileData);
      setEditData({
        bio: profileData.bio,
        photo: profileData.photo,
        nip: profileData.nip ?? "",
        nidn: profileData.nidn ?? "",
        prodi: profileData.prodi ?? "",
        jabatan_akademik: profileData.jabatan_akademik ?? "",
        tags: (profileData.tags || []).join(", "),
        pendidikan: arrToTextarea(profileData.pendidikan),
        sertifikasi: arrToTextarea(profileData.sertifikasi),
        matkul_ganjil: arrToTextarea(profileData.matkul_ganjil),
        matkul_genap: arrToTextarea(profileData.matkul_genap),
        linkedin: profileData.social_links?.linkedin ?? "",
        emailSocial: profileData.social_links?.email ?? "",
        scholar: profileData.social_links?.scholar ?? "",
        sinta: profileData.social_links?.sinta ?? "",
        cv: profileData.social_links?.cv ?? "",
      });
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setEditData((prev) => ({ ...prev, photo: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let latestPhoto = profile.photo;

      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const photoResponse = await fetch("http://localhost:3000/user/photo", {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          body: formData,
        });

        if (!photoResponse.ok) {
          const err = await photoResponse.text();
          console.error("photo upload failed:", err);
          alert("Gagal menyimpan foto profil.");
          return;
        }
        const photoData = await photoResponse.json();
        latestPhoto = photoData.photo;
        setProfile((p) => ({ ...p, photo: latestPhoto }));
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
        const err = await bioResponse.text();
        console.error("bio update failed:", err);
        alert("Gagal menyimpan bio.");
        return;
      }
      const bioData = await bioResponse.json();
      if (profile.role === "dosen" || profile.role === "admin") {
        const payload = {
          nip: editData.nip || undefined,
          nidn: editData.nidn || undefined,
          prodi: editData.prodi || undefined,
          jabatan_akademik: editData.jabatan_akademik || undefined,
          tags: textareaToArr(editData.tags),
          pendidikan: textareaToArr(editData.pendidikan),
          sertifikasi: textareaToArr(editData.sertifikasi),
          matkul_ganjil: textareaToArr(editData.matkul_ganjil),
          matkul_genap: textareaToArr(editData.matkul_genap),
          social_links: {
            linkedin: editData.linkedin || undefined,
            email: editData.emailSocial || undefined,
            scholar: editData.scholar || undefined,
            sinta: editData.sinta || undefined,
            cv: editData.cv || undefined,
          },
          photoUrl: latestPhoto || undefined,
        };

        const memberRes = await fetch("http://localhost:3000/member/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (!memberRes.ok) {
          const txt = await memberRes.text();
          console.error("member update failed:", txt);
          alert("Gagal menyimpan data dosen.");
          return;
        }

        const updated = await memberRes.json();
        setProfile((prev) => ({
          ...prev,
          bio: bioData.bio,
          photo: latestPhoto,
          nip: updated.nip ?? prev.nip,
          nidn: updated.nidn ?? prev.nidn,
          prodi: updated.prodi ?? prev.prodi,
          jabatan_akademik: updated.jabatan_akademik ?? prev.jabatan_akademik,
          tags: updated.tags ?? prev.tags,
          pendidikan: updated.pendidikan ?? prev.pendidikan,
          sertifikasi: updated.sertifikasi ?? prev.sertifikasi,
          matkul_ganjil: updated.matkul_ganjil ?? prev.matkul_ganjil,
          matkul_genap: updated.matkul_genap ?? prev.matkul_genap,
          social_links: { ...(prev.social_links ?? {}), ...(updated.social_links ?? {}) },
        }));
      } else {
        setProfile((prev) => ({ ...prev, bio: bioData.bio, photo: latestPhoto }));
      }

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
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Gagal menyimpan profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      bio: profile.bio,
      photo: profile.photo,
      nip: profile.nip ?? "",
      nidn: profile.nidn ?? "",
      prodi: profile.prodi ?? "",
      jabatan_akademik: profile.jabatan_akademik ?? "",
      tags: (profile.tags || []).join(", "),
      pendidikan: arrToTextarea(profile.pendidikan),
      sertifikasi: arrToTextarea(profile.sertifikasi),
      matkul_ganjil: arrToTextarea(profile.matkul_ganjil),
      matkul_genap: arrToTextarea(profile.matkul_genap),
      linkedin: profile.social_links?.linkedin ?? "",
      emailSocial: profile.social_links?.email ?? "",
      scholar: profile.social_links?.scholar ?? "",
      sinta: profile.social_links?.sinta ?? "",
      cv: profile.social_links?.cv ?? "",
    });
    setPhotoFile(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-8" style={{ backgroundImage: "url(/latar-belakang.svg)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/60 rounded-lg transition">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Profil Saya</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-32 bg-linear-to-r from-orange-400 to-orange-600" />
          <div className="px-8 pb-8">
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div className="relative">
                <img src={isEditing ? editData.photo || getPhotoUrl(profile.photo) : getPhotoUrl(profile.photo)} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600 transition shadow-lg">
                    <Camera size={20} className="text-white" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">{profile.name}</h2>
              <p className="text-gray-600">{profile.role}</p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">Email</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">No. HP</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.phone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <User size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">Nama Lengkap</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-600">Role</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.role}</p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <User size={20} className="text-orange-500" />
                  <span className="text-sm font-semibold text-gray-600">Bio</span>
                </div>

                {isEditing ? (
                  <textarea value={editData.bio} onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" placeholder="Ceritakan tentang dirimu..." />
                ) : (
                  <p className="text-gray-800 ml-6 whitespace-pre-wrap">{profile.bio}</p>
                )}
              </div>

              {(profile.role === "dosen" || profile.role === "admin") && (
                <div className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                    <h3 className="font-semibold mb-3 text-gray-700">Informasi Akademik</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                      <p><strong>NIP:</strong> {profile.nip || "-"}</p>
                      <p><strong>NIDN:</strong> {profile.nidn || "-"}</p>
                      <p><strong>Program Studi:</strong> {profile.prodi || "-"}</p>
                      <p><strong>Jabatan Akademik:</strong> {profile.jabatan_akademik || "-"}</p>
                    </div>
                    {isEditing && (
                      <div className="mt-4 space-y-3">
                        <input type="text" placeholder="NIP" value={editData.nip} onChange={(e) => setEditData((p) => ({ ...p, nip: e.target.value }))} className="w-full border border-orange-300 px-3 py-2 rounded" />
                        <input type="text" placeholder="NIDN" value={editData.nidn} onChange={(e) => setEditData((p) => ({ ...p, nidn: e.target.value }))} className="w-full border border-orange-300 px-3 py-2 rounded" />
                        <input type="text" placeholder="Program Studi" value={editData.prodi} onChange={(e) => setEditData((p) => ({ ...p, prodi: e.target.value }))} className="w-full border border-orange-300 px-3 py-2 rounded" />
                        <input type="text" placeholder="Jabatan Akademik" value={editData.jabatan_akademik} onChange={(e) => setEditData((p) => ({ ...p, jabatan_akademik: e.target.value }))} className="w-full border border-orange-300 px-3 py-2 rounded" />
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                    <h3 className="font-semibold mb-3 text-gray-700">Keahlian / Tags</h3>
                    <div className="flex flex-wrap gap-2 text-gray-800">
                      {(profile.tags || []).map((t, i) => <span key={i} className="px-3 py-1 bg-orange-100 rounded-full text-sm">{t}</span>)}
                    </div>
                    {isEditing && <textarea placeholder="Pisahkan dengan koma. Contoh: AI, ML" value={editData.tags} onChange={(e) => setEditData((p) => ({ ...p, tags: e.target.value }))} className="w-full mt-3 px-3 py-2 border border-orange-300 rounded" />}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                    <h3 className="font-semibold mb-3 text-gray-700">Pendidikan</h3>
                    <ul className="list-disc ml-6 text-gray-800">
                      {(profile.pendidikan || []).map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                    {isEditing && <textarea placeholder="Pisahkan baris per baris" value={editData.pendidikan} onChange={(e) => setEditData((p) => ({ ...p, pendidikan: e.target.value }))} className="w-full mt-3 px-3 py-2 border border-orange-300 rounded" />}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                    <h3 className="font-semibold mb-3 text-gray-700">Sertifikasi</h3>
                    <ul className="list-disc ml-6 text-gray-800">
                      {(profile.sertifikasi || []).map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                    {isEditing && <textarea placeholder="Pisahkan baris per baris" value={editData.sertifikasi} onChange={(e) => setEditData((p) => ({ ...p, sertifikasi: e.target.value }))} className="w-full mt-3 px-3 py-2 border border-orange-300 rounded" />}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                      <h3 className="font-semibold mb-3 text-gray-700">Semester Ganjil</h3>
                      <ul className="list-disc ml-6 text-gray-800">
                        {(profile.matkul_ganjil || []).map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                      {isEditing && <textarea placeholder="Pisahkan baris per baris" value={editData.matkul_ganjil} onChange={(e) => setEditData((p) => ({ ...p, matkul_ganjil: e.target.value }))} className="w-full mt-3 px-3 py-2 border border-orange-300 rounded" />}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                      <h3 className="font-semibold mb-3 text-gray-700">Semester Genap</h3>
                      <ul className="list-disc ml-6 text-gray-800">
                        {(profile.matkul_genap || []).map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                      {isEditing && <textarea placeholder="Pisahkan baris per baris" value={editData.matkul_genap} onChange={(e) => setEditData((p) => ({ ...p, matkul_genap: e.target.value }))} className="w-full mt-3 px-3 py-2 border border-orange-300 rounded" />}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3 justify-end">
                {isEditing ? (
                  <>
                    <button onClick={handleCancel} disabled={isLoading} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">Batal</button>
                    <button onClick={handleSave} disabled={isLoading} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-lg disabled:opacity-50">{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-lg">Edit Profil</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;