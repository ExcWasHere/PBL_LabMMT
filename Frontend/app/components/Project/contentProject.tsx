import { Search, Funnel } from "lucide-react";
import { useState } from "react";
import Card from "../../common/card";
import { Link } from "react-router-dom";
import { projects } from "~/components/Project/dataProjects";

export function ContentProject() {
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const [visible, setVisible] = useState(6);

  const filteredProject = projects
    .filter((item) =>
      search ? item.title.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((item) =>
      category ? item.info.toLowerCase() === category.toLowerCase() : true
    )
    .filter((item) => (tags ? item.tags.includes(tags) : true))
    .filter((item) => (year ? item.date.includes(year) : true))
    .sort((a, b) => {
      if (sort === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sort === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sort === "a-z") return a.title.localeCompare(b.title);
      if (sort === "z-a") return b.title.localeCompare(a.title);
      return 0;
    });

  const showingProjects = filteredProject.slice(0, visible);

  return (
    <>
      <div className="bg-white min-h-screen">
        <main className="py-10">
          <section id="intro">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center justify-between mb-8">
                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-full md:flex-1 shadow-sm">
                  <Search className="stroke-black shrink-0" size={20} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent flex-1 ml-2 focus:outline-none text-gray-700 placeholder-black min-w-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-full sm:w-auto shadow-sm">
                    <select
                      className="bg-transparent flex-1 focus:outline-none text-black placeholder-black cursor-pointer w-full sm:w-32"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Category</option>
                      <option value="ui/ux">UI/UX</option>
                      <option value="game">Game</option>
                      <option value="ar/vr">AR/VR</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-full sm:w-auto shadow-sm">
                    <select
                      className="bg-transparent flex-1 focus:outline-none text-black placeholder-black cursor-pointer w-full sm:w-28"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    >
                      <option value="">All Tech</option>
                      <option value="React">React</option>
                      <option value="Tailwind">Tailwind</option>
                      <option value="Unity">Unity</option>
                      <option value="Figma">Figma</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-full sm:w-auto shadow-sm">
                    <select
                      className="bg-transparent flex-1 focus:outline-none text-black placeholder-black cursor-pointer w-full sm:w-24"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="">All Years</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-full sm:w-auto shadow-sm">
                    {!sort && (
                      <Funnel size={18} className="stroke-black shrink-0" />
                    )}
                    <select
                      className="bg-transparent flex-1 ml-1 text-sm focus:outline-none text-black placeholder-black cursor-pointer w-full sm:w-28"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="">Sort by</option>
                      <option value="popular">Popular</option>
                      <option value="oldest">Oldest</option>
                      <option value="latest">Latest</option>
                      <option value="a-z">A - Z</option>
                      <option value="z-a">Z - A</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {showingProjects.map((e, i) =>
                    e.title === "Project A" ? (
                      <Link
                        to="/project-detail"
                        key={i}
                        className="block h-full"
                      >
                        <Card {...e} />
                      </Link>
                    ) : (
                      <div key={i} className="h-full">
                        <Card {...e} />
                      </div>
                    )
                  )}
                </div>

                {visible < filteredProject.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setVisible(visible + 6)}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
