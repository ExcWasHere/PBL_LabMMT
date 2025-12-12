import Sidebar from "~/components/Dashboard/admin/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Plus, Menu, Eye, EyeOff, Pencil, Trash, X, Check, FileText, Image } from "lucide-react";
import { gallery_dummy, gallery_pending_dummy } from "./dataDummy";
import DropdownFilter from "~/common/dropdown-filter";
import GalleryForm from "~/common/gallery-form";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState("All Years");
    const [selectedKategori, setSelectedKategori] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Latest");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [showPending, setShowPending] = useState(false);
    const [galleryList, setGalleryList] = useState(gallery_dummy);
    const [pending, setPending] = useState(gallery_pending_dummy);
    const handleViewFile = (file: any) => {
        alert("Preview file: " + file.name);
    };

    const stats = [
        {
            label: "Published",
            value: galleryList.filter((p) => p.status === "Published").length,
            color: "border-orange-400 text-orange-500",
        },
        {
            label: "Review",
            value: galleryList.filter((p) => p.status === "Review").length,
            color: "border-blue-400 text-blue-500",
        },
        {
            label: "Wait To Publish",
            value: galleryList.filter((p) => p.status === "Waiting").length,
            color: "border-green-400 text-green-500",
        },
        {
            label: "Muted",
            value: galleryList.filter((p) => p.status === "Muted").length,
            color: "border-red-400 text-red-500",
        },
    ];

    const pendingCounter = [{value: pending.length}]

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

    const filteredData = useMemo(() => {
        let data = [...galleryList];
        const getYearFromString = (dateString: string) => {
            const parts = dateString.trim().split(' ');
            return parts[parts.length - 1];
        };

        if (selectedYear !== "All Years") { data = data.filter(row => getYearFromString(row.date) === selectedYear); }

        if (searchTerm) {
            const lowerCaseQuery = searchTerm.toLowerCase();
            data = data.filter(row =>
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
    }, [galleryList, selectedYear, selectedKategori, searchTerm, selectedSort, selectedStatus]);
    

    const handleApprove = (item: any) => {
        alert("Approved: " + item.title);
    };

    const handleReject = (item: any) => {
        alert("Rejected: " + item.title);
    };

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
        publisher:"Me",
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
                    <h1 className="text-3xl font-bold text-orange-600">Gallery</h1>
                </div>

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

                    <DropdownFilter label="Tahun" options={["All Years", "2025", "2024", "2023"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
                    <DropdownFilter label="Urutkan" options={["A-Z", "Z-A", "Most Popular", "Latest"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        <Plus size={18} />
                        Add Gallery
                    </button>
                </div>

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
                                <th className="py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => {
                                const isLastRow = index === filteredData.length - 1;
                                const borderClass = isLastRow ? '' : 'border-b border-gray-200';
                                const isReview = row.status === "Review";
                                const isMuted = row.status === "Muted";
                                const isWaiting = row.status === "Waiting";

                                const disabledStyle = "text-gray-300 cursor-not-allowed";

                                return (
                                    <tr key={index}>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.title}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.photo}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.video}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.animation}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{formatDate(row.date)}</td>
                                        <td className={`py-3 ${borderClass} text-center`}>{row.publisher}</td>
                                        <td className={`py-3 ${borderClass} text-center`}> <TableStatus status={row.status} /></td>
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
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                         No matching data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => setShowPending(!showPending)}
                        className="flex items-center justify-between w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100">
                        <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-800 mr-3">
                                Gallery Submissions
                            </h3>
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">{pendingCounter.map(pc => pc.value)} New</span>
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
                                        <th className="py-3">Title</th>
                                        <th className="py-3">Category</th>
                                        <th className="py-3">Publisher</th>
                                        <th className="py-3">Date</th>
                                        <th className="py-3">Files</th>
                                        <th className="py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200">
                                            <td className="py-3 text-center">{item.title}</td>
                                            <td className="py-3 text-center">{item.category}</td>
                                            <td className="py-3 text-center">
                                                <div className="text-sm">
                                                    <p className="font-medium">{item.submittedBy?.name || "Unknown"}</p>
                                                    <p className="text-xs text-gray-500"></p>
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">{item.submissionDate}</td>
                                            <td className="py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {item.files?.map((file: any, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleViewFile(file)}
                                                            className="group relative p-2 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                                                            title={`View ${file.type}`}
                                                        >
                                                            <Image size={16} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleApprove(item)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Approve Submission"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(item)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Reject Submission"
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