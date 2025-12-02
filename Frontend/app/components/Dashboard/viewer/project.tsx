import Sidebar from "~/components/Dashboard/viewer/sidebar";
import { useState, useMemo, useCallback } from "react";
import { Menu } from "lucide-react";

interface DropdownFilterProps {
  label: string;
  options: string[];
  currentFilter: string;
  onSelect: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  options,
  currentFilter,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border border-black rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-between min-w-[120px]"
      >
        {currentFilter || label}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MONTHS: { [key: string]: number } = {
  jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, des: 11
};

const parseDate = (dateStr: string): number => {
  const parts = dateStr.toLowerCase().split(" ");
  const day = parseInt(parts[0]);
  const month = MONTHS[parts[1]];
  const year = parseInt(parts[2]);
  return new Date(year, month, day).getTime();
};

const getYearFromString = (str: string): string => str.trim().split(" ").pop() || "";

const getStatusColorClass = (status: string): string => {
  switch (status) {
    case "Published":
      return "text-orange-500";
    case "Review":
      return "text-blue-500";
    case "Waiting":
      return "text-green-500";
    case "Muted":
      return "text-red-500";
    default:
      return "text-black";
  }
};

export default function ProjectPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedKategori, setSelectedKategori] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const allTableData = useMemo(
    () => [
      { title: "Proyek Redesign E-Commerce Mobile", kategori: "UI/UX", year: "12 jun 2025", publisher: "Dani Setiawan", stars: "5", status: "Published" },
      { title: "Simulasi Pelatihan VR Keselamatan Kerja", kategori: "VR", year: "22 mar 2024", publisher: "Aulia Resty Azizah", stars: "3", status: "Review" },
      { title: "Implementasi 3D Modeling di Unity", kategori: "Game", year: "18 sep 2024", publisher: "Budi Santoso", stars: "4", status: "Published" },
      { title: "Optimalisasi Performa Web dengan Next.js", kategori: "Frontend", year: "7 feb 2025", publisher: "Citra Dewi", stars: "5", status: "Published" },
      { title: "Studi Kasus Accessibility Web App", kategori: "UI/UX", year: "9 nov 2023", publisher: "Dani Setiawan", stars: "4", status: "Waiting" },
      { title: "Pengembangan Game Edukasi AR untuk Anak", kategori: "Game", year: "3 jul 2025", publisher: "Aulia Resty Azizah", stars: "5", status: "Review" },
      { title: "Migrasi Aplikasi Legacy ke Vue.js 3", kategori: "Frontend", year: "20 jan 2024", publisher: "Budi Santoso", stars: "3", status: "Muted" },
      { title: "Integrasi Sensor Fisik dengan VR Headset", kategori: "VR", year: "14 des 2025", publisher: "Citra Dewi", stars: "4", status: "Waiting" },
      { title: "Workshop Design System Menggunakan Figma", kategori: "UI/UX", year: "1 mar 2023", publisher: "Aulia Resty Azizah", stars: "5", status: "Published" },
    ],
    []
  );

  const dataWithParsedDates = useMemo(
    () => allTableData.map(item => ({
      ...item,
      timestamp: parseDate(item.year)
    })),
    [allTableData]
  );

  const stats = useMemo(() => {
    const counts = {
      Published: 0,
      Review: 0,
      Waiting: 0,
      Muted: 0,
    };

    allTableData.forEach((item) => {
      if (item.status in counts) {
        counts[item.status as keyof typeof counts]++;
      }
    });

    return [
      { label: "Published", statusKey: "Published", value: counts.Published, color: "border-orange-400 text-orange-500" },
      { label: "Review", statusKey: "Review", value: counts.Review, color: "border-blue-400 text-blue-500" },
      { label: "Wait To Publish", statusKey: "Waiting", value: counts.Waiting, color: "border-green-400 text-green-500" },
      { label: "Muted", statusKey: "Muted", value: counts.Muted, color: "border-red-400 text-red-500" },
    ];
  }, [allTableData]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = [...dataWithParsedDates];

    if (selectedKategori !== "All") {
      data = data.filter((row) => row.kategori === selectedKategori);
    }

    if (selectedYear !== "All Years") {
      data = data.filter((row) => getYearFromString(row.year) === selectedYear);
    }

    if (selectedStatus !== "All") {
      data = data.filter((row) => row.status === selectedStatus);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          row.title.toLowerCase().includes(q) ||
          row.publisher.toLowerCase().includes(q)
      );
    }

    if (selectedSort === "A-Z") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "Z-A") {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === "Newest") {
      data.sort((a, b) => b.timestamp - a.timestamp);
    } else if (selectedSort === "Oldest") {
      data.sort((a, b) => a.timestamp - b.timestamp);
    }

    return data;
  }, [dataWithParsedDates, selectedKategori, selectedYear, selectedStatus, searchTerm, selectedSort]);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div
        className={`w-full p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Project</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => setSelectedStatus(s.statusKey)}
              className={`border rounded-lg p-4 text-left transition ${s.color}`}
            >
              <p className="text-sm">{s.label}</p>
              <h2 className="text-3xl font-semibold">{s.value}</h2>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center flex-1 border border-black rounded-lg bg-white px-4 py-2">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 outline-none text-gray-700 bg-transparent"
            />
          </div>

          <DropdownFilter label="Year" options={["All Years", "2025", "2024", "2023"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
          <DropdownFilter label="Category" options={["All", "UI/UX", "Game", "Frontend", "AR", "VR"]} currentFilter={selectedKategori} onSelect={setSelectedKategori} />
          <DropdownFilter label="Sort" options={["A-Z", "Z-A", "Newest", "Oldest"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
          <DropdownFilter label="Status" options={["All", "Published", "Review", "Waiting", "Muted"]} currentFilter={selectedStatus} onSelect={setSelectedStatus} />
        </div>

        <div className="border border-black rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50">
              <tr>
                <th className="py-3">Title</th>
                <th className="py-3">Kategori</th>
                <th className="py-3">Date</th>
                <th className="py-3">Publisher</th>
                <th className="py-3">Stars</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td className={`py-3 text-center ${index !== filteredData.length - 1 ? "border-b border-gray-200" : ""}`}>{row.title}</td>
                  <td className={`py-3 text-center ${index !== filteredData.length - 1 ? "border-b border-gray-200" : ""}`}>{row.kategori}</td>
                  <td className={`py-3 text-center ${index !== filteredData.length - 1 ? "border-b border-gray-200" : ""}`}>{row.year}</td>
                  <td className={`py-3 text-center ${index !== filteredData.length - 1 ? "border-b border-gray-200" : ""}`}>{row.publisher}</td>
                  <td className={`py-3 text-center ${index !== filteredData.length - 1 ? "border-b border-gray-200" : ""}`}>{row.stars}</td>
                  <td className={`py-3 font-medium text-center ${index !== filteredData.length - 1 ? "border-b border-gray-200" : ""} ${getStatusColorClass(row.status)}`}>
                    {row.status}
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No data matches the applied filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}