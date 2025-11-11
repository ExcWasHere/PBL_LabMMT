import { ExternalLink } from "lucide-react";
import { Tag, Tags } from "lucide-react";
import { Search } from "lucide-react";
import { Funnel } from "lucide-react";
import { useState } from "react";

export function Coba() {
  const projects = [
    {
      id: 1,
      title: "Project A",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/home/test2.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "Project B",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image:
        "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=500",
      link: "#",
    },
    {
      id: 3,
      title: "Project C",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/home/test2.jpg",
      link: "#",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <div className="bg-white min-h-screen">
        <main className="flex items-center justify-center py-10">
          <section id="intro">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex gap-4">
                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-full max-w-md shadow-sm mb-10">
                  <Search className="stroke-black" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-gray-700 placeholder-black"
                  />
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-45 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    defaultValue=""
                  >
                    {" "}
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="ui/ux">UI/UX</option>
                    <option value="game">Game</option>
                  </select>
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-30 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    defaultValue=""
                  >
                    {" "}
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="react">React</option>
                    <option value="tailwind">Tailwind</option>
                  </select>
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-30 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    defaultValue=""
                  >
                    {" "}
                    <option value="" disabled>
                      Year
                    </option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                <div
                  className={`flex items-center bg-[#f5ece5] rounded-lg px-2 py-1 max-w-sm shadow-sm mb-10 ${selectedOption ? "w-fit min-w-[90px]" : "w-10 justify-center"}`}
                >
                  {!selectedOption && (
                    <Funnel size={1} className="stroke-black" />
                  )}
                  <select
                    className="bg-[#f5ece5] flex-1 ml-1 text-sm focus:outline-none text-black placeholder-black cursor-pointer"
                    defaultValue=""
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    {" "}
                    <option value="" disabled></option>
                    <option value="old">Oldest</option>
                    <option value="latest">Latest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:shadow-lg hover:shadow-sky-200/30 transition-all overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
