import { motion } from "framer-motion";
import Card from "../../common/memberCard";
import ProfileCard from "../../common/memberCard";

export function HomeMember() {
  const teamMembers = [
    {
      image: "/member/profileicon.jpg",
      name: "Dimas Wahyu Wibowo, ST., MT.",
      role: "Kepala Lab",
      tags: ["DSS", "ARVAR"],
      socials: {
        linkedin: "https://www.linkedin.com/in",
        email: "dimas@gmail.com",
        website: "https://website.com"
      }
    },
    {
      image: "/member/profileicon.jpg",
      name: "Anugrafi Nur Rahmanto, S.Sn., M.Ds",
      role: "Peneliti",
      tags: ["DSS", "ARVR"],
      socials: {
        linkedin: "https://www.linkedin.com/in",
        email: "anugrafi@gmail.com",
        website: "https://website.com"
      },

    },
    {
      image: "/member/profileicon.jpg",
      name: "Eka Larasati Amalia, S.ST., MT.",
      role: "Peneliti",
      tags: ["DSS", "ARVR"],
      socials: {
        linkedin: "https://www.linkedin.com/in",
        email: "eka@gmail.com",
        website: "https://website.com"
      },
    }

  ];

  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center mb-12">
          Anggota Tim
        </h2>

        {/* GRID CARD */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ProfileCard
                image={m.image}
                name={m.name}
                role={m.role}
                tags={m.tags}
                socials={m.socials}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}