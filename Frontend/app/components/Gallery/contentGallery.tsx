"use client";

import { Search, Funnel, ChevronDown, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import Card from "../../common/card";

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: ElementType;
}

function CustomDropdown({ value, onChange, options, placeholder, icon: Icon }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    const handleScroll = () => isOpen && setIsOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const menuElement = document.getElementById(`dropdown-menu-${placeholder}`);
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [placeholder]);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        top: rect.bottom + 8,
        left: rect.left,
        minWidth: rect.width,
      });
    }
  }, [isOpen]);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative flex items-center justify-between w-full text-left px-3 sm:px-4 h-12 whitespace-nowrap
          bg-[#FAF5F0] hover:bg-[#F4EBE4] transition-colors rounded-xl
          text-gray-700 font-medium text-xs sm:text-sm md:text-base
          ${isOpen ? 'bg-[#F4EBE4] ring-1 ring-orange-200/50' : ''}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon size={16} className="text-gray-500 shrink-0" />} 
          
          <span className={`truncate ${value ? "text-gray-900" : "text-gray-600"}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown 
          className={`ml-1 text-gray-400 shrink-0 transition-transform duration-200 w-4 h-4 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && createPortal(
        <div 
          id={`dropdown-menu-${placeholder}`}
          className="fixed z-[9999] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top"
          style={{ 
            ...menuStyle, 
            width: "max-content", 
            maxWidth: "90vw",
            minWidth: "120px" 
          }}
        >
          <div className="py-2 max-h-60 overflow-y-auto">
            <div
              onClick={() => { onChange(""); setIsOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${value === "" ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span>All {placeholder}</span>
              {value === "" && <Check size={16} className="text-orange-500" />}
            </div>
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${value === opt.value ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check size={16} className="text-orange-500" />}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

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

  const categoryOptions = [
    { value: "Foto", label: "Foto" },
    { value: "Video", label: "Video" },
    { value: "Animasi", label: "Animasi" },
  ];

  const yearOptions = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "a-z", label: "A - Z" },
    { value: "z-a", label: "Z - A" },
  ];

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

  const openPopup = (index: number) => {
    const clickedItem = visibleGallery[index];
    const originalIndex = galleries.findIndex(g => g.title === clickedItem.title && g.date === clickedItem.date);
    if (originalIndex !== -1) {
      setActiveGallery(originalIndex);
      setCurrentPhotoIndex(0);
    }
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
        prev === 0 ? galleries[activeGallery].photos.length - 1 : prev - 1
      );
    }
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + CARDS_PER_LOAD);
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="flex items-center justify-center py-6 sm:py-10">
        <section id="gallery" className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between mb-8 z-20 relative">
            <div className="w-full md:flex-1">
              <div className="flex items-center bg-[#FAF5F0] rounded-xl px-4 h-12 border border-transparent focus-within:border-orange-200 transition-all">
                <Search size={20} className="stroke-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent flex-1 ml-3 focus:outline-none text-gray-800 placeholder-gray-400 min-w-0 h-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:flex md:gap-4">
              <div className="md:w-40">
                <CustomDropdown placeholder="Category" options={categoryOptions} value={tags} onChange={setCategory} />
              </div>
              <div className="md:w-32">
                <CustomDropdown placeholder="Year" options={yearOptions} value={year} onChange={setYear} />
              </div>
              <div className="md:w-40">
                <CustomDropdown placeholder="Sort By" icon={Funnel} options={sortOptions} value={sort} onChange={setSort} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 z-0 relative">
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
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
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

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-[60vh] md:h-[85vh] p-2 sm:p-4 z-10 flex flex-col">
            
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gray-100 hover:bg-gray-200 text-black transition active:scale-90 z-50 p-2 rounded-full shadow-sm"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="relative flex items-center justify-center flex-1 overflow-hidden rounded-lg mt-2 sm:mt-0">
              <img
                src={galleries[activeGallery].photos[currentPhotoIndex]}
                alt="gallery"
                className="max-h-full max-w-full object-contain transition-all duration-300"
              />
            </div>

            <div className="flex justify-center items-center gap-4 mt-2 sm:mt-5 pb-2 sm:pb-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="text-black hover:text-orange-500 transition active:scale-90 p-2"
                aria-label="Previous Photo"
              >
                <ChevronLeft size={28} className="sm:w-8 sm:h-8" />
              </button>

              <div className="text-lg sm:text-xl font-semibold text-gray-700">
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
                <ChevronRight size={28} className="sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}