import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Menu, Plus } from "lucide-react";
import GalleryForm from "~/common/gallery-form";
import DropdownFilter from "~/common/dropdown-filter";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";

const API_BASE_URL = "http://localhost:3000";
const GALLERY_ENDPOINT = `${API_BASE_URL}/gallery`;
const PHOTO_UPLOAD = `${API_BASE_URL}/photo/upload`;
const VIDEO_UPLOAD = `${API_BASE_URL}/video/upload`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const getAuthHeaderForFormData = (): HeadersInit | undefined => {
  const token = localStorage.getItem("token");
  if (!token) return undefined;
  return { Authorization: `Bearer ${token}` };
};

const getPublisherName = () => {
  try {
    const raw = localStorage.getItem("user") || localStorage.getItem("auth");
    if (!raw) return "Dosen";
    const parsed = JSON.parse(raw);
    
    if (parsed.name) return parsed.name;
    if (parsed.fullname) return parsed.fullname;
    if (parsed.username) return parsed.username;
    
    if (parsed.user?.name) return parsed.user.name;
    if (parsed.user?.fullname) return parsed.user.fullname;
    
    return "Dosen";
  } catch { return "Dosen"; }
};

const uploadFile = async (file: File, type: "photo" | "video") => {
  const fd = new FormData();
  fd.append("file", file);
  const url = type === "video" ? VIDEO_UPLOAD : PHOTO_UPLOAD;
  const res = await fetch(url, {
    method: "POST",
    body: fd,
    headers: getAuthHeaderForFormData(),
  });
  if (!res.ok) throw new Error("Upload failed");
  const j = await res.json();
  return j.url ?? j.data?.url ?? null;
};

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

  const [publisherName, setPublisherName] = useState("Dosen");

  useEffect(() => {
    setPublisherName(getPublisherName());
  }, []);

  const [editData, setEditData] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  const [galleryList, setGalleryList] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(GALLERY_ENDPOINT, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const data = await res.json();

      const normalized = (Array.isArray(data) ? data : []).map((g: any) => {
        const photos = g.photos ?? g.Photos ?? [];
        const videos = g.videos ?? g.Videos ?? [];
        
        return {
          id: g.id,
          title: g.title ?? "-",
          date: g.date ?? g.createdAt ?? "",
          publisher: g.publisher ?? getPublisherName(),
          status: g.status ?? "Review",
          photo: photos.length,
          video: videos.length,
          animation: [
            ...photos,
            ...videos,
          ].filter((m: any) =>
            String(m.photoUrl || m.videoUrl || m.url || "").toLowerCase().endsWith(".gif")
          ).length,
          raw: g,
        };
      });

      setGalleryList(normalized);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleSaveGallery = async (formData: any) => {
    const publisher = getPublisherName();
    let thumbnailUrl = "";

    try {
        if (formData.thumbnailFile) {
            thumbnailUrl = await uploadFile(formData.thumbnailFile, "photo");
        }
    } catch (e) {
        alert("Gagal upload thumbnail");
        return;
    }

    if (editData && editData.id) {
      await fetch(`${GALLERY_ENDPOINT}/${editData.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: formData.date,
          thumbnailUrl: thumbnailUrl || editData.raw?.thumbnailUrl,
          status: "Review",
        }),
      });

      const newFiles: File[] = formData.mediaFilesRaw ?? [];
      if (newFiles.length > 0) {
        for (const file of newFiles) {
          const isVideo = file.type.startsWith("video/");
          const uploadedUrl = await uploadFile(file, isVideo ? "video" : "photo");

          await fetch(`${API_BASE_URL}/${isVideo ? "video" : "photo"}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              title: formData.title,
              description: formData.description,
              location: formData.location,
              date: formData.date,
              publisher,
              status: "Review",
              galleryId: editData.id,
              ...(isVideo ? { videoUrl: uploadedUrl } : { photoUrl: uploadedUrl }),
            }),
          });
        }
      }
    } else {
      const files: File[] = formData.mediaFilesRaw ?? [];
      if (!files || files.length === 0) {
        alert("Please attach media.");
        return;
      }

      const res = await fetch(GALLERY_ENDPOINT, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: formData.date,
          publisher,
          thumbnailUrl,
          status: "Review",
        }),
      });

      if (!res.ok) throw new Error("Failed to create gallery");
      const gallery = await res.json();

      for (const file of files) {
        const isVideo = file.type.startsWith("video/");
        const uploadedUrl = await uploadFile(file, isVideo ? "video" : "photo");

        await fetch(`${API_BASE_URL}/${isVideo ? "video" : "photo"}`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            date: formData.date,
            publisher,
            status: "Review",
            galleryId: gallery.id,
            ...(isVideo ? { videoUrl: uploadedUrl } : { photoUrl: uploadedUrl }),
          }),
        });
      }
    }

    fetchGallery();
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDeleteMain = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;
    try {
      await fetch(`${GALLERY_ENDPOINT}/${id}`, { 
        method: "DELETE", 
        headers: getAuthHeaders() 
      });
      fetchGallery();
    } catch (err) {
      alert("Gagal menghapus gallery.");
    }
  };

  const handleEditClick = (row: any) => {
    const initial = {
      id: row.id,
      title: row.title,
      description: row.raw?.description ?? "",
      date: row.date,
      location: row.raw?.location ?? "",
      mediaTypes: [],
      mediaFiles: [
        ...(row.raw?.photos?.map((p: any) => p.photoUrl) ?? []),
        ...(row.raw?.videos?.map((v: any) => v.videoUrl) ?? []),
      ],
      thumbnailUrl: row.raw?.thumbnailUrl ?? "",
      publisher: row.publisher,
      raw: row.raw,
    };
    setEditData(initial);
    setIsFormOpen(true);
  };

  const handleToggleMute = async (id: string) => {
    const item = galleryList.find((g) => g.id === id);
    if (!item) return;
    const newStatus = item.status === "Muted" ? "Published" : "Muted"; 

    try {
      await fetch(`${GALLERY_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      fetchGallery();
    } catch (error) {
      alert("Gagal mengubah status.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    }).format(date);
  };

  const filteredData = useMemo(() => {
    let data = galleryList.filter(row => row.publisher === publisherName);
    
    const getYear = (d: string) => {
        const date = new Date(d);
        return !isNaN(date.getTime()) ? String(date.getFullYear()) : "";
    };

    if (selectedYear !== "All Year") data = data.filter((row) => getYear(row.date) === selectedYear);
    if (selectedStatus !== "All Status") data = data.filter((row) => row.status === selectedStatus);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter((row) => 
        row.title.toLowerCase().includes(lower) || 
        row.publisher.toLowerCase().includes(lower)
      );
    }

    if (selectedSort === "A-Z") data.sort((a, b) => a.title.localeCompare(b.title));
    else if (selectedSort === "Z-A") data.sort((a, b) => b.title.localeCompare(a.title));
    else if (selectedSort === "Latest") data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return data;
  }, [
    galleryList, 
    selectedYear, 
    searchTerm, 
    selectedSort, 
    selectedStatus,
    publisherName 
  ]);

  const stats = [
    { label: "Published", value: galleryList.filter(p => p.status === "Published" && p.publisher === publisherName).length, color: "border-orange-400 text-orange-500" },
    { label: "Review", value: galleryList.filter(p => p.status === "Review" && p.publisher === publisherName).length, color: "border-blue-400 text-blue-500" },
    { label: "Wait To Publish", value: galleryList.filter(p => p.status === "Waiting" && p.publisher === publisherName).length, color: "border-green-400 text-green-500" },
    { label: "Muted", value: galleryList.filter(p => p.status === "Muted" && p.publisher === publisherName).length, color: "border-red-400 text-red-500" },
  ];

  return (
    <div className="flex relative min-h-screen">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}

      <div className={`w-full p-8 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="flex items-center mb-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition">
                <Menu size={24} />
            </button>
            <h1 className="text-3xl font-bold text-orange-600">Gallery</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
                <div key={s.label} className={`border-1 rounded-lg p-4 ${s.color}`}>
                    <p className="text-sm">{s.label}</p>
                    <h2 className="text-3xl font-semibold">{s.value}</h2>
                </div>
            ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center flex-1 border border-orange-500 rounded-lg bg-white px-4 py-2 min-w-[200px]">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none text-gray-700 bg-transparent"
                />
            </div>
            <DropdownFilter label="Tahun" options={["All Year", "2025", "2024"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
            <DropdownFilter label="Urutkan" options={["A-Z", "Z-A", "Latest"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
            <DropdownFilter label="Status" options={["All Status", "Published", "Review", "Muted", "Waiting", "Rejected"]} currentFilter={selectedStatus} onSelect={setSelectedStatus} />
            <button
                onClick={() => { setIsFormOpen(true); setEditData(null); }}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                <Plus size={18} /> Add Gallery
            </button>
        </div>

        <div className="border border-orange-500 rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
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
                    {filteredData.length === 0 ? (
                        <tr><td colSpan={8} className="py-8 text-center text-gray-500">No data found.</td></tr>
                    ) : (
                        filteredData.map((row) => (
                            <tr key={row.id} className="border-b border-gray-200">
                                <td className="py-3 text-center">{row.title}</td>
                                <td className="py-3 text-center">{row.photo}</td>
                                <td className="py-3 text-center">{row.video}</td>
                                <td className="py-3 text-center">{row.animation}</td>
                                <td className="py-3 text-center">{formatDate(row.date)}</td>
                                <td className="py-3 text-center">{row.publisher}</td>
                                <td className="py-3 text-center"><TableStatus status={row.status} /></td>
                                <td className="py-3 text-center">
                                    <TableAction
                                        status={row.status}
                                        onToggleMute={() => handleToggleMute(row.id)}
                                        onEdit={() => handleEditClick(row)}
                                        onDelete={() => handleDeleteMain(row.id)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            </div>
        </div>

        {isFormOpen && (
            <GalleryForm
                onClose={() => { setIsFormOpen(false); setEditData(null); }}
                onSubmit={handleSaveGallery}
                initialData={editData ? {
                    title: editData.title || "",
                    description: editData.description || "",
                    date: editData.date || "",
                    location: editData.location || "",
                    mediaTypes: editData.mediaTypes || [],
                    mediaFiles: editData.mediaFiles || [],
                    thumbnailUrl: editData.thumbnailUrl || "",
                    publisher: editData.publisher || "",
                } : undefined}
            />
        )}
      </div>
    </div>
  );
}