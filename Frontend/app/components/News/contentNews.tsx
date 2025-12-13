"use client";

import { Search, Funnel, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import Card from "../../common/card";
import { news } from "./dataNews";

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
          relative flex items-center justify-between w-full text-left px-4 h-12 whitespace-nowrap
          bg-[#FAF5F0] hover:bg-[#F4EBE4] transition-colors rounded-xl
          text-gray-700 font-medium text-sm sm:text-base
          ${isOpen ? 'bg-[#F4EBE4] ring-1 ring-orange-200/50' : ''}
        `}
      >
       
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon size={18} className="text-gray-500 shrink-0" />}
          <span className={`truncate ${value ? "text-gray-900" : "text-gray-600"}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`ml-2 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && createPortal(
        <div 
          id={`dropdown-menu-${placeholder}`}
          className="fixed z-[9999] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top"
          style={{ 
            ...menuStyle, 
            width: "max-content", 
            maxWidth: "90vw" 
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

export default function ContentNews() {
  const [category, setCategory] = useState(""); 
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(6);

  const categoryOptions = [
    { value: "News", label: "News" },
    { value: "Workshop", label: "Workshop" },
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

  const filteredGallery = news
    .filter((item) =>
      search ? item.title.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((item) => (category ? item.tags.includes(category) : true))
    .filter((item) => (year ? item.date.includes(year) : true))
    .sort((a, b) => {
      if (sort === "latest") return b.date.localeCompare(a.date);
      if (sort === "oldest") return a.date.localeCompare(b.date);
      if (sort === "a-z") return a.title.localeCompare(b.title);
      if (sort === "z-a") return b.title.localeCompare(a.title);
      return 0;
    });

  const showing = filteredGallery.slice(0, visible);

  return (
    <div className="bg-white min-h-screen">
      <main className="flex items-center justify-center py-6 sm:py-10">
        <section id="gallery" className="w-full max-w-6xl mx-auto px-4 sm:px-6">

          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center justify-between mb-8 z-20 relative">


            <div className="flex items-center bg-[#FAF5F0] rounded-xl px-4 h-12 w-full md:flex-1 md:h-12 border border-transparent focus-within:border-orange-200 transition-all">
              <Search size={20} className="stroke-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent flex-1 ml-3 focus:outline-none text-gray-800 placeholder-gray-400 min-w-0 h-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="block md:hidden w-full">
              <div className="flex flex-row gap-3 overflow-x-auto -mx-4 px-4 pb-2 no-scrollbar">
                <div className="min-w-[140px] flex-shrink-0">
                  <CustomDropdown placeholder="Category" options={categoryOptions} value={category} onChange={setCategory} />
                </div>
                <div className="min-w-[120px] flex-shrink-0">
                  <CustomDropdown placeholder="Year" options={yearOptions} value={year} onChange={setYear} />
                </div>
                <div className="min-w-[140px] flex-shrink-0">
                  <CustomDropdown placeholder="Sort By" icon={Funnel} options={sortOptions} value={sort} onChange={setSort} />
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-row gap-4 w-auto">
              <div className="w-40">
                <CustomDropdown placeholder="Category" options={categoryOptions} value={category} onChange={setCategory} />
              </div>
              <div className="w-32">
                <CustomDropdown placeholder="Year" options={yearOptions} value={year} onChange={setYear} />
              </div>
              <div className="w-40">
                <CustomDropdown placeholder="Sort By" icon={Funnel} options={sortOptions} value={sort} onChange={setSort} />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 z-0 relative">
            {showing.map((item, i) => (
              <Card
                key={i}
                {...item}
                onClick={() => (window.location.href = "/news-detail")}
              />
            ))}
          </div>

          {visible < filteredGallery.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisible(visible + 6)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
              >
                Load More
              </button>
            </div>
          )}

        </section>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}