import { Funnel, Search } from "lucide-react";
import { useState } from "react";
import Card from "../../common/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS_PER_LOAD = 6;

export function ContentGallery() {
  const baseGalleries = [
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

  const galleries = [
    ...baseGalleries,
    ...baseGalleries.map(item => ({...item, title: item.title + " (Copy 1)", date: "01 Nov 2024"})),
    ...baseGalleries.map(item => ({...item, title: item.title + " (Copy 2)", date: "01 Feb 2024"})),
    ...baseGalleries.map(item => ({...item, title: item.title + " (Copy 3)", date: "01 Jan 2024"})),
  ];
  

  const [tags, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_LOAD); 

  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openPopup = (index: number) => {
    const galleryIndex = galleries.findIndex(g => g.title === filteredGallery[index].title && g.date === filteredGallery[index].date);
    setActiveGallery(galleryIndex);
    setCurrentPhotoIndex(0);
  };

  const closePopup = () => setActiveGallery(null);

  const goToNext = () => {
    if (activeGallery !== null) {
      setCurrentPhotoIndex((prev) =>
        prev === galleries[activeGallery].photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToPrev = () => {
    if (activeGallery !== null) {
      setCurrentPhotoIndex((prev) =>
        prev === 0
          ? galleries[activeGallery].photos.length - 1
          : prev - 1
      );
    }
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + CARDS_PER_LOAD);
  };

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

  const visibleGallery = filteredGallery.slice(0, visibleCount);
  
  const showLoadMoreButton = visibleCount < filteredGallery.length;

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
            {visibleGallery.map((item, i) => (
              <div key={i} onClick={() => openPopup(i)}>
                <Card {...item} />
              </div>
            ))}
          </div>
          
          {showLoadMoreButton && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-800"
              >
                Load More
              </button>
            </div>
          )}
          
        </section>
      </main>

      {activeGallery !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-pointer" onClick={closePopup} />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-[85vh] p-4 z-10 flex flex-col">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-black text-4xl font-light transition active:scale-90 z-50 p-2"
            >
              ×
            </button>

            <div className="relative flex items-center justify-center flex-1 overflow-hidden">
              <img
                src={galleries[activeGallery].photos[currentPhotoIndex]}
                alt="gallery"
                className="max-h-full max-w-full object-contain transition-all duration-300"
              />
            </div>

            <div className="flex justify-center items-center gap-4 mt-5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="text-black hover:text-orange-500 transition active:scale-90 p-2"
                aria-label="Previous Photo"
              >
                <ChevronLeft size={32} />
              </button>

              <div className="text-xl font-semibold text-gray-700">
                {currentPhotoIndex + 1} / {galleries[activeGallery].photos.length}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="text-black hover:text-orange-500 transition active:scale-90 p-2"
                aria-label="Next Photo"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}