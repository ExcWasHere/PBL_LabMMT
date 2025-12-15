import { Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Card from "../../common/card";

/* ================= API ================= */
const API_BASE_URL = "http://localhost:3000";
const PUBLIC_NEWS_ENDPOINT = `${API_BASE_URL}/news/public`;

/* ================= UTILS ================= */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

/* ================= DROPDOWN (NEW DESIGN) ================= */
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: ElementType;
  className?: string;
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  className = "",
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [style, setStyle] = useState({});

  useLayoutEffect(() => {
    if (open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setStyle({
        top: r.bottom + 8,
        left: r.left,
        minWidth: r.width,
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={ref}
        onClick={() => setOpen(!open)}
        className={`
          h-10 px-4 
          flex items-center justify-between gap-3
          rounded-lg border border-gray-300 bg-white
          text-gray-500 text-sm hover:border-gray-400
          transition whitespace-nowrap
          ${className}
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className="text-gray-400" />}
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {options.find((o) => o.value === value)?.label || placeholder}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white rounded-lg border border-gray-200 shadow-lg py-1"
            style={style}
          >
            <div className="max-h-60 overflow-y-auto">
              <div
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
              >
                All {placeholder}
              </div>

              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
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

/* ================= MAIN COMPONENT ================= */
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
      .then((data) => {
        if (Array.isArray(data)) {
          // Normalize & Format Date
          const normalized = data.map((n: any) => ({
            ...n,
            formattedDate: new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(n.year || n.createdAt)),
          }));
          setNews(normalized);
        } else {
          setNews([]);
        }
      })
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

  /* ===== FILTER & SORT ===== */
  const filtered = news
    .filter((n) =>
      search ? n.title?.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((n) =>
      category ? n.kategori?.toLowerCase() === category.toLowerCase() : true
    )
    .filter((n) =>
      year
        ? new Date(n.year || n.createdAt).getFullYear().toString() === year
        : true
    )
    .sort((a, b) => {
      if (sort === "latest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sort === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sort === "a-z") return a.title.localeCompare(b.title);
      if (sort === "z-a") return b.title.localeCompare(a.title);
      return 0;
    });

  const showing = filtered.slice(0, visible);

  /* ===== RENDER ===== */
  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news..."
              className="
                w-full h-10 pl-10 pr-4 
                rounded-lg border border-gray-300 bg-white 
                text-sm text-gray-700 placeholder:text-gray-500
                focus:outline-none focus:border-gray-400
                transition
              "
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <CustomDropdown
              placeholder="Category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              className="min-w-[120px]"
            />
            <CustomDropdown
              placeholder="Year"
              value={year}
              onChange={setYear}
              options={yearOptions}
              className="min-w-[100px]"
            />
            <CustomDropdown
              placeholder="Sort By"
              value={sort}
              onChange={setSort}
              options={sortOptions}
              className="min-w-[110px]"
            />
          </div>
        </div>

        {/* CONTENT LIST */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading news...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No news found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showing.map((n) => (
                <Link key={n.id} to={`/news/slug/${slugify(n.title)}`}>
                  <Card
                    image={n.imageUrl || "/galeri/eventA.jpg"}
                    title={n.title}
                    desc={n.content}
                    date={n.formattedDate}
                    location={n.location}
                    kategori={undefined}
                    tags={n.kategori ? [n.kategori] : []}
                  />
                </Link>
              ))}
            </div>

            {visible < filtered.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + 6)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}