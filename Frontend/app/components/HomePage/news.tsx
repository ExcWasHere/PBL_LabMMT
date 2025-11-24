"use client"

import { motion } from "framer-motion"
import Card from "../../common/card"

export function HomeBerita() {
  const news = [
    {
      image: "/galeri/eventA.jpg",
      date: "10 Nov 2024",
      title: "NEWS A",
      desc: "Kegiatan pelatihan AR/VR bersama anggota lab MMT.",
      tags: ["Foto", "Animasi"],
      info: "Malang",
    },
    {
      image: "/galeri/eventB.jpg",
      date: "10 Nov 2024",
      title: "NEWS B",
      desc: "Menampilkan hasil karya mahasiswa berbasis Unity.",
      tags: ["Foto", "Animasi"],
      info: "Darjo",
    },
    {
      image: "/galeri/eventC.jpg",
      date: "10 Nov 2024",
      title: "NEWS C",
      desc: "Kegiatan kunjungan industri ke perusahaan teknologi.",
      tags: ["Foto", "Animasi"],
      info: "Blitar",
    },
  ]

  return (
    <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Berita</h2>
          <div className="w-12 h-1 bg-orange-600 mt-4"></div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12 md:mb-16">
          {news.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                image={item.image}
                date={item.date}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                info={item.info}
              />
            </motion.div>
          ))}
        </div>

        {/* See All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <a href="/news">
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-300">
              See All
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
