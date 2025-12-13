import { Search, Funnel, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { ElementType } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Card from "../../common/card";
const API_BASE_URL = "http://localhost:3000";
const PUBLIC_PROJECT_ENDPOINT = `${API_BASE_URL}/project/public`;

const withBaseUrl = (url?: string) => {
  if (!url) return "/proyek/ar.jpg";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

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
        className="
          w-full h-12 px-4
          flex items-center justify-between
          rounded-xl bg-[#FAF5F0]
          text-gray-700 font-medium text-sm
          hover:bg-[#F4EBE4]
          transition
        "
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className="text-gray-500" />}
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
            className="fixed z-[9999] bg-white rounded-xl border shadow-lg"
            style={style}
          >
            <div className="py-2 max-h-60 overflow-y-auto">
              <div
                onClick={() => {
                  onChange("");
                  setOpen(false);
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
                    setOpen(false);
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

/* ================= MAIN COMPONENT ================= */
export function ContentProject() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [tech, setTech] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(6);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    fetch(PUBLIC_PROJECT_ENDPOINT)
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  /* ===== OPTIONS ===== */
  const categoryOptions = [
    { value: "UI/UX", label: "UI/UX" },
    { value: "Game", label: "Game" },
    { value: "AR/VR", label: "AR/VR" },
  ];

  const techOptions = [
    { value: "React", label: "React" },
    { value: "Tailwind", label: "Tailwind" },
    { value: "Unity", label: "Unity" },
    { value: "Figma", label: "Figma" },
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

  /* ===== FILTER ===== */
  const filtered = projects
    .filter((p) =>
      search ? p.title?.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((p) =>
      category ? p.kategori?.toLowerCase() === category.toLowerCase() : true
    )
    .filter((p) =>
      tech ? p.tech?.toLowerCase().includes(tech.toLowerCase()) : true
    )
    .filter((p) =>
      year ? new Date(p.year).getFullYear().toString() === year : true
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
        {/* SEARCH */}
        <div className="flex items-center bg-[#FAF5F0] rounded-xl px-4 h-12 mb-6">
          <Search size={20} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project..."
            className="bg-transparent flex-1 ml-3 outline-none"
          />
        </div>

        {/* FILTER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <CustomDropdown
            placeholder="Category"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
          <CustomDropdown
            placeholder="Tech"
            value={tech}
            onChange={setTech}
            options={techOptions}
          />
          <CustomDropdown
            placeholder="Year"
            value={year}
            onChange={setYear}
            options={yearOptions}
          />
          <CustomDropdown
            placeholder="Sort"
            icon={Funnel}
            value={sort}
            onChange={setSort}
            options={sortOptions}
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading Project...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No projects found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showing.map((p) => {
                console.log("PROJECT ID FROM FRONTEND:", p.id);

                return (
                  <Link key={p.id} to={`/project/slug/${slugify(p.title)}`}>
                    <Card
                      title={p.title}
                      desc={p.description}
                      image={withBaseUrl(p.thumbnailUrl)}
                      date={p.year}
                      tags={p.tech ? p.tech.split(",") : []}
                      kategori={p.kategori}
                    />
                  </Link>
                );
              })}
            </div>

            {visible < filtered.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + 6)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg"
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