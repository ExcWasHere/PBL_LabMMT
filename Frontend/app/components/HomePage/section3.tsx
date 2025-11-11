import Card from "../../common/card";

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
        <section className="bg-white py-7 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center mb-12">
                    Project
                </h2>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {projects.map((project) => (
                        <Card 
                            image={project.image}
                            date={project.date}
                            title={project.title}
                            desc={project.desc}
                            tags={project.tags}
                            info={project.info}
                        />
                    ))}
                </div>

                <div className="text-center ">
                    <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                    See All
                    </button>
                </div>
            </div>
        </section>
    );
}

