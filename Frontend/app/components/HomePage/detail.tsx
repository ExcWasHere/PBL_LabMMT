import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft} from "lucide-react";

type SocialLinks = {
  linkedin?: string;
  email?: string;
  scholar?: string;
  sinta?: string;
  cv?: string;
};

type Member = {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  nip?: string;
  nidn?: string;
  prodi?: string;
  jabatan_akademik?: string;
  tags?: string[];
  pendidikan?: string[];
  sertifikasi?: string[];
  matkul_ganjil?: string[];
  matkul_genap?: string[];
  social_links?: SocialLinks;
  position?: string;
};

const MemberDetailPage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPhotoUrl = (raw?: string) => {
    if (!raw) return "../member/person1.jpg";
    if (raw.startsWith("/uploads")) {
      return `http://localhost:3000${raw}`;
    }
    return raw;
  };

  useEffect(() => {
  fetchMemberDetail();
}, [slug]);

  const fetchMemberDetail = async () => {
  try {
    setIsLoading(true);
    setError(null);

    if (!slug) {
      throw new Error("Parameter slug tidak ditemukan");
    }

    const response = await fetch(`http://localhost:3000/member/slug/${encodeURIComponent(slug)}`);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Member tidak ditemukan (${response.status}) ${text}`);
    }

    const data = await response.json();
    setMember(data);
  } catch (err) {
    console.error("Error fetching member:", err);
    setError(err instanceof Error ? err.message : "Gagal memuat data member");
  } finally {
    setIsLoading(false);
  }
};

  const handleSocialLink = (url?: string) => {
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url(/latar-belakang.svg)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data member...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url(/latar-belakang.svg)" }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Member tidak ditemukan"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundImage: "url(/latar-belakang.svg)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-32"></div>
          <div className="px-8 pb-8">
            {/* Profile Image & Name */}
            <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
              {/* DATA DIRI DI KIRI */}
              <div className="flex-1">
                <p className="text-sm text-black mb-1">{member.position || "Anggota Lab"}</p>
                <h1 className="text-3xl font-bold text-black mb-3">{member.name}</h1>
                
                {/* Tags */}
                {member.tags && member.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-1 border rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                {member.social_links && (
                  <div className="flex flex-wrap gap-3">
                    {member.social_links.linkedin && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.linkedin)}
                        className="px-4 py-1 rounded-full border text-sm"
                      >
                        Linkedin
                      </button>
                    )}
                    {member.social_links.email && (
                      <button
                        onClick={() => handleSocialLink(`mailto:${member.social_links?.email}`)}
                        className="px-4 py-1 rounded-full border text-sm"
                      >
                        Email
                      </button>
                    )}
                    {member.social_links.scholar && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.scholar)}
                        className="px-4 py-1 rounded-full border text-sm"
                      >
                        Google Scholar
                      </button>
                    )}
                    {member.social_links.sinta && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.sinta)}
                        className="px-4 py-1 rounded-full border text-sm"
                      >
                        Sinta
                      </button>
                    )}
                    {member.social_links.cv && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.cv)}
                        className="px-4 py-1 rounded-full border text-sm"
                      >
                        CV
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* FOTO DI KANAN */}
              <img
                src={getPhotoUrl(member.photoUrl)}
                alt={member.name}
                className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl object-cover"
              />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Left Column - Academic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Informasi Akademik */}
                {(member.nip || member.nidn || member.prodi || member.jabatan_akademik) && (
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">Informasi Akademik</h3>
                    <div className="space-y-3 text-sm">
                      {member.nip && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">NIP:</span>
                          <span className="text-gray-900">{member.nip}</span>
                        </div>
                      )}
                      {member.nidn && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">NIDN:</span>
                          <span className="text-gray-900">{member.nidn}</span>
                        </div>
                      )}
                      {member.prodi && (
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Program Studi:</span>
                          <span className="text-gray-900">{member.prodi}</span>
                        </div>
                      )}                   {member.jabatan_akademik && (
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Jabatan:</span>
                          <span className="text-gray-900">{member.jabatan_akademik}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sertifikasi */}
                {member.sertifikasi && member.sertifikasi.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">Sertifikasi</h3>
                    <ul className="space-y-2">
                      {member.sertifikasi.map((cert, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column - Education & Courses */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pendidikan */}
                {member.pendidikan && member.pendidikan.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">Pendidikan</h3>
                    <ul className="space-y-2">
                      {member.pendidikan.map((edu, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mata Kuliah */}
                {((member.matkul_ganjil && member.matkul_ganjil.length > 0) ||
                  (member.matkul_genap && member.matkul_genap.length > 0)) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Semester Ganjil */}
                    {member.matkul_ganjil && member.matkul_ganjil.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4 text-lg">Semester Ganjil</h3>
                        <ul className="space-y-2">
                          {member.matkul_ganjil.map((matkul, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>{matkul}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Semester Genap */}
                    {member.matkul_genap && member.matkul_genap.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4 text-lg">Semester Genap</h3>
                        <ul className="space-y-2">
                          {member.matkul_genap.map((matkul, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>{matkul}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;