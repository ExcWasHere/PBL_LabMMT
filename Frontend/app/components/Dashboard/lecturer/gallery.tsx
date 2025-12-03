import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo } from "react";
import { Menu, Plus, Eye, EyeOff, Pencil, Trash } from "lucide-react";
import { gallery_dummy } from "./dataDummy";
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

export default function GalleryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [galleryList, setGalleryList] = useState(gallery_dummy);

  const stats = [
    {
      label: "Published",
      value: galleryList.filter((n) => n.status === "Published").length,
      color: "border-orange-400 text-orange-500",
    },
    {
      label: "Review",
      value: galleryList.filter((n) => n.status === "Review").length,
      color: "border-blue-400 text-blue-500",
    },
    {
      label: "Wait To Publish",
      value: galleryList.filter((n) => n.status === "Waiting").length,
      color: "border-green-400 text-green-500",
    },
    {
      label: "Muted",
      value: galleryList.filter((n) => n.status === "Muted").length,
      color: "border-red-400 text-red-500",
    },
  ];

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Muted":
        return "text-red-500";
      case "Waiting":
        return "text-green-500";
      case "Review":
        return "text-blue-500";
      case "Published":
        return "text-orange-500";
      default:
        return "text-black";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleMute = (id: number) => {
    setGalleryList((prevGallery) =>
      prevGallery.map((gallery) => {
        if (gallery.id === id) {
          const newStatus = gallery.status === "Muted" ? "Published" : "Muted";
          return { ...gallery, status: newStatus };
        }
        return gallery;
      })
    );
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let data = [...galleryList];
    const getYearFromString = (dateString: string) => {
      const parts = dateString.trim().split(" ");
      return parts[parts.length - 1];
    };

    if (selectedYear !== "All Year") {
      data = data.filter((row) => getYearFromString(row.date) === selectedYear);
    }

    if (searchTerm) {
      const lowerCaseQuery = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          row.title.toLowerCase().includes(lowerCaseQuery) ||
          row.publisher.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (selectedSort === "A-Z") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "Z-A") {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === "Latest") {
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (selectedStatus !== "All Status") {
      data = data.filter((row) => row.status === selectedStatus);
    }

    return data;
  }, [
    galleryList,
    selectedYear,
    selectedKategori,
    searchTerm,
    selectedSort,
    selectedStatus,
  ]);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div
        className={`w-full p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        <div className="flex items-center mb-6">
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
            <div key={s.label} className={`border-1 rounded-lg p-4 ${s.color}`}>
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
            label="Urutkan"
            options={["A-Z", "Z-A", "Latest"]}
            currentFilter={selectedSort}
            onSelect={setSelectedSort}
          />
          <DropdownFilter
            label="Status"
            options={["All Status", "Published", "Waiting", "Review", "Muted"]}
            currentFilter={selectedStatus}
            onSelect={setSelectedStatus}
          />

          <button
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            onClick={() => console.log("Test")} // buat testing doang
          >
            <Plus size={20} />
            <span>Add Gallery</span>
          </button>
        </div>

        {/* --- Table Section --- */}
        <div className="border border-black rounded-lg overflow-hidden">
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
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => {
                const isLastRow = index === filteredData.length - 1;
                const borderClass = isLastRow ? "" : "border-b border-gray-200";

                const isReview = row.status === "Review";
                const isMuted = row.status === "Muted";
                const isWaiting = row.status === "Waiting";

                const disabledStyle = "text-gray-300 cursor-not-allowed";

                return (
                  <tr key={index}>
                    <td className={`py-3 ${borderClass} text-center`}>
                      {row.title}
                    </td>
                    <td className={`py-3 ${borderClass} text-center`}>
                      {row.photo}
                    </td>
                    <td className={`py-3 ${borderClass} text-center`}>
                      {row.video}
                    </td>
                    <td className={`py-3 ${borderClass} text-center`}>
                      {row.animation}
                    </td>
                    <td className={`py-3 ${borderClass} text-center`}>
                      {row.date}
                    </td>
                    <td className={`py-3 ${borderClass} text-center`}>
                      {row.publisher}
                    </td>
                    <td
                      className={`py-3 ${borderClass} font-medium text-center ${getStatusColorClass(row.status)}`}
                    >
                      {row.status}
                    </td>

                    <td className={`py-3 ${borderClass} text-center`}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className={`transition-colors ${isReview ? disabledStyle : "text-gray-600 hover:text-blue-600"}`}
                          onClick={() => !isReview && handleToggleMute(row.id)}
                          disabled={isReview}
                          title={isMuted ? "Unmute News" : "Mute News"}
                        >
                          {isMuted ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                        <button
                          className={`transition-colors ${isReview || isWaiting || isMuted ? disabledStyle : "text-gray-600 hover:text-orange-600"}`}
                          onClick={() =>
                            !(isReview || isWaiting || isMuted) &&
                            console.log("Edit", row.title)
                          }
                          disabled={isReview || isWaiting || isMuted}
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          className={`transition-colors ${isReview ? disabledStyle : "text-gray-600 hover:text-red-600"}`}
                          onClick={() =>
                            !isReview && console.log("Delete", row.title)
                          }
                          disabled={isReview}
                          title="Hapus"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
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
