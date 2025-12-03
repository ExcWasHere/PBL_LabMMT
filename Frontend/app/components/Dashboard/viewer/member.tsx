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
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

const parseDate = (dateStr: string): number => {
  const parts = dateStr.toLowerCase().split(" ");
  const day = parseInt(parts[0]);
  const month = MONTHS[parts[1]];
  const year = parseInt(parts[2]);
  return new Date(year, month, day).getTime();
};

const formatDateForViewer = (raw: string | Date): string => {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate();
  const year = d.getFullYear();
  const monthIndex = d.getMonth();
  const monthLabels = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${day} ${monthLabels[monthIndex]} ${year}`;
};

const getYearFromString = (dateString: string) => {
  const parts = dateString.trim().split(" ");
  return parts[parts.length - 1];
};

const getPositionColorClass = (position: string) => {
  switch (position) {
    case "Lecturer":
      return "text-orange-500";
    case "Student":
      return "text-blue-500";
    case "Alumni":
      return "text-green-500";
    default:
      return "text-black";
  }
};

interface MemberRow {
  id?: string;
  name: string;
  identityNum: string;
  role: string;
  startDate: string;
  position: string;
}

export default function MemberPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedSort, setSelectedSort] = useState("A-Z");
  const [searchTerm, setSearchTerm] = useState("");

  const [allTableData, setAllTableData] = useState<MemberRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:3000/member");
        if (!res.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await res.json();
        const mapped: MemberRow[] = (Array.isArray(data) ? data : []).map(
          (m: any) => ({
            id: m.id,
            name: m.name ?? "-",
            identityNum: m.identityNum ?? "-",
            role: m.role ?? "-",
            startDate: m.startDate ? formatDateForViewer(m.startDate) : "",
            position: m.position ?? "Researcher",
          })
        );

        setAllTableData(mapped);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data member.");
        setAllTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const stats = useMemo(() => {
    let lecturer = 0;
    let student = 0;
    let alumni = 0;

    allTableData.forEach((m) => {
      if (m.position === "Lecturer") lecturer++;
      else if (m.position === "Student") student++;
      else if (m.position === "Alumni") alumni++;
    });

    return [
      {
        label: "Lecturer",
        value: lecturer,
        color: "border-orange-400 text-orange-500",
      },
      {
        label: "Student",
        value: student,
        color: "border-blue-400 text-blue-500",
      },
      {
        label: "Alumni",
        value: alumni,
        color: "border-green-400 text-green-500",
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

    if (selectedRole !== "All") {
      data = data.filter((row) => row.role === selectedRole);
    }
    if (selectedYear !== "All Years") {
      data = data.filter(
        (row) => getYearFromString(row.startDate) === selectedYear
      );
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          row.name.toLowerCase().includes(lower) ||
          row.role.toLowerCase().includes(lower)
      );
    }

    if (selectedSort === "A-Z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "Z-A") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedSort === "Newest") {
      data.sort(
        (a, b) => parseDate(b.startDate) - parseDate(a.startDate)
      );
    } else if (selectedSort === "Oldest") {
      data.sort(
        (a, b) => parseDate(a.startDate) - parseDate(b.startDate)
      );
    }

    return data;
  }, [allTableData, selectedYear, selectedRole, searchTerm, selectedSort]);

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
          <h1 className="text-3xl font-bold text-orange-600">Member</h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`border rounded-lg p-4 ${s.color}`}
            >
              <div className="text-left">
                <p className="text-sm">{s.label}</p>
                <h2 className="text-3xl font-semibold">{s.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center flex-1 border border-black rounded-lg bg-white px-4 py-2">
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
            label="Tahun"
            options={["All Years", "2025", "2024", "2023"]}
            currentFilter={selectedYear}
            onSelect={setSelectedYear}
          />
          <DropdownFilter
            label="Role"
            options={[
              "All",
              "UI/UX Designer",
              "Game Developer",
              "Frontend Developer",
            ]}
            currentFilter={selectedRole}
            onSelect={setSelectedRole}
          />
          <DropdownFilter
            label="Urutkan"
            options={["A-Z", "Z-A", "Newest", "Oldest"]}
            currentFilter={selectedSort}
            onSelect={setSelectedSort}
          />
        </div>

        <div className="border border-black rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">NIM/NIDN</th>
                <th className="py-3">Role</th>
                <th className="py-3">Start Date</th>
                <th className="py-3">Position</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500"
                  >
                    Loading members...
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
                        {row.name}
                      </td>
                      <td className={`py-3 ${borderClass} text-center`}>
                        {row.identityNum}
                      </td>
                      <td className={`py-3 ${borderClass} text-center`}>
                        {row.role}
                      </td>
                      <td className={`py-3 ${borderClass} text-center`}>
                        {row.startDate}
                      </td>
                      <td
                        className={`py-3 ${borderClass} font-medium text-center ${getPositionColorClass(
                          row.position
                        )}`}
                      >
                        {row.position}
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