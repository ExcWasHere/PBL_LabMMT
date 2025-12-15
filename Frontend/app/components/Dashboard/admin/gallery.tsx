import Sidebar from "~/components/Dashboard/admin/sidebar";
import { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Menu, Plus, Check, X, 
  Image as ImageIcon, 
  ChevronLeft, ChevronRight 
} from "lucide-react";
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
    const raw = localStorage.getItem("user");
    if (!raw) return "Admin";
    const parsed = JSON.parse(raw);
    return parsed.name ?? parsed.fullname ?? parsed.username ?? "Admin";
  } catch { return "Admin"; }
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

  const [editData, setEditData] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  const [galleryList, setGalleryList] = useState<any[]>([]); 
  const [pending, setPending] = useState<any[]>([]); 
  const [showPending, setShowPending] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(GALLERY_ENDPOINT, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const data = await res.json();

      console.log("🔍 Gallery API Response:", data); 

      const normalized = (Array.isArray(data) ? data : []).map((g: any) => {
        // Handle berbagai kemungkinan struktur data
        const photos = g.photos ?? g.Photos ?? [];
        const videos = g.videos ?? g.Videos ?? [];
        
        console.log("📸 Gallery item:", { 
          id: g.id, 
          title: g.title, 
          photos, 
          videos,
          raw: g 
        }); // DEBUG

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

      console.log("✅ Normalized data:", normalized); 

      setGalleryList(normalized);
      setPending(normalized.filter((i: any) => i.status === "Review"));
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`${GALLERY_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchGallery();
    } catch (error) {
      console.error("Update status failed", error);
      alert("Gagal update status.");
    }
  };

  const handleApprove = (item: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateStr = item.date || new Date().toISOString(); 
    const itemDate = new Date(dateStr);
    itemDate.setHours(0, 0, 0, 0);

    let newStatus = "Published";
    let message = `Approve submission "${item.title}"? It will be Published immediately.`;

    if (itemDate > today) {
      newStatus = "Waiting";
      message = `The publish date is ${formatDate(dateStr)}. The gallery will be set to "Waiting" (Scheduled). Continue?`;
    }

    if (window.confirm(message)) {
      updateStatus(item.id, newStatus);
    }
  };

  const handleReject = (item: any) => {
    if (window.confirm(`Reject submission "${item.title}"? Status will be set to Rejected.`)) {
      updateStatus(item.id, "Rejected");
    }
  };

  const handleToggleMute = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Muted" ? "Published" : "Muted";
    updateStatus(id, newStatus);
  };

  const handleDeleteMain = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gallery permanently?")) return;

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

  const handleSaveGallery = async (formData: any) => {
    const publisher = getPublisherName();
    let thumbnailUrl = "";

    try {
        if (formData.thumbnailFile) {
            try {
                thumbnailUrl = await uploadFile(formData.thumbnailFile, "photo");
            } catch (e) {
                alert("Gagal upload thumbnail, periksa koneksi atau ukuran file.");
                return;
            }
        }

        const mediaTypesToSend = formData.mediaTypes || []; 

        if (editData && editData.id) {
          const res = await fetch(`${GALLERY_ENDPOINT}/${editData.id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              title: formData.title,
              description: formData.description,
              location: formData.location,
              date: formData.date,
              thumbnailUrl: thumbnailUrl || editData.raw?.thumbnailUrl,
              status: "Review",
              media_types: mediaTypesToSend, 
            }),
          });
          
          if (!res.ok) throw new Error("Gagal mengupdate gallery");

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
              media_types: mediaTypesToSend, 
            }),
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.message || "Gagal membuat gallery");
          }

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

        await fetchGallery();
        setIsFormOpen(false);
        setEditData(null);

    } catch (error: any) {
        console.error("Error saving gallery:", error);
        alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleEditClick = (id: string) => {
    const gallery = galleryList.find((g) => g.id === id);
    if (!gallery) return;

    const initial = {
      id: gallery.id,
      title: gallery.title,
      description: gallery.raw?.description ?? "",
      date: gallery.date,
      location: gallery.raw?.location ?? "",
      mediaTypes: gallery.raw?.media_types || gallery.raw?.mediaTypes || [],
      mediaFiles: [
        ...(gallery.raw?.photos?.map((p: any) => p.photoUrl) ?? []),
        ...(gallery.raw?.videos?.map((v: any) => v.videoUrl) ?? []),
      ],
      thumbnailUrl: gallery.raw?.thumbnailUrl ?? "",
      raw: gallery.raw,
    };
    setEditData(initial);
    setIsFormOpen(true);
  };

  const handlePreview = (item: any) => {
    console.log("Preview item:", item); 
    
    const photos = item.raw?.photos ?? item.raw?.Photos ?? [];
    const videos = item.raw?.videos ?? item.raw?.Videos ?? [];
    
    const files = [
      ...photos.map((p: any) => p.photoUrl || p.url),
      ...videos.map((v: any) => v.videoUrl || v.url),
    ].filter((url: any) => url);

    console.log("Preview files:", files); 

    if (files.length === 0) { 
      alert("No files to preview"); 
      return; 
    }

    setPreviewFiles(files);
    setPreviewIndex(0);
    setIsPreviewOpen(true);
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
    let data = [...galleryList];
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
  }, [galleryList, selectedYear, searchTerm, selectedSort, selectedStatus]);

  const stats = [
    { label: "Published", value: galleryList.filter(p => p.status === "Published").length, color: "border-orange-400 text-orange-500" },
    { label: "Review", value: galleryList.filter(p => p.status === "Review").length, color: "border-blue-400 text-blue-500" },
    { label: "Wait To Publish", value: galleryList.filter(p => p.status === "Waiting").length, color: "border-green-400 text-green-500" },
    { label: "Muted", value: galleryList.filter(p => p.status === "Muted").length, color: "border-red-400 text-red-500" },
  ];

  return (
    <div className="flex relative min-h-screen">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}

      <div className={`w-full p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
                                        onToggleMute={() => handleToggleMute(row.id, row.status)}
                                        onEdit={() => handleEditClick(row.id)}
                                        onDelete={() => handleDeleteMain(row.id)}
                                    />
                                </td>
                            </tr>
                        ))
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
                    <h3 className="text-lg font-semibold mr-3">Gallery Submissions</h3>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">{pending.length} New</span>
                </div>
                <ChevronLeft className={`transform transition-transform ${showPending ? "-rotate-90" : "rotate-0"}`} />
            </button>

            {showPending && (
                <div className="mt-4 border border-orange-500 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="py-3">Title</th>
                                <th className="py-3">Photo</th>
                                <th className="py-3">Video</th>
                                <th className="py-3">Animation</th>
                                <th className="py-3">Submitted By</th>
                                <th className="py-3">Date</th>
                                <th className="py-3">Files</th>
                                <th className="py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pending.length === 0 ? (
                                <tr><td colSpan={8} className="py-6 text-center text-gray-500">No pending submissions.</td></tr>
                            ) : (
                                pending.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200">
                                        <td className="py-3 text-center">{item.title}</td>
                                        <td className="py-3 text-center">{item.photo}</td>
                                        <td className="py-3 text-center">{item.video}</td>
                                        <td className="py-3 text-center">{item.animation}</td>
                                        <td className="py-3 text-center font-medium">{item.publisher}</td>
                                        <td className="py-3 text-center">{formatDate(item.date)}</td>
                                        <td className="py-3 text-center">
                                            <div className="flex justify-center cursor-pointer" onClick={() => handlePreview(item)}>
                                                <div title="View Files" className="p-1 hover:bg-gray-100 rounded">
                                                    <ImageIcon size={20} className="text-blue-600" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => handleApprove(item)} className="text-green-600 hover:text-green-800" title="Approve">
                                                    <Check size={20} />
                                                </button>
                                                <button onClick={() => handleReject(item)} className="text-red-600 hover:text-red-800" title="Reject">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
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

        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsPreviewOpen(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] p-4 z-10 flex flex-col">
              <button onClick={() => setIsPreviewOpen(false)} className="absolute top-4 right-4 text-black hover:bg-gray-200 rounded-full p-2 transition z-50">
                <X size={28} />
              </button>
              <div className="relative flex items-center justify-center flex-1 overflow-hidden bg-gray-100 rounded-xl mt-10">
                {previewFiles.length > 0 && (
                   (() => {
                     const url = previewFiles[previewIndex];
                     const isVideo = url.toLowerCase().match(/\.(mp4|webm|mov)$/);
                     return isVideo 
                        ? <video src={url} controls className="max-h-full max-w-full object-contain" />
                        : <img src={url} alt="preview" className="max-h-full max-w-full object-contain" />;
                   })()
                )}
              </div>
              {previewFiles.length > 1 && (
                <div className="flex justify-center items-center gap-6 mt-4">
                  <button onClick={(e) => { e.stopPropagation(); setPreviewIndex((p) => p === 0 ? previewFiles.length - 1 : p - 1); }} className="p-3 rounded-full hover:bg-orange-100 text-black">
                    <ChevronLeft size={32} />
                  </button>
                  <div className="text-xl font-semibold text-gray-700">{previewIndex + 1} / {previewFiles.length}</div>
                  <button onClick={(e) => { e.stopPropagation(); setPreviewIndex((p) => p === previewFiles.length - 1 ? 0 : p + 1); }} className="p-3 rounded-full hover:bg-orange-100 text-black">
                    <ChevronRight size={32} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}