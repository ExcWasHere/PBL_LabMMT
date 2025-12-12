import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"
import MemberCard from "../../common/memberCard";
import type { PanInfo } from "framer-motion";

export function HomeMember() {
  const leader = {
    id : 1,
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
    { id : 2,image: "/member/person1.jpg", name: "Anugrafi Nur Rahmanto, S.Sn., M.Ds", role: "Peneliti", tags: ["DSS", "ARVR"], socials: { linkedin: "https://www.linkedin.com/in", email: "anugrafi@gmail.com", website: "https://website.com" } },
    { id : 3,image: "/member/person1.jpg", name: "Eka Larasati Amalia, S.ST., MT.", role: "Peneliti", tags: ["DSS", "ARVR"], socials: { linkedin: "https://www.linkedin.com/in", email: "eka@gmail.com", website: "https://website.com" } },
    { id : 4,image: "/member/person1.jpg", name: "Budi Santoso, S.Kom., M.IT", role: "Peneliti", tags: ["AI", "ML"], socials: { linkedin: "https://www.linkedin.com/in", email: "budi@gmail.com", website: "https://website.com" } },
    { id : 5,image: "/member/person1.jpg", name: "Siti Nurhaliza, S.Kom.", role: "Junior Researcher", tags: ["Web", "Mobile"], socials: { linkedin: "https://www.linkedin.com/in", email: "siti@gmail.com", website: "https://website.com" } },
    { id : 6,image: "/member/person1.jpg", name: "Ahmad Ridho, S.ST.", role: "Junior Researcher", tags: ["AR", "VR"], socials: { linkedin: "https://www.linkedin.com/in", email: "ahmad@gmail.com", website: "https://website.com" } },
    { id : 7,image: "/member/person1.jpg", name: "Rina Wulandari, S.Ds., M.Des", role: "Designer", tags: ["UI/UX", "Graphic"], socials: { linkedin: "https://www.linkedin.com/in", email: "rina@gmail.com", website: "https://website.com" } },
    { id : 8,image: "/member/person1.jpg", name: "Dewi Rahayu, S.Kom., M.Tech", role: "Data Analyst", tags: ["Analytics", "Data Science"], socials: { linkedin: "https://www.linkedin.com/in", email: "dewi@gmail.com", website: "https://website.com" } },
  ];

  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number): number => {
    return Math.abs(offset) * velocity;
  };

  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w < 768) setItemsPerView(2);
      else if (w < 1280) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, Math.ceil(teamMembers.length / itemsPerView) - 1),
    [teamMembers.length, itemsPerView]
  );

  const safeIndex = Math.min(index, maxIndex);
  const shiftPercent = 100 / itemsPerView;

  const paginate = (newDirection: number) => {
    setIndex(prev => Math.min(maxIndex, Math.max(0, prev + newDirection)));
  };

  type DragEvent = MouseEvent | TouchEvent | PointerEvent;

  const onDragEnd = (
    event: DragEvent | null,
    info: PanInfo
  ) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    <section className="bg-white text-left py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
        >
          <h2>Team Member</h2>
        </motion.div>
        <div className="mt-3 sm:mt-4 mb-8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-orange-600"
          />
        </div>

        {/* Leader */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <Link to={`/members/${leader.id}`} className="block">
              <MemberCard {...leader} isLeader />
            </Link>
          </motion.div>
        </div>
        

        {/* Slider */}
        <div className="overflow-hidden w-full">
          <motion.div
            drag="x"
            dragConstraints={{ left: -1, right: 1 }}
            onDragEnd={onDragEnd}
            style={{ cursor: "grab" }}
            whileTap={{ cursor: "grabbing" }}
            animate={{ x: `-${safeIndex * shiftPercent}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex gap-4 sm:gap-5 items-stretch"
          >
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="basis-1/2 md:basis-1/3 xl:basis-1/4 shrink-0 h-full"
              >
                <Link to={`/members/${member.id}`} className="block">
                  <MemberCard {...member} />
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setIndex(dotIndex)}
              className={`h-2.5 rounded-full transition-all ${
                safeIndex === dotIndex
                  ? "bg-orange-500 w-6"
                  : "bg-gray-300 w-2.5"
              }`}
              aria-label={`Slide ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default HomeMember;