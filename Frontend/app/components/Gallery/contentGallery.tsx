"use client";

import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import Card from "../../common/card";


const API_BASE_URL = "http://localhost:3000";
const GALLERY_ENDPOINT = `${API_BASE_URL}/gallery/public`;


interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: ElementType;
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    const handleScroll = () => isOpen && setIsOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-12 px-4 flex items-center justify-between 
          rounded-xl bg-white border transition-all duration-200
          ${isOpen ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-300 hover:border-gray-400"}
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={18} className="text-gray-500" />}
          <span className={`text-sm font-medium ${value ? "text-gray-900" : "text-gray-500"}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden mt-1"
            style={menuStyle}
          >
            <div className="py-1 max-h-60 overflow-y-auto">
              <div
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 text-sm text-gray-600 cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                All {placeholder}
              </div>
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer transition-colors
                    ${value === opt.value ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                  `}
                >
                  {opt.label}
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
  const [loading, setLoading] = useState(true);

  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("latest");

  const [visibleCount, setVisibleCount] = useState(CARDS_PER_LOAD);
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);


  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(GALLERY_ENDPOINT);
        const data = await res.json();

        const normalized = data.map((g: any) => {
          const dbTags = g.media_types || g.mediaTypes || [];
          let finalImage = g.thumbnailUrl || g.thumbnail_url;

          if (!finalImage) {
             const photoList = g.photos || g.Photos || [];
             if (photoList.length > 0) {
                 finalImage = photoList[0].photoUrl || photoList[0].url;
             }
          }

          finalImage = finalImage;

          return {
            image: g.thumbnailUrl || "/placeholder.jpg",
            title: g.title,
            desc: g.description,
            location: g.location || "",
            
           
            rawDate: g.date || g.createdAt,
            
            tags: Array.isArray(dbTags) ? dbTags : [], 

            dateFormatted: new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(g.date || g.createdAt)),
            
            photos: [
              ...(g.photos || []).map((p: any) => ({ url: p.photoUrl, type: 'photo' })),
              ...(g.videos || []).map((v: any) => ({ url: v.videoUrl, type: 'video' })),
            ],
          };
        });

        setGalleries(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filtered = useMemo(() => {
    return galleries
      .filter((g) =>
        search ? g.title?.toLowerCase().includes(search.toLowerCase()) : true
      )
   
      .filter((g) => {
        if (!category) return true; 
        if (g.tags && Array.isArray(g.tags)) {
            return g.tags.some((t: string) => t.toLowerCase() === category.toLowerCase());
        }
        return g.kategori?.toLowerCase() === category.toLowerCase();
      })
      
      .filter((g) => {
        if (!year) return true; 
        const d = new Date(g.rawDate);
        if (isNaN(d.getTime())) return false; 
        return d.getFullYear().toString() === year;
      })
     
      .sort((a, b) => {
        const timeA = new Date(a.rawDate).getTime() || 0;
        const timeB = new Date(b.rawDate).getTime() || 0;
        
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();

        if (sort === "latest") return timeB - timeA;
        if (sort === "oldest") return timeA - timeB;
        if (sort === "a-z") return titleA.localeCompare(titleB);
        if (sort === "z-a") return titleB.localeCompare(titleA);
        return 0;
      });
  }, [galleries, search, category, year, sort]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="bg-white min-h-screen">
      <main className="py-10">
        <section className="max-w-6xl mx-auto px-4">

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 h-12 flex-1 hover:border-gray-400 transition-colors focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
              <Search size={18} className="text-gray-400" />
              <input
                className="bg-transparent ml-3 flex-1 outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <CustomDropdown
                placeholder="Category"
                value={category}
                onChange={setCategory}
                options={[
                  { value: "Photo", label: "Photo" },
                  { value: "Video", label: "Video" },
                  { value: "Animation", label: "Animation" },
                ]}
              />
              <CustomDropdown
                placeholder="Year"
                value={year}
                onChange={setYear}
                options={[
                  { value: "2023", label: "2023" },
                  { value: "2024", label: "2024" },
                  { value: "2025", label: "2025" },
                ]}
              />
              <CustomDropdown
                placeholder="Sort by"
                value={sort}
                onChange={setSort}
                options={[
                  { value: "latest", label: "Latest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "a-z", label: "A - Z" },
                  { value: "z-a", label: "Z - A" },
                ]}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">
              Loading gallery...
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No gallery found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((g, i) => (
                <div key={i} onClick={() => { setActiveGallery(i); setPhotoIndex(0); }}>
                  <Card
                    image={g.image}
                    date={g.dateFormatted}
                    location={g.location}
                    title={g.title}
                    desc={g.desc}
                    tags={g.tags}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && visibleCount < filtered.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount(v => v + CARDS_PER_LOAD)}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors font-medium"
              >
                Load More
              </button>
            </div>
          )}
        </section>
      </main>

      {activeGallery !== null && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={() => setActiveGallery(null)}
          />
          
          <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            <button
              className="absolute top-4 right-4 z-50 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors"
              onClick={() => setActiveGallery(null)}
            >
              <X size={24} className="text-gray-700" />
            </button>

            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
              {filtered[activeGallery].photos.length > 0 && (
                (() => {
                  const media = filtered[activeGallery].photos[photoIndex];
                  const isVideo = media.type === 'video' || media.url?.toLowerCase().match(/\.(mp4|webm|mov)$/);
                  
                  return isVideo ? (
                    <video 
                      src={media.url} 
                      controls 
                      className="max-h-full max-w-full rounded-lg"
                      key={media.url}
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt="preview"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  );
                })()
              )}
            </div>

            {filtered[activeGallery].photos.length > 1 && (
              <div className="flex items-center justify-center gap-6 pb-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex((p) =>
                      p === 0 ? filtered[activeGallery].photos.length - 1 : p - 1
                    );
                  }}
                  className="p-3 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors shadow-md"
                >
                  <ChevronLeft size={24} className="text-orange-600" />
                </button>
                
                <div className="px-4 py-2 bg-gray-100 rounded-full">
                  <span className="text-lg font-semibold text-gray-700">
                    {photoIndex + 1} / {filtered[activeGallery].photos.length}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex((p) =>
                      p === filtered[activeGallery].photos.length - 1 ? 0 : p + 1
                    );
                  }}
                  className="p-3 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors shadow-md"
                >
                  <ChevronRight size={24} className="text-orange-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}