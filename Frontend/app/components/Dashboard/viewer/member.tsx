import Sidebar from "~/components/Dashboard/viewer/sidebar";
import { useState, useMemo } from "react";
import { Menu } from 'lucide-react';

interface DropdownFilterProps {
  label: string;
  options: string[];
  currentFilter: string;
  onSelect: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ label, options, currentFilter, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border border-black rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center justify-between min-w-[120px]"
      >
        {currentFilter || label}
        <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
};

const parseDate = (dateStr: string): number => {
  const parts = dateStr.toLowerCase().split(" ");
  const day = parseInt(parts[0]);
  const month = MONTHS[parts[1]];
  const year = parseInt(parts[2]);
  return new Date(year, month, day).getTime();
};

export default function MemberPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [selectedYear, setSelectedYear] = useState("All Years"); 
  const [selectedRole, setselectedRole] = useState("All"); 
  const [selectedSort, setSelectedSort] = useState("A-Z");
  const [searchTerm, setSearchTerm] = useState("");
  
  const allTableData = useMemo(() => [
    { name: "Aulia Resty Azizah", identityNum: "244107020015", role: "Game Developer", startDate: "31 Agustus 2025", position: "Researcher" },
    { name: "Resty Azizah", identityNum: "244107020015", role: "Frontend Developer", startDate: "1 Agustus 2025", position: "Researcher" },
    { name: "Budi Budi arto", identityNum: "244107020015", role: "UI/UX Designer", startDate: "31 Mei 2025", position: "Researcher" },
    { name: "Lando Norris", identityNum: "244107020015", role: "Frontend Developer", startDate: "31 Agustus 2023", position: "Researcher" },
    { name: "Marc marquez", identityNum: "244107020015", role: "UI/UX Designer", startDate: "20 Agustus 2025", position: "Researcher" },
    { name: "Muhammad Wahyu", identityNum: "244107020015", role: "UI/UX Designer", startDate: "31 Agustus 2024", position: "Researcher" },
    { name: "Fidela", identityNum: "244107020015", role: "Game Developer", startDate: "5 Agustus 2025", position: "Researcher" },
  ], []);

  const stats = [
    { label: "Lecturer", value: 40, color: "border-orange-400 text-orange-500" },
    { label: "Student", value: 40, color: "border-blue-400 text-blue-500" },
    { label: "Alumni", value: 40, color: "border-green-400 text-green-500" },
  ];
  
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Muted": return "text-red-500";
      case "Waiting": return "text-blue-600";
      default: return "text-black";
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
  };

  const filteredData = useMemo(() => {
    let data = [...allTableData];
    const getYearFromString = (dateString: string) => {
        const parts = dateString.trim().split(' ');
        return parts[parts.length - 1]; 
    };
    
    if (selectedRole !== "All") { data = data.filter(row => row.role === selectedRole); }
    if (selectedYear !== "All Years") { data = data.filter(row => getYearFromString(row.startDate) === selectedYear); }

    if (searchTerm) {
      const lowerCaseQuery = searchTerm.toLowerCase();
      data = data.filter(row => 
        row.name.toLowerCase().includes(lowerCaseQuery) ||
        row.role.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (selectedSort === "A-Z") { 
      data.sort((a, b) => a.name.localeCompare(b.name)); 
    } else if (selectedSort === "Z-A") { 
      data.sort((a, b) => b.name.localeCompare(a.name)); 
    } else if (selectedSort === "Newest") {
      data.sort((a, b) => parseDate(b.startDate) - parseDate(a.startDate));
    } else if (selectedSort === "Oldest") {
      data.sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));
    }

    return data;
  }, [allTableData, selectedYear, selectedRole, searchTerm, selectedSort]);


  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div 
        className={`w-full p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
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
              className={`border-1 rounded-lg p-4 ${s.color}`} 
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
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          
          <DropdownFilter label="Tahun" options={["All Years", "2025", "2024", "2023"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
          <DropdownFilter label="Kategori" options={["All", "UI/UX Designer", "Game Developer", "Frontend Developer"]} currentFilter={selectedRole} onSelect={setselectedRole} />
          <DropdownFilter label="Urutkan" options={["A-Z", "Z-A", "Newest", "Oldest"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
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
              {filteredData.map((row, index) => {
                const isLastRow = index === filteredData.length - 1;
                const borderClass = isLastRow ? '' : 'border-b border-gray-200';

                return (
                  <tr key={index}> 
                    <td className={`py-3 ${borderClass} text-center`}>{row.name}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.identityNum}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.role}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.startDate}</td>
                    <td className={`py-3 ${borderClass} font-medium text-center ${getStatusColorClass(row.position)}`}>{row.position}</td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                 <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
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