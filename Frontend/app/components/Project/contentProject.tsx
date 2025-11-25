import { Search } from "lucide-react";
import { Funnel } from "lucide-react";
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

  // card
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

  // card
  const showingProjects = filteredProject.slice(0, visible);

  return (
    <>
      <div className="bg-white min-h-screen">
        <main className="py-10">
          <section id="intro">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex gap-4 items-center ml-5">
                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-full max-w-md shadow-sm mb-10">
                  <Search className="stroke-black" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-gray-700 placeholder-black"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-45 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="ui/ux">UI/UX</option>
                    <option value="game">Game</option>
                    <option value="ar/vr">AR/VR</option>
                  </select>
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-30 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  >
                    <option value="">Tags</option>
                    <option value="React">React</option>
                    <option value="Tailwind">Tailwind</option>
                    <option value="Unity">Unity</option>
                    <option value="Figma">Figma</option>
                  </select>
                </div>

                <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 w-30 max-w-sm shadow-sm mb-10">
                  <select
                    className="bg-[#f5ece5] flex-1 ml-2 focus:outline-none text-black placeholder-black cursor-pointer"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="">Year</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                <div
                  className={`flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 max-w-sm shadow-sm mb-10 ${sort ? "w-fit min-w-30" : "w-30 justify-center"}`}
                >
                  {!sort && <Funnel size={20} className="stroke-black" />}
                  <select
                    className="bg-[#f5ece5] flex-1 ml-1 text-sm focus:outline-none text-black placeholder-black cursor-pointer"
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

              <div className="bg-white px-6 py-4">
                <div className="grid md:grid-cols-3 gap-8">
                  {showingProjects.map((e, i) =>
                    e.title === "Project A" ? (
                      <Link to="/project-detail" key={i}>
                        <Card {...e} />
                      </Link>
                    ) : (
                      <Card key={i} {...e} />
                    )
                  )}
                </div>

                {/* load more button */}
                {visible < filteredProject.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setVisible(visible + 6)}
                      className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-800"
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
