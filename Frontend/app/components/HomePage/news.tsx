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
    <section className="bg-white text-left py-25 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">News</h2>
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

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <a href="/proyek">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                See All
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
