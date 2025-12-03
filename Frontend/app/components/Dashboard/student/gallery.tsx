import Sidebar from "~/components/Dashboard/student/sidebar";
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
                className="border border-orange-500 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center justify-between min-w-[120px]"
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

export default function GalleryPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [selectedYear, setSelectedYear] = useState("Semua Tahun");
    const [selectedKategori, setSelectedKategori] = useState("Semua");
    const [selectedSort, setSelectedSort] = useState("Terbaru");
    const [searchTerm, setSearchTerm] = useState("");

    const allTableData = useMemo(() => [
        { title: "Open Recruitment Lab MMT ", photo: "50", video: "68", animation: "34", date: "31 Aug 2025", publisher: "Budi Santoso", status: "Review" },
        { title: "Game Jam MMC", photo: "12", video: "30", animation: "15", date: "15 Sep 2025", publisher: "Citra Dewi", status: "Published" },
        { title: "Play IT Polinema 2025", photo: "90", video: "110", animation: "55", date: "05 Okt 2024", publisher: "Andi Wijaya", status: "Draft" },
        { title: "11th Dies Natalis", photo: "35", video: "42", animation: "20", date: "22 Okt 2023", publisher: "Dewi Lestari", status: "Published" },
        { title: "Workshop Game Unity", photo: "60", video: "75", animation: "40", date: "10 Nov 2025", publisher: "Eko Prasetyo", status: "Review" },
    ], []);

    const stats = [
        { label: "Published", value: 0, color: "border-orange-400 text-orange-500" },
        { label: "Review", value: 0, color: "border-blue-400 text-blue-500" },
        { label: "Wait To Publish", value: 0, color: "border-green-400 text-green-500" },
        { label: "Muted", value: 0, color: "border-red-400 text-red-500" },
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

    // --- Filtering Logic ---
    const filteredData = useMemo(() => {
        // ... (Logika filtering sama) ...
        let data = [...allTableData];
        const getYearFromString = (dateString: string) => {
            const parts = dateString.trim().split(' ');
            return parts[parts.length - 1];
        };
        
        if (selectedYear !== "Semua Tahun") { data = data.filter(row => getYearFromString(row.date) === selectedYear); }

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

            {/* Page Content - Mengontrol margin kiri berdasarkan status sidebar */}
            <div
                className={`w-full p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
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
                    <h1 className="text-3xl font-bold text-orange-600">Gallery</h1>
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

                {/* --- Filters Section --- (Tetap) */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center flex-1 border border-orange-500 rounded-lg bg-white px-4 py-2">
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
                    <DropdownFilter label="Urutkan" options={["A-Z", "Z-A", "Terpopuler", "Terbaru"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
                </div>

                {/* --- Table Section --- */}
                <div className="border border-orange-500 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="py-3">Title</th>
                                <th className="py-3">Photo</th>
                                <th className="py-3">Video</th>
                                <th className="py-3">Animation</th>
                                <th className="py-3">Date</th>
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
                                        <td className={`py-3 ${borderClass} text-center`}>{row.photo}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.video}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.animation}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.date}</td>
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