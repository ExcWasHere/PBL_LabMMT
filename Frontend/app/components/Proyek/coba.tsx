import { Search } from "lucide-react";
import { Funnel } from "lucide-react";
import { useState } from "react";
import Card from "../../common/card";

export function Coba() {
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

  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <div className="bg-white min-h-screen">
        <main className="flex items-center justify-center py-10">
          <section id="intro">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex gap-4 items-center ">
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
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="ui/ux">UI/UX</option>
                    <option value="game">Game</option>
                    <option value="ar/vr">AR/VR</option>
                  </select>
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-30 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Tags
                    </option>
                    <option value="react">React</option>
                    <option value="tailwind">Tailwind</option>
                    <option value="unity">Unity</option>
                    <option value="Figma">Figma</option>
                  </select>
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-30 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Year
                    </option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                <div
                  className={`flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 max-w-sm shadow-sm mb-10 ${selectedOption ? "w-fit min-w-30" : "w-30 justify-center"}`}
                >
                  {!selectedOption && (
                    <Funnel size={20} className="stroke-black" />
                  )}
                  <select
                    className="bg-[#f5ece5] flex-1 ml-1 text-sm focus:outline-none text-black placeholder-black cursor-pointer"
                    defaultValue=""
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="" disabled>
                      Sort by
                    </option>
                    <option value="popular">Popular</option>
                    <option value="old">Oldest</option>
                    <option value="latest">Latest</option>
                    <option value="a-z">A - Z</option>
                    <option value="z-a">Z - A</option>
                  </select>
                </div>
              </div>

              <div className="min-h-screen bg-white px-6 py-4">
                <div className="grid md:grid-cols-3 gap-8">
                  {projects.map((e, i) => (
                    <Card key={i} {...e} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
