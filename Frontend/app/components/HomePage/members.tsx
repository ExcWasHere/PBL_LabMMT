"use client";

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
      const gap = 16.5;
      setShift(width + gap);
    });

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  const next = () =>
    setIndex((prev) => (prev < teamMembers.length - 3 ? prev + 1 : 0));

  const prev = () =>
    setIndex((prev) => (prev === 0 ? teamMembers.length - 3 : prev - 1));

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight px-8">
            Anggota Tim
          </h2>
          <div className="w-12 h-1 ml-8 bg-orange-600 mt-4"></div>
        </motion.div>

        {/* LEADER */}
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

        {/* CAROUSEL */}
        <div className="flex justify-center items-center gap-[1.5px]">

          {/* PREV */}
          <motion.button
            onClick={prev}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 md:w-12 md:h-11 flex items-center justify-center text-xl font-bold transition"
          >
            ‹
          </motion.button>

          {/* TRACK VIEW */}
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

          {/* NEXT */}
          <motion.button
            onClick={next}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 md:w-12 md:h-11 flex items-center justify-center text-xl font-bold transition"
          >
            ›
          </motion.button>
        </div>

      </div>
    </section>
  );
}
