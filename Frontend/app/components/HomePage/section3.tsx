import Card from "../../common/card";
import { motion } from "framer-motion";

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
    ];

    return (
        <section className="bg-white ">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center mb-12">
                    Project
                </h2>


                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {projects.map((project) => (
                        <motion.div
                            initial={{ rotateY: 90, opacity: 0 }}
                            whileInView={{ rotateY: 0, opacity: 1 }}
                            transition={{ duration: 0.8, }}
                            viewport={{ once: true }}
                            style={{
                                transformStyle: "preserve-3d",
                                perspective: "1000px",
                            }}
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
                    transition={{ duration: 0.2 }}
                >
                    <div className="text-center">
                        <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                            See All
                        </button>

                    </div>
                </motion.div>
            </div>
        </section>

    );
}

