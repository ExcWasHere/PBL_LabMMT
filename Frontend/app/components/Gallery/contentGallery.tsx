"use client";

import { Search, Funnel, ChevronDown, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import Card from "../../common/card";

// --- KONFIGURASI API ---
const API_BASE_URL = "http://localhost:3000"; 
const PHOTO_ENDPOINT = `${API_BASE_URL}/photo`;
const VIDEO_ENDPOINT = `${API_BASE_URL}/video`;

// --- HELPER NORMALISASI ---
const normalizeItem = (item: any, type: "photo" | "video") => ({
  id: item.id,
  type,
  title: item.title ?? "-",
  description: item.description ?? "",
  publisher: item.publisher ?? "-",
  status: item.status ?? "Review",
  category: item.category ?? "-", 
  location: item.location ?? "",
  date: item.date ?? item.createdAt ?? "",
  url: type === "photo" 
        ? (item.photoUrl || item.url) 
        : (item.videoUrl || item.url),
  thumbnail: item.thumbnailUrl || item.cover_url || (type === "photo" ? item.photoUrl : null),
  isAnimation:
    (item.photoUrl && String(item.photoUrl).toLowerCase().endsWith(".gif")) ||
    (item.category && item.category.toLowerCase() === "animation"),
  raw: item,
});


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
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [tags, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("latest"); // Default latest
  const [search, setSearch] = useState("");
  
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_LOAD); 
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resPhoto, resVideo] = await Promise.all([
          fetch(PHOTO_ENDPOINT),
          fetch(VIDEO_ENDPOINT)
        ]);
        
        const photosJson = resPhoto.ok ? await resPhoto.json() : [];
        const videosJson = resVideo.ok ? await resVideo.json() : [];

        const allItems = [
          ...(Array.isArray(photosJson) ? photosJson.map(p => normalizeItem(p, "photo")) : []),
          ...(Array.isArray(videosJson) ? videosJson.map(v => normalizeItem(v, "video")) : [])
        ];

        const publishedItems = allItems.filter(item => item.status === "Published");

        const grouped = new Map<string, any>();
        
        publishedItems.forEach(item => {
           const groupKey = (item.raw.gallery_id || item.raw.groupId) 
              ? `gid:${item.raw.gallery_id || item.raw.groupId}`
              : `${item.title.trim()}|${item.publisher.trim()}`;

           if (!grouped.has(groupKey)) {
             grouped.set(groupKey, {
               groupKey,
               title: item.title,
               desc: item.description,
               info: item.location || "",
               date: item.date, 
               tags: new Set<string>(), 
               photos: [], 
               thumbnail: item.thumbnail || item.url, 
               items: [] 
             });
           }

           const group = grouped.get(groupKey);
           
           if (item.isAnimation) group.tags.add("Animasi");
           else if (item.type === "video") group.tags.add("Video");
           else group.tags.add("Foto");

           if (!group.info && item.location) {
              group.info = item.location;
           }

           if (!group.thumbnail && item.thumbnail) group.thumbnail = item.thumbnail;

           group.items.push(item);
        });

        const finalGalleries = Array.from(grouped.values()).map(group => {
           group.items.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
           
           group.photos = group.items.map((i: any) => i.url).filter(Boolean);

           return {
             image: group.thumbnail || "/placeholder.jpg", 
             date: formatDate(group.date),
             rawDate: group.date, 
             title: group.title,
             desc: group.desc,
             tags: Array.from(group.tags), 
             info: group.info || "-",
             photos: group.photos
           };
        });

        finalGalleries.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

        setGalleries(finalGalleries);
      } catch (err) {
        console.error("Failed to fetch content gallery:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    }).format(date);
  };

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

  const filteredGallery = useMemo(() => {
    return galleries
      .filter((item) => (search ? item.title.toLowerCase().includes(search.toLowerCase()) : true))
      .filter((item) => (tags ? item.tags.includes(tags) : true))
      .filter((item) => (year ? String(item.rawDate).includes(year) : true))
      .sort((a, b) => {
        if (sort === "latest") return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
        if (sort === "oldest") return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
        if (sort === "a-z") return a.title.localeCompare(b.title);
        if (sort === "z-a") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [galleries, search, tags, year, sort]);

  const visibleGallery = filteredGallery.slice(0, visibleCount);
  const showLoadMoreButton = visibleCount < filteredGallery.length;

  const openPopup = (index: number) => {
    const clickedItem = visibleGallery[index];
    const originalIndex = filteredGallery.findIndex(g => g === clickedItem);
    if (originalIndex !== -1) {
      setActiveGallery(originalIndex);
      setCurrentPhotoIndex(0);
    }
  };

  const closePopup = () => setActiveGallery(null);

  const goToNext = () => {
    if (activeGallery !== null) {
      const photos = filteredGallery[activeGallery].photos;
      setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }
  };

  const goToPrev = () => {
    if (activeGallery !== null) {
      const photos = filteredGallery[activeGallery].photos;
      setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + CARDS_PER_LOAD);
  };

  const getPopupMedia = () => {
     if (activeGallery === null) return null;
     const url = filteredGallery[activeGallery].photos[currentPhotoIndex];
     const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);

     if (isVideo) {
         return (
             <video 
                src={url} 
                controls 
                autoPlay 
                className="max-h-full max-w-full object-contain"
             />
         );
     }
     return (
        <img
            src={url}
            alt="gallery"
            className="max-h-full max-w-full object-contain transition-all duration-300"
        />
     );
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="flex items-center justify-center py-6 sm:py-10">
        <section id="gallery" className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* SEARCH & FILTER BAR */}
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

          {isLoading ? (
             <div className="text-center py-20 text-gray-500">Loading gallery...</div>
          ) : visibleGallery.length === 0 ? (
             <div className="text-center py-20 text-gray-500">No gallery found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 z-0 relative">
                {visibleGallery.map((item, i) => (
                <div key={i} onClick={() => openPopup(i)}>
                    <Card {...item} />
                </div>
                ))}
            </div>
          )}
          
          {showLoadMoreButton && !isLoading && (
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-pointer" onClick={closePopup} />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[60vh] md:h-[85vh] p-2 sm:p-4 z-10 flex flex-col">
            
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gray-100 hover:bg-gray-200 text-black transition active:scale-90 z-50 p-2 rounded-full shadow-sm"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="relative flex items-center justify-center flex-1 overflow-hidden rounded-lg mt-2 sm:mt-0 bg-black/5">
               {getPopupMedia()}
            </div>

            {filteredGallery[activeGallery].photos.length > 1 && (
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
                    {currentPhotoIndex + 1} / {filteredGallery[activeGallery].photos.length}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}