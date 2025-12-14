import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import MemberCard from "../../common/memberCard";

const API_BASE_URL = "http://localhost:3000";

export function HomeMember() {
  const leader = {
    id: "1",
    image: "/member/person1.jpg",
    slug: "dimas-wahyu-wibowo-st-mt",
    name: "Dimas Wahyu Wibowo, ST., MT.",
    role: "Kepala Lab",
    tags: ["DSS", "ARVAR"],
    socials: {
      linkedin: "https://www.linkedin.com/in",
      email: "dimas@gmail.com",
      website: "https://website.com",
    },
  };

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  useEffect(() => {
  fetch(`${API_BASE_URL}/member/public/team`)
    .then((res) => res.json())
    .then((data) => {
      const lecturers = data
        .filter((m: any) =>
  ["dosen", "admin"].includes(m.role?.toLowerCase())
)
       .map((m: any) => ({
  id: m.id,
  slug: m.slug,
  image: getPhotoUrl(m.photoUrl),
  name: m.name,
  role:
    m.role === "admin"
      ? "Admin"
      : m.role === "dosen"
      ? "Dosen"
      : "Member",
  tags: m.tags ?? [],
  socials: {
    email: m.email,
    linkedin: m.social_links?.linkedin,
    website: m.social_links?.website,
  },
}));


      setTeamMembers(lecturers);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);


  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window === "undefined") return;
      setItemsPerView(window.innerWidth < 1024 ? 2 : 3);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = useMemo(() => {
    if (teamMembers.length === 0) return 0;
    return Math.max(
      0,
      Math.ceil(teamMembers.length / itemsPerView) - 1
    );
  }, [teamMembers.length, itemsPerView]);
  const safeIndex = Math.min(index, maxIndex);
  const shiftPercent = 100 / itemsPerView;
  useEffect(() => {
    if (teamMembers.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, teamMembers.length]);

  const getMemberPath = (m: { id?: string; slug?: string } | undefined) => {
    if (!m) return "/members";
    if (m.slug)
      return `/members/slug/${encodeURIComponent(String(m.slug))}`;
    return `/members/${encodeURIComponent(String(m.id ?? ""))}`;
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const getPhotoUrl = (raw?: string) => {
  if (!raw) return "/member/person1.jpg";
  if (raw.startsWith("/uploads")) {
    return `http://localhost:3000${raw}`;
  }
  return raw;
};


  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* ===== TITLE ===== */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
        >
          Team Member
        </motion.h2>

        <div className="mt-4 mb-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-orange-600"
          />
        </div>

        {/* ===== LEADER ===== */}
        <div className="flex justify-center mb-12">
          <Link to={getMemberPath(leader)} className="block max-w-sm w-full">
            <MemberCard {...leader} isLeader />
          </Link>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <p className="text-center text-gray-400 mb-6">
            Loading team member...
          </p>
        )}

        {/* ===== CAROUSEL ===== */}
        {!loading && (
          <>
            <div className="overflow-hidden w-full touch-pan-y">
              <motion.div
                animate={{ x: `-${safeIndex * shiftPercent}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold && index < maxIndex)
                    setIndex(index + 1);
                  else if (swipe > swipeConfidenceThreshold && index > 0)
                    setIndex(index - 1);
                }}
                className="flex gap-3 sm:gap-5 cursor-grab active:cursor-grabbing"
              >
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="basis-1/2 lg:basis-1/3 shrink-0"
                  >
                    <Link to={getMemberPath(member)} draggable={false}>
                      <MemberCard {...member} />
                    </Link>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ===== DOTS ===== */}
            <div className="flex justify-center gap-2 mt-8 flex-wrap">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setIndex(dotIndex)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    safeIndex === dotIndex
                      ? "bg-orange-500 w-8"
                      : "bg-gray-300 w-2.5"
                  }`}
                  aria-label={`Slide ${dotIndex + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HomeMember;