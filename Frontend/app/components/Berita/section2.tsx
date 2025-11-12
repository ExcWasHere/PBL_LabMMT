import { Funnel, Search } from "lucide-react";
import { useState } from "react";
import Card from "../../common/card";

export default function Coba() {
  const galleries = [
    {
      image: "/galeri/eventA.jpg",
      date: "10 Nov 2024",
      title: "Workshop AR/VR",
      desc: "Kegiatan pelatihan AR/VR bersama anggota lab MMT.",
      tags: ["Foto", "Animasi"],
      info: "Malang"
    },
    {
      image: "/galeri/eventB.jpg",
      date: "10 Nov 2024",
      title: "Pameran Game",
      desc: "Menampilkan hasil karya mahasiswa berbasis Unity.",
      tags: ["Foto", "Animasi"],
      info: "Darjo"
    },
    {
      image: "/galeri/eventC.jpg",
      date: "10 Nov 2024",
      title: "Kunjungan Industri",
      desc: "Kegiatan kunjungan industri ke perusahaan teknologi.",
      tags: ["Foto", "Animasi"],
      info: "Blitar"
    },
  ];

  const [tags, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const filteredGallery = galleries
    .filter((item) =>
      search ? item.title.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((item) => (tags ? item.tags.includes(tags) : true))
    .filter((item) => (year ? item.date.includes(year) : true))
    .sort((a, b) => {
      if (sort === "latest") return b.date.localeCompare(a.date);
      if (sort === "oldest") return a.date.localeCompare(b.date);
      if (sort === "a-z") return a.title.localeCompare(b.title);
      if (sort === "z-a") return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div className="bg-white min-h-screen">
      <main className="flex items-center justify-center py-10">
        <section id="gallery" className="w-full max-w-6xl mx-auto px-6">
          
          {/* filter */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-10">
            
            {/* search bar */}
            <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 shadow-sm flex-1 min-w-[200px]">
              <Search size={18} className="stroke-black mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#f5ece5] flex-1 focus:outline-none text-black placeholder-gray-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* tags */}
            <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 shadow-sm w-auto">
              <select
                className="bg-[#f5ece5] focus:outline-none text-black cursor-pointer"
                defaultValue=""
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Foto">Foto</option>
                <option value="Video">Video</option>
                <option value="Animasi">Animasi</option>
              </select>
            </div>

            {/* date */}
            <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 shadow-sm w-auto">
              <select
                className="bg-[#f5ece5] focus:outline-none text-black cursor-pointer"
                defaultValue=""
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="" disabled>
                  Year
                </option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* sort by */}
            <div className="flex items-center bg-[#f5ece5] rounded-lg px-3 py-2 shadow-sm w-auto">
              <Funnel size={18} className="stroke-black mr-1" />
              <select
                className="bg-[#f5ece5] text-sm focus:outline-none text-black cursor-pointer"
                defaultValue=""
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="" disabled>
                  Sort by
                </option>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="a-z">A - Z</option>
                <option value="z-a">Z - A</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredGallery.map((item, i) => (
              <Card key={i} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
