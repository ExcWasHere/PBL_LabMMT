import Card from "../../common/card";
import { motion } from "framer-motion";
import { projects } from "~/components/Project/dataProjects";
import { Link } from "react-router-dom";

export function HomeProject() {


  const homeProjects = projects.slice(0, 3);

  return (

    <section className="bg-white text-left py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
        >
          <h2>Projects</h2>
        </motion.div>
        <div className="mt-3 sm:mt-4 mb-8 sm:mb-10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-orange-600"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {homeProjects.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              {e.title === "Project A" ? (
                <Link to="/project-detail" className="block h-full">
                  <Card {...e} />
                </Link>
              ) : (
                <div className="h-full">
                  <Card {...e} />
                </div>
              )}
            </motion.div>
          ))}
        </div>



        {/* BUTTON DI LUAR GRID */}
        <div className="flex justify-center mt-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            viewport={{ once: true }}
          >
            <a href="/project">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                See All
              </button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>



  );
}
