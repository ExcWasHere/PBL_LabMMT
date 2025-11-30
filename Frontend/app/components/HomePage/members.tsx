import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import MemberCard from "../../common/memberCard";

export function HomeMember() {
  const leader = {
    image: "/member/person1.jpg",
    name: "Dimas Wahyu Wibowo, ST., MT.",
    role: "Kepala Lab",
    tags: ["DSS", "ARVAR"],
    socials: {
      linkedin: "https://www.linkedin.com/in",
      email: "dimas@gmail.com",
      website: "https://website.com",
    },
  };

  const teamMembers = [
    { image: "/member/person1.jpg", name: "Anugrafi Nur Rahmanto, S.Sn., M.Ds", role: "Peneliti", tags: ["DSS", "ARVR"], socials: { linkedin: "https://www.linkedin.com/in", email: "anugrafi@gmail.com", website: "https://website.com" } },
    { image: "/member/person1.jpg", name: "Eka Larasati Amalia, S.ST., MT.", role: "Peneliti", tags: ["DSS", "ARVR"], socials: { linkedin: "https://www.linkedin.com/in", email: "eka@gmail.com", website: "https://website.com" } },
    { image: "/member/person1.jpg", name: "Budi Santoso, S.Kom., M.IT", role: "Peneliti", tags: ["AI", "ML"], socials: { linkedin: "https://www.linkedin.com/in", email: "budi@gmail.com", website: "https://website.com" } },
    { image: "/member/person1.jpg", name: "Siti Nurhaliza, S.Kom.", role: "Junior Researcher", tags: ["Web", "Mobile"], socials: { linkedin: "https://www.linkedin.com/in", email: "siti@gmail.com", website: "https://website.com" } },
    { image: "/member/person1.jpg", name: "Ahmad Ridho, S.ST.", role: "Junior Researcher", tags: ["AR", "VR"], socials: { linkedin: "https://www.linkedin.com/in", email: "ahmad@gmail.com", website: "https://website.com" } },
    { image: "/member/person1.jpg", name: "Rina Wulandari, S.Ds., M.Des", role: "Designer", tags: ["UI/UX", "Graphic"], socials: { linkedin: "https://www.linkedin.com/in", email: "rina@gmail.com", website: "https://website.com" } },
    { image: "/member/person1.jpg", name: "Dewi Rahayu, S.Kom., M.Tech", role: "Data Analyst", tags: ["Analytics", "Data Science"], socials: { linkedin: "https://www.linkedin.com/in", email: "dewi@gmail.com", website: "https://website.com" } },
  ];

  const [index, setIndex] = useState(0);
  const [shift, setShift] = useState(0);

  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
  if (!cardRef.current) return;

  const observer = new ResizeObserver((entries) => {
    const width = entries[0].contentRect.width;
    setShift(width);
  });

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white text-left py-15 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Team Member</h2>
        </motion.div>
        <div className="mt-4 mb-10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-orange-600"
          />
        </div>

        <div className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full max-w-xs"
          >
            <MemberCard {...leader} isLeader />
          </motion.div>
        </div>


        <div className="overflow-hidden w-full">
          <motion.div
            animate={{ x: -(index * shift) }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="flex gap-[16.5px]"
          >
            {teamMembers.map((member, i) => (
              <div
                key={i}
                ref={i === 0 ? cardRef : null}
                className="min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)]"
              >
                <MemberCard {...member} />
              </div>
            ))}
          </motion.div>

        </div>
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(teamMembers.length / 3) }).map(
            (_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setIndex(dotIndex)}
                className={`w-3 h-3 rounded-full transition-all ${index === dotIndex ? "bg-orange-500 w-6" : "bg-gray-300"
                  }`}
              />
            )
          )}
        </div>
      </div>
    </section >
  );
}