"use client"
import Card from "../../common/card"
import { motion } from "framer-motion"

export function HomeProject() {
  const projects = [
    {
      image: "/proyek/test2.jpg",
      date: "11 Nov 2025",
      title: "Project A",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      tags: ["Tailwind"],
      info: "Game",
    },
    {
      image: "/proyek/test2.jpg",
      date: "11 Nov 2025",
      title: "Project B",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      tags: ["Tailwind", "React"],
      info: "UI / UX",
    },
    {
      image: "/proyek/test2.jpg",
      date: "11 Nov 2025",
      title: "Project C",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      tags: ["Tailwind", "Javascript"],
      info: "AR / VR",
    },
  ]

  return (
    <section className="bg-white text-left py-5 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Projects</h2>
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
     

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                image={project.image}
                date={project.date}
                title={project.title}
                desc={project.desc}
                tags={project.tags}
                info={project.info}
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
