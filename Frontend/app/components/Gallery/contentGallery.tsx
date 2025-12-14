"use client";

import {
  Search,
  Funnel,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import Card from "../../common/card";

/* ================= API ================= */
const API_BASE_URL = "http://localhost:3000";
const GALLERY_ENDPOINT = `${API_BASE_URL}/gallery/public`;

/* ================= DROPDOWN ================= */
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
        className="w-full h-12 px-4 flex items-center justify-between rounded-xl bg-[#FAF5F0] hover:bg-[#F4EBE4] transition-colors"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white rounded-xl shadow-lg border"
            style={menuStyle}
          >
            <div className="py-2 max-h-60 overflow-y-auto">
              <div
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
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
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
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

/* ================= MAIN ================= */
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

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(GALLERY_ENDPOINT);
        const data = await res.json();

        const normalized = data.map((g: any) => ({
          image: g.thumbnailUrl || "/placeholder.jpg",
          title: g.title,
          desc: g.description,
          location: g.location || "",
          rawDate: g.date || g.createdAt,
          date: new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(g.date || g.createdAt)),
          photos: [
            ...(g.photos || []).map((p: any) => ({ url: p.photoUrl, type: 'photo' })),
            ...(g.videos || []).map((v: any) => ({ url: v.videoUrl, type: 'video' })),
          ],
        }));

        setGalleries(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return galleries
      .filter((g) =>
        search ? g.title.toLowerCase().includes(search.toLowerCase()) : true
      )
      .filter((g) =>
        category ? g.location?.toLowerCase().includes(category.toLowerCase()) : true
      )
      .filter((g) => (year ? String(g.rawDate).includes(year) : true))
      .sort((a, b) => {
        if (sort === "latest")
          return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
        if (sort === "oldest")
          return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
        if (sort === "a-z") return a.title.localeCompare(b.title);
        if (sort === "z-a") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [galleries, search, category, year, sort]);

  const visible = filtered.slice(0, visibleCount);

  /* ================= UI ================= */
  return (
    <div className="bg-white min-h-screen">
      <main className="py-10">
        <section className="max-w-6xl mx-auto px-4">
          {/* SEARCH & FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center bg-[#FAF5F0] rounded-xl px-4 h-12 flex-1">
              <Search size={18} className="text-gray-400" />
              <input
                className="bg-transparent ml-3 flex-1 outline-none text-gray-700 placeholder:text-gray-400"
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
                  { value: "Gallery", label: "Gallery" },
                  { value: "Malang", label: "Malang" },
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
                placeholder="Sort"
                icon={Funnel}
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

          {/* CONTENT */}
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
                    date={g.date}
                    kategori="Gallery"
                    location={g.location}
                    title={g.title}
                    desc={g.desc}
                    tags={["Gallery"]}
                  />
                </div>
              ))}
            </div>
          )}

          {/* LOAD MORE */}
          {!loading && visibleCount < filtered.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount(v => v + CARDS_PER_LOAD)}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </section>
      </main>

      {/* POPUP */}
      {activeGallery !== null && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={() => setActiveGallery(null)}
          />
          
          <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* CLOSE BUTTON */}
            <button
              className="absolute top-4 right-4 z-50 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors"
              onClick={() => setActiveGallery(null)}
            >
              <X size={24} className="text-gray-700" />
            </button>

            {/* MEDIA CONTAINER */}
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

            {/* NAVIGATION */}
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