import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, FileText, Check, X } from "lucide-react";
import { member_dummy, registration_dummy } from "./dataDummy";
import DropdownFilter from "~/common/dropdown-filter";

export default function MemberPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");

  const [memberList, setMemberList] = useState(member_dummy);
  const [memberPending, setMemberPending] = useState(registration_dummy);
  const [showPending, setShowPending] = useState(false);

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

  return (
    <div className="flex relative min-h-screen">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}

      <div
        className={`w-full p-4 md:p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-600">
            Member
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`border-1 rounded-lg p-4 ${s.color}`}>
              <div className="text-left">
                <p className="text-sm">{s.label}</p>
                <h2 className="text-3xl font-semibold">{s.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center flex-1 border border-orange-500 rounded-lg bg-white px-4 py-2 min-w-[200px]">
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

          <div className="flex gap-2 flex-wrap w-full md:w-auto">
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
              onSelect={setSelectedRole}
            />
            <DropdownFilter
              label="Urutkan"
              options={["A-Z", "Z-A", "Latest"]}
              currentFilter={selectedSort}
              onSelect={setSelectedSort}
            />
          </div>
        </div>

        <div className="border border-orange-500 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-orange-50">
                <tr>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">NIM/NIDN</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Start Date</th>
                  <th className="py-3 px-2">Position</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => {
                  const isLastRow = index === filteredData.length - 1;
                  const borderClass = isLastRow
                    ? ""
                    : "border-b border-gray-200";

                  return (
                    <tr key={index}>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.name}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.identityNum}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.role}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.startDate}
                      </td>
                      <td
                        className={`py-3 px-2 ${borderClass} font-medium text-center ${getStatusColorClass(
                          row.position
                        )}`}
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
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowPending(!showPending)}
            className="flex items-center justify-between w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
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
              className={`w-5 h-5 transform transition-transform ${
                showPending ? "rotate-0" : "rotate-180"
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
              />
            </svg>
          </button>

          {showPending && (
            <div className="mt-4 border border-orange-500 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">NIM</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Registration Date</th>
                      <th className="py-3 px-2">Document</th>
                      <th className="py-3 px-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {memberPending.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200">
                        <td className="py-3 px-2 text-center">{user.name}</td>
                        <td className="py-3 px-2 text-center">{user.nim}</td>
                        <td className="py-3 px-2 text-center">{user.email}</td>
                        <td className="py-3 px-2 text-center">{user.role}</td>
                        <td className="py-3 px-2 text-center">
                          {user.registrationDate}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex justify-center gap-3">
                            <a
                              href={user.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative p-2 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                              title="Buka CV di tab baru"
                            >
                              <FileText size={18} />
                            </a>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => alert(`Approved ${user.name}`)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check size={18} />
                            </button>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
