import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, GraduationCap, Globe, FileText } from "lucide-react";

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

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
  </svg>
);

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
        throw new Error("Slug parameter not found");
      }

      const response = await fetch(
        `http://localhost:3000/member/slug/${encodeURIComponent(slug)}`
      );

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Member not found (${response.status}) ${text}`);
      }

      const data = await response.json();
      setMember(data);
    } catch (err) {
      console.error("Error fetching member:", err);
      setError(err instanceof Error ? err.message : "Failed to load member data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLink = (url?: string) => {
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
    }
  };

  const commonItemStyle = 
    "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black text-xs text-black bg-white font-medium hover:bg-gray-50 transition-colors";

  const tagStyle = 
    "px-3 py-1.5 rounded-lg border border-black text-xs text-black bg-white font-medium inline-block";

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url(/latar-belakang.svg)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member data...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url(/latar-belakang.svg)" }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Member not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundImage: "url(/latar-belakang.svg)" }}
    >
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          <div className="bg-orange-500 h-32 w-full"></div>
          
          <div className="px-8 pb-8 pt-6 md:pt-10">
            <div className="flex flex-col md:flex-row-reverse gap-8 mb-8 relative z-10 md:items-end">
              
              <div className="flex-shrink-0 -mt-24 md:-mt-32">
                <img
                  src={getPhotoUrl(member.photoUrl)}
                  alt={member.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl border-[6px] border-white object-cover bg-white"
                />
              </div>

              <div className="flex-1 pb-2">
                <p className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-0">
                  {member.position || "Lab Member"}
                </p>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-2 leading-tight">
                  {member.name}
                </h1>

                {member.tags && member.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {member.tags.map((tag, idx) => (
                      <span key={idx} className={tagStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {member.social_links && (
                  <div className="flex flex-wrap gap-2">
                    {member.social_links.linkedin && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.linkedin)}
                        className={commonItemStyle}
                      >
                        <LinkedinIcon className="w-3.5 h-3.5" />
                        <span>Linkedin</span>
                      </button>
                    )}
                    {member.social_links.email && (
                      <button
                        onClick={() => handleSocialLink(`mailto:${member.social_links?.email}`)}
                        className={commonItemStyle}
                      >
                        <Mail size={14} />
                        <span>Email</span>
                      </button>
                    )}
                    {member.social_links.scholar && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.scholar)}
                        className={commonItemStyle}
                      >
                        <GraduationCap size={14} />
                        <span>Google Scholar</span>
                      </button>
                    )}
                    {member.social_links.sinta && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.sinta)}
                        className={commonItemStyle}
                      >
                        <Globe size={14} />
                        <span>Sinta</span>
                      </button>
                    )}
                    {member.social_links.cv && (
                      <button
                        onClick={() => handleSocialLink(member.social_links?.cv)}
                        className={commonItemStyle}
                      >
                        <FileText size={14} />
                        <span>CV</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
              
              <div className="lg:col-span-1 space-y-6">
                
                {(member.nip ||
                  member.nidn ||
                  member.prodi ||
                  member.jabatan_akademik) && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                      Academic Information
                    </h3>
                    <div className="space-y-4"> 
                      {member.nip && (
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">NIP</p>
                          <p className="text-gray-900 font-medium text-sm">{member.nip}</p>
                        </div>
                      )}
                      {member.nidn && (
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">NIDN</p>
                          <p className="text-gray-900 font-medium text-sm">{member.nidn}</p>
                        </div>
                      )}
                      {member.prodi && (
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Study Program</p>
                          <p className="text-gray-900 font-medium text-sm">{member.prodi}</p>
                        </div>
                      )}
                      {member.jabatan_akademik && (
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Position</p>
                          <p className="text-gray-900 font-medium text-sm">
                            {member.jabatan_akademik}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {member.sertifikasi && member.sertifikasi.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                      Certifications
                    </h3>
                    <ul className="space-y-2">
                      {member.sertifikasi.map((cert, idx) => (
                        <li
                          key={idx}
                          className="flex items-baseline gap-2 text-sm text-gray-700"
                        >
                          <span className="text-black">•</span>
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-6">
                {member.pendidikan && member.pendidikan.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                      Education
                    </h3>
                    <ul className="space-y-2">
                      {member.pendidikan.map((edu, idx) => (
                        <li
                          key={idx}
                          className="flex items-baseline gap-2 text-sm text-gray-700"
                        >
                          <span className="text-black">•</span>
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {((member.matkul_ganjil && member.matkul_ganjil.length > 0) ||
                  (member.matkul_genap && member.matkul_genap.length > 0)) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {member.matkul_ganjil && member.matkul_ganjil.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                          Odd Semester Courses
                        </h3>
                        <ul className="space-y-2">
                          {member.matkul_ganjil.map((matkul, idx) => (
                            <li
                              key={idx}
                              className="flex items-baseline gap-2 text-sm text-gray-700"
                            >
                              <span className="text-black">•</span>
                              <span>{matkul}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {member.matkul_genap && member.matkul_genap.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                          Even Semester Courses
                        </h3>
                        <ul className="space-y-2">
                          {member.matkul_genap.map((matkul, idx) => (
                            <li
                              key={idx}
                              className="flex items-baseline gap-2 text-sm text-gray-700"
                            >
                              <span className="text-black">•</span>
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