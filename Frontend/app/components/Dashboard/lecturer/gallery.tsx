import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, Plus } from "lucide-react";
import { gallery_dummy } from "./dataDummy";
import GalleryForm from "~/common/gallery-form";
import DropdownFilter from "~/common/dropdown-filter";
import { useUserProfile } from "~/hook/useUserProfile";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";

export default function GalleryPage() {
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

  const [editData, setEditData] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [galleryList, setGalleryList] = useState(gallery_dummy);
  const profile = useUserProfile();

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
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
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
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

  const handleSaveGallery = (formData: any) => {
    let photoCount = 0;
    let videoCount = 0;
    let animationCount = 0;

    if (formData.mediaFilesRaw && formData.mediaFilesRaw.length > 0) {
      formData.mediaFilesRaw.forEach((file: File) => {
        if (file.type.startsWith("image/")) {
          if (file.type === "image/gif") {
            animationCount++;
          } else {
            photoCount++;
          }
        } else if (file.type.startsWith("video/")) {
          videoCount++;
        }
      });
    }

    if (editData) {
      setGalleryList((prevGallery) =>
        prevGallery.map((gallery) => {
          if (gallery.id === editData.id) {
            return {
              ...gallery,
              title: formData.title,
              description: formData.description,
              location: formData.location,
              date: formData.date,
              mediaTypes: formData.mediaTypes,
              mediaFiles: formData.mediaFiles,
              thumbnailUrl: formData.thumbnailUrl,
              photo: photoCount.toString(),
              video: videoCount.toString(),
              animation: animationCount.toString(),
            };
          }
          return gallery;
        })
      );
    } else {
      const newGallery = {
        id: galleryList.length + 1,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        mediaTypes: formData.mediaTypes,
        mediaFiles: formData.mediaFiles,
        publisher: profile.name || "Me",
        status: "Review",
        photo: photoCount.toString(),
        video: videoCount.toString(),
        animation: animationCount.toString(),
        thumbnailUrl: formData.thumbnailUrl || "",
      };
      setGalleryList([newGallery as any, ...galleryList]);
    }

    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this gallery?")) {
      setGalleryList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditClick = (gallery: any) => {
    setEditData(gallery);
    setIsFormOpen(true);
  };

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
            Gallery
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              label="Urutkan"
              options={["A-Z", "Z-A", "Latest"]}
              currentFilter={selectedSort}
              onSelect={setSelectedSort}
            />
            <DropdownFilter
              label="Status"
              options={[
                "All Status",
                "Published",
                "Waiting",
                "Review",
                "Muted",
                "Denied",
              ]}
              currentFilter={selectedStatus}
              onSelect={setSelectedStatus}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap mt-2 md:mt-0"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={20} />
            <span>Add Gallery</span>
          </button>
        </div>

        <div className="border border-orange-500 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-orange-50">
                <tr>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Photo</th>
                  <th className="py-3 px-2">Video</th>
                  <th className="py-3 px-2">Animation</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Publisher</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Action</th>
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
                        {row.title}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.photo}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.video}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.animation}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {formatDate(row.date)}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.publisher}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        <TableStatus status={row.status} />
                      </td>

                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        <TableAction
                          status={row.status}
                          onToggleMute={() => handleToggleMute(row.id)}
                          onEdit={() => handleEditClick(row)}
                          onDelete={() => handleDelete(row.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No matching data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isFormOpen && (
          <GalleryForm
            onClose={() => {
              setIsFormOpen(false);
              setEditData(null);
            }}
            onSubmit={handleSaveGallery}
            initialData={
              editData
                ? {
                    title: editData.title || "",
                    description: editData.description || "",
                    date: editData.date || "",
                    location: editData.location || "",
                    mediaTypes: editData.mediaTypes || [],
                    mediaFiles: editData.mediaFiles || [],
                    thumbnailUrl: editData.thumbnailUrl || "",
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
