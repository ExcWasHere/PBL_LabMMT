import { Search, Funnel, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Card from "../../common/card";

/* ================= API ================= */
const API_BASE_URL = "http://localhost:3000";
const PUBLIC_NEWS_ENDPOINT = `${API_BASE_URL}/news/public`;

/* ================= SLUG ================= */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

/* ================= DROPDOWN ================= */
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: ElementType;
}

/* ⛔ UI DROPDOWN TIDAK DIUBAH */
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
    function handleClickOutside(e: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
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
        className="
          relative flex items-center justify-between
          w-full px-4 h-12
          bg-[#FAF5F0] hover:bg-[#F4EBE4]
          rounded-xl text-gray-700 text-sm font-medium
        "
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span>{selectedLabel}</span>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white rounded-xl border shadow-lg"
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
export default function ContentNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(6);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    fetch(PUBLIC_NEWS_ENDPOINT)
      .then((res) => res.json())
      .then((data) => setNews(Array.isArray(data) ? data : []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  /* ===== OPTIONS ===== */
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

  /* ===== FILTER (POLA SAMA CONTENTPROJECT) ===== */
  const filtered = news
    .filter((n) =>
      search ? n.title?.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((n) =>
      category ? n.kategori?.toLowerCase() === category.toLowerCase() : true
    )
    .filter((n) =>
      year
        ? new Date(n.year || n.createdAt)
            .getFullYear()
            .toString() === year
        : true
    )
    .sort((a, b) => {
      if (sort === "latest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "oldest")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "a-z") return a.title.localeCompare(b.title);
      if (sort === "z-a") return b.title.localeCompare(a.title);
      return 0;
    });

  const showing = filtered.slice(0, visible);

  /* ===== RENDER ===== */
  return (
    <div className="bg-white min-h-screen">
      <main className="flex justify-center py-10">
        <section className="w-full max-w-6xl px-4">

          {/* SEARCH */}
          <div className="flex items-center bg-[#FAF5F0] rounded-xl px-4 h-12 mb-6">
            <Search size={20} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent flex-1 ml-3 outline-none"
            />
          </div>

          {/* FILTER */}
          <div className="flex gap-3 mb-8">
            <CustomDropdown
              placeholder="Category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
            />
            <CustomDropdown
              placeholder="Year"
              value={year}
              onChange={setYear}
              options={yearOptions}
            />
            <CustomDropdown
              placeholder="Sort By"
              icon={Funnel}
              value={sort}
              onChange={setSort}
              options={sortOptions}
            />
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">
              Loading news...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No news found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {showing.map((n) => (
                  <Link
                    key={n.id}
                    to={`/news/slug/${slugify(n.title)}`}
                  >
                    <Card
                      image={n.imageUrl || "/galeri/eventA.jpg"}
                      title={n.title}
                      desc={n.content}
                      date={n.year || n.createdAt}
                      kategori={n.kategori}
                      location={n.location}
                      tags={
                        Array.isArray(n.tags)
                          ? n.tags
                          : n.kategori
                          ? [n.kategori]
                          : []
                      }
                    />
                  </Link>
                ))}
              </div>

              {visible < filtered.length && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisible((v) => v + 6)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
