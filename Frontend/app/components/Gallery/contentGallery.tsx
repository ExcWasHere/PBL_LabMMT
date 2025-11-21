import { Funnel, Search } from "lucide-react";
import { useState } from "react";
import Card from "../../common/card";

export function Coba() {
  const galleries = [
    {
      image: "/galeri/eventA.jpg",
      date: "10 Nov 2024",
      title: "Workshop AR/VR",
      desc: "Kegiatan pelatihan AR/VR bersama anggota lab MMT.",
      tags: ["Foto", "Animasi"],
      info: "Malang",
      photos: [
        "/galeri/eventA.jpg",
        "/galeri/eventB.jpg",
        "/galeri/eventC.jpg",
        "/home/kondisiLab.jpg",
        "/galeri/eventA.jpg",
        "/galeri/eventC.jpg",
      ],
    },
    {
      image: "/galeri/eventB.jpg",
      date: "10 Nov 2024",
      title: "Pameran Game",
      desc: "Menampilkan hasil karya mahasiswa berbasis Unity.",
      tags: ["Foto", "Animasi"],
      info: "Darjo",
      photos: ["/galeri/eventB1.jpg", "/galeri/eventB2.jpg", "/galeri/eventB3.jpg"],
    },
    {
      image: "/galeri/eventC.jpg",
      date: "10 Nov 2024",
      title: "Kunjungan Industri",
      desc: "Kegiatan kunjungan industri ke perusahaan teknologi.",
      tags: ["Foto", "Animasi"],
      info: "Blitar",
      photos: ["/galeri/eventC1.jpg", "/galeri/eventC2.jpg", "/galeri/eventC3.jpg"],
    },
  ];

  const [tags, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openPopup = (index: number) => {
    setActiveGallery(index);
    setCurrentPhotoIndex(0);
  };

  const closePopup = () => setActiveGallery(null);

  const filteredGallery = galleries
    .filter((item) => (search ? item.title.toLowerCase().includes(search.toLowerCase()) : true))
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
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-10">
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
              <div key={i} onClick={() => openPopup(i)}>
                <Card {...item} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {activeGallery !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-pointer" onClick={closePopup} />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-4 z-10">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold  transition active:scale-90 z-50"
            >
              ×
            </button>

            <div className="relative flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex((prev) =>
                    prev === 0
                      ? galleries[activeGallery].photos.length - 1
                      : prev - 1
                  );
                }}
                className="absolute left-2 md:left-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold  transition active:scale-90 z-50"
              >
                ‹
              </button>

              <img
                src={galleries[activeGallery].photos[currentPhotoIndex]}
                alt="gallery"
                className="max-h-[80vh] w-auto object-contain transition-all duration-300"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex((prev) =>
                    prev === galleries[activeGallery].photos.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-2 md:right-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold  transition active:scale-90 z-50"
              >
                ›
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-5">
              {galleries[activeGallery].photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhotoIndex(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    i === currentPhotoIndex ? "bg-orange-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
