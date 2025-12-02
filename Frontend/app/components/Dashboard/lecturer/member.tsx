import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo } from "react";
import { Menu, FileText, CreditCard, Check, X } from "lucide-react";
import { member_dummy, registration_dummy } from "./dataDummy";
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
        className="border border-black rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center justify-between min-w-[120px]"
      >
        {currentFilter || label}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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

// --- NewsPage Component ---

export default function MemberPage() {
  // STATE BARU untuk mengontrol sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default terbuka

  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedRole, setselectedRole] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");

  const [memberList, setMemberList] = useState(member_dummy);

  const stats = [
    {
      label: "Lecturer",
      value: 40,
      color: "border-orange-400 text-orange-500",
    },
    { label: "Student", value: 40, color: "border-blue-400 text-blue-500" },
    { label: "Alumni", value: 40, color: "border-green-400 text-green-500" },
  ];

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Muted":
        return "text-red-500";
      case "Waiting":
        return "text-blue-600";
      default:
        return "text-black";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    // ... (Logika filtering sama) ...
    let data = [...memberList];
    const getYearFromString = (dateString: string) => {
      const parts = dateString.trim().split(" ");
      return parts[parts.length - 1];
    };

    if (selectedRole !== "All") {
      data = data.filter((row) => row.role === selectedRole);
    }
    if (selectedYear !== "All Year") {
      data = data.filter(
        (row) => getYearFromString(row.startDate) === selectedYear
      );
    }

    if (searchTerm) {
      const lowerCaseQuery = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          row.name.toLowerCase().includes(lowerCaseQuery) ||
          row.role.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (selectedSort === "A-Z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "Z-A") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    return data;
  }, [memberList, selectedYear, selectedRole, searchTerm, selectedSort]);

  const [memberPending, setMemberPending] = useState(registration_dummy);

  const [showPending, setShowPending] = useState(false);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      {/* Page Content - Mengontrol margin kiri berdasarkan status sidebar */}
      <div
        className={`w-full p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Header dengan Tombol Toggle */}
        <div className="flex items-center mb-6">
          {/* TOMBOL TOGGLE */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Member</h1>
        </div>

        {/* --- Stats Section --- */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`border-1 rounded-lg p-4 ${s.color}`}>
              <div className="text-left">
                <p className="text-sm">{s.label}</p>
                <h2 className="text-3xl font-semibold">{s.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* --- Filters Section --- (Tetap) */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center flex-1 border border-black rounded-lg bg-white px-4 py-2">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            options={["All Year", "2025", "2024", "2023"]}
            currentFilter={selectedYear}
            onSelect={setSelectedYear}
          />
          <DropdownFilter
            label="Kategori"
            options={[
              "All",
              "UI/UX Designer",
              "Game Developer",
              "Frontend Developer",
            ]}
            currentFilter={selectedRole}
            onSelect={setselectedRole}
          />
          <DropdownFilter
            label="Urutkan"
            options={["A-Z", "Z-A", "Latest"]}
            currentFilter={selectedSort}
            onSelect={setSelectedSort}
          />
        </div>

        {/* --- Table Section --- */}
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
              {filteredData.map((row, index) => {
                const isLastRow = index === filteredData.length - 1;
                const borderClass = isLastRow ? "" : "border-b border-gray-200";

                return (
                  <tr key={index}>
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
                      className={`py-3 ${borderClass} font-medium text-center ${getStatusColorClass(row.position)}`}
                    >
                      {row.position}
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Tidak ada data yang cocok dengan filter yang diterapkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowPending(!showPending)}
            className="flex items-center justify-between w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
          >
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 mr-3">
                Registrations
              </h3>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                1 new
              </span>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${showPending ? "rotate-0" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showPending && (
            <div className="mt-4 border border-orange-500 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="py-3">Name</th>
                    <th className="py-3">NIM</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">Registration Date</th>
                    <th className="py-3">Document</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {memberPending.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200">
                      <td className="py-3 text-center">{user.name}</td>
                      <td className="py-3 text-center">{user.nim}</td>
                      <td className="py-3 text-center">{user.email}</td>
                      <td className="py-3 text-center">{user.role}</td>
                      <td className="py-3 text-center">
                        {user.registrationDate}
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center gap-3">
                          {/* Icon CV */}
                          <a
                            href={user.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-2 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                            title="Buka CV di tab baru"
                          >
                            <FileText size={18} />
                          </a>

                          {/* Icon KTM */}
                          <a
                            href={user.ktmUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-2 text-green-600 rounded-lg hover:bg-green-100 transition flex items-center gap-1"
                            title="Buka KTM di tab baru"
                          >
                            <CreditCard size={18} />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          {/* APPROVE */}
                          <button
                            onClick={() => alert(`Approved ${user.name}`)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={18} />
                          </button>

                          {/* REJECT */}
                          <button
                            onClick={() => alert(`Rejected ${user.name}`)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
