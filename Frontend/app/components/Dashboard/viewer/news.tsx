import Sidebar from "~/components/Dashboard/viewer/sidebar";
import { useState, useMemo, useEffect, useCallback } from "react";
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
        className="border border-orange-500 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center justify-between min-w-[120px]"
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
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mei: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  okt: 9,
  nov: 10,
  des: 11,
};

const parseDate = (dateStr: string): number => {
  const parts = dateStr.toLowerCase().split(" ");
  const day = parseInt(parts[0]);
  const month = MONTHS[parts[1]];
  const year = parseInt(parts[2]);
  return new Date(year, month, day).getTime();
};

const getYearFromString = (dateString: string) => {
  const parts = dateString.trim().split(" ");
  return parts[parts.length - 1];
};

const getStatusColorClass = (status: string) => {
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

const formatDateForViewer = (raw: string | Date): string => {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate();
  const year = d.getFullYear();
  const monthIndex = d.getMonth();
  const monthLabels = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mei",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ];

  return `${day} ${monthLabels[monthIndex]} ${year}`;
};

interface NewsRow {
  id?: string;
  title: string;
  kategori: string;
  year: string;
  publisher: string;
  status: string;
}

export default function NewsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedKategori, setSelectedKategori] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [allTableData, setAllTableData] = useState<NewsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:3000/news");
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await res.json();
        const mapped: NewsRow[] = (Array.isArray(data) ? data : []).map(
          (n: any) => ({
            id: n.id,
            title: n.title ?? "-",
            kategori: n.kategori ?? "-",
            year: n.year ? formatDateForViewer(n.year) : "",
            publisher: n.publisher ?? "-",
            status: n.status ?? "Waiting",
          })
        );

        setAllTableData(mapped);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data news.");
        setAllTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

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
      {
        label: "Published",
        statusKey: "Published",
        value: counts.Published,
        color: "border-orange-400 text-orange-500",
      },
      {
        label: "Review",
        statusKey: "Review",
        value: counts.Review,
        color: "border-blue-400 text-blue-500",
      },
      {
        label: "Wait To Publish",
        statusKey: "Waiting",
        value: counts.Waiting,
        color: "border-green-400 text-green-500",
      },
      {
        label: "Muted",
        statusKey: "Muted",
        value: counts.Muted,
        color: "border-red-400 text-red-500",
      },
    ];
  }, [allTableData]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const filteredData = useMemo(() => {
    let data = [...allTableData];

    if (selectedKategori !== "All") {
      data = data.filter((row) => row.kategori === selectedKategori);
    }
    if (selectedYear !== "All Years") {
      data = data.filter(
        (row) => getYearFromString(row.year) === selectedYear
      );
    }
    if (selectedStatus !== "All") {
      data = data.filter((row) => row.status === selectedStatus);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          row.title.toLowerCase().includes(lower) ||
          row.publisher.toLowerCase().includes(lower)
      );
    }

    if (selectedSort === "A-Z") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "Z-A") {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === "Newest") {
      data.sort((a, b) => parseDate(b.year) - parseDate(a.year));
    } else if (selectedSort === "Oldest") {
      data.sort((a, b) => parseDate(a.year) - parseDate(b.year));
    }

    return data;
  }, [
    allTableData,
    selectedYear,
    selectedKategori,
    selectedStatus,
    searchTerm,
    selectedSort,
  ]);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div
        className={`w-full p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">News</h1>
        </div>

        {/* stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => setSelectedStatus(s.statusKey)}
              className={`border rounded-lg p-4 ${s.color} text-left transition`}
            >
              <p className="text-sm">{s.label}</p>
              <h2 className="text-3xl font-semibold">{s.value}</h2>
            </button>
          ))}
        </div>

        {/* filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center flex-1 border border-orange-500 rounded-lg bg-white px-4 py-2">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 outline-none text-gray-700 bg-transparent"
            />
          </div>

          <DropdownFilter
            label="Year"
            options={["All Years", "2025", "2024", "2023"]}
            currentFilter={selectedYear}
            onSelect={setSelectedYear}
          />
          <DropdownFilter
            label="Category"
            options={["All", "News", "Workshop", "Certification", "Articles"]}
            currentFilter={selectedKategori}
            onSelect={setSelectedKategori}
          />
          <DropdownFilter
            label="Sorting"
            options={["A-Z", "Z-A", "Newest", "Oldest"]}
            currentFilter={selectedSort}
            onSelect={setSelectedSort}
          />
          <DropdownFilter
            label="Status"
            options={["All", "Published", "Review", "Waiting", "Muted"]}
            currentFilter={selectedStatus}
            onSelect={setSelectedStatus}
          />
        </div>

        {/* table */}
        <div className="border border-orange-500 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50">
              <tr>
                <th className="py-3">Title</th>
                <th className="py-3">Kategori</th>
                <th className="py-3">Date</th>
                <th className="py-3">Publisher</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500"
                  >
                    Loading news...
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                filteredData.map((row, index) => {
                  const isLastRow = index === filteredData.length - 1;
                  const borderClass = isLastRow
                    ? ""
                    : "border-b border-gray-200";

                  return (
                    <tr key={row.id ?? index}>
                      <td className={`py-3 ${borderClass} text-center`}>
                        {row.title}
                      </td>
                      <td className={`py-3 ${borderClass} text-center`}>
                        {row.kategori}
                      </td>
                      <td className={`py-3 ${borderClass} text-center`}>
                        {row.year}
                      </td>
                      <td className={`py-3 ${borderClass} text-center`}>
                        {row.publisher}
                      </td>
                      <td
                        className={`py-3 ${borderClass} font-medium text-center ${getStatusColorClass(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && !error && filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500"
                  >
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
