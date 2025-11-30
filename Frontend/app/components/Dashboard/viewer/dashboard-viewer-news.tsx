import Sidebar from "app/common/sidebar";
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
export default function NewsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState("Semua Tahun"); 
  const [selectedKategori, setSelectedKategori] = useState("Semua"); 
  const [selectedSort, setSelectedSort] = useState("Terbaru");
  const [searchTerm, setSearchTerm] = useState("");
  
  const allTableData = useMemo(() => [
    { title: "Pengenalan React Hooks", kategori: "Workshop", year: "2 des 2025", publisher: "Aulia Resty Azizah", status: "Done" },
    { title: "Berita Teknologi Terbaru Q4", kategori: "Berita", year: "15 nov 2024", publisher: "Budi Santoso", status: "Review" },
    { title: "Tips & Trik Menulis Artikel SEO", kategori: "Artikel", year: "28 feb 2025", publisher: "Citra Dewi", status: "Waiting" },
    { title: "Pelatihan Dasar Desain Grafis", kategori: "Pelatihan", year: "10 jul 2023", publisher: "Aulia Resty Azizah", status: "Done" },
    { title: "Workshop Keamanan Siber", kategori: "Workshop", year: "30 jan 2025", publisher: "Dani Setiawan", status: "Muted" },
    { title: "Sertifikasi AWS Cloud Practitioner", kategori: "Sertifikasi", year: "5 apr 2024", publisher: "Budi Santoso", status: "Review" },
    { title: "Artikel Mendalam tentang AI", kategori: "Artikel", year: "1 aug 2025", publisher: "Citra Dewi", status: "Done" },
  ], []);

  const stats = [
    { label: "Published", value: 40, color: "border-orange-400 text-orange-500" },
    { label: "Review", value: 40, color: "border-blue-400 text-blue-500" },
    { label: "Wait To Publish", value: 40, color: "border-green-400 text-green-500" },
    { label: "Muted", value: 9, color: "border-red-400 text-red-500" },
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
    
    if (selectedKategori !== "Semua") { data = data.filter(row => row.kategori === selectedKategori); }
    if (selectedYear !== "Semua Tahun") { data = data.filter(row => getYearFromString(row.year) === selectedYear); }

    if (searchTerm) {
      const lowerCaseQuery = searchTerm.toLowerCase();
      data = data.filter(row => 
        row.title.toLowerCase().includes(lowerCaseQuery) ||
        row.publisher.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (selectedSort === "A-Z") { data.sort((a, b) => a.title.localeCompare(b.title)); } 
    else if (selectedSort === "Z-A") { data.sort((a, b) => b.title.localeCompare(a.title)); }

    return data;
  }, [allTableData, selectedYear, selectedKategori, searchTerm, selectedSort]);


  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      {/* Page Content */}
      <div 
        className={`w-full p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
            {/* TOMBOL TOGGLE */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
            >
                <Menu size={24} />
            </button>
            <h1 className="text-3xl font-bold text-orange-600">News</h1>
        </div>

        {/* --- Stats Section --- */}
        <div className="grid grid-cols-4 gap-4 mb-6">
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
        
        {/* --- Filters Section --- */}
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
          
          <DropdownFilter label="Tahun" options={["Semua Tahun", "2025", "2024", "2023"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
          <DropdownFilter label="Kategori" options={["Semua", "Berita", "Pelatihan", "Workshop", "Sertifikasi", "Artikel"]} currentFilter={selectedKategori} onSelect={setSelectedKategori} />
          <DropdownFilter label="Urutkan" options={["A-Z", "Z-A", "Terpopuler", "Terbaru"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
        </div>

        {/* --- Table Section --- */}
        <div className="border border-black rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50">
              <tr>
                <th className="py-3">Title</th>
                <th className="py-3">Kategori</th>
                <th className="py-3">Year</th>
                <th className="py-3">Publisher</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => {
                const isLastRow = index === filteredData.length - 1;
                const borderClass = isLastRow ? '' : 'border-b border-gray-200';

                return (
                  <tr key={index}> 
                    <td className={`py-3 ${borderClass} text-center`}>{row.title}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.kategori}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.year}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.publisher}</td>
                    <td className={`py-3 ${borderClass} font-medium text-center ${getStatusColorClass(row.status)}`}>{row.status}</td>
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
    </div>
  );
}