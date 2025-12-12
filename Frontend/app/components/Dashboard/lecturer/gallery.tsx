import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Menu, Plus } from "lucide-react";
import GalleryForm from "~/common/gallery-form";
import DropdownFilter from "~/common/dropdown-filter";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";
const API_BASE_URL = "http://localhost:3000";
const PHOTO_ENDPOINT = `${API_BASE_URL}/photo`;
const VIDEO_ENDPOINT = `${API_BASE_URL}/video`;
const PHOTO_UPLOAD = `${PHOTO_ENDPOINT}/upload`;
const VIDEO_UPLOAD = `${VIDEO_ENDPOINT}/upload`;

const mapPhotoToGalleryRow = (p: any) => ({
  id: p.id,
  title: p.title ?? "-",
  photo: (p.media_type === "photo" || (p.photoUrl && String(p.photoUrl).match(/\.(jpg|jpeg|png|gif)$/i)) || (p.media_url && String(p.media_url).match(/\.(jpg|jpeg|png|gif)$/i))) ? "1" : "0",
  video: (p.media_type === "video" || (p.videoUrl && String(p.videoUrl).match(/\.(mp4|webm|ogg|mov)$/i)) || (p.media_url && String(p.media_url).match(/\.(mp4|webm|ogg|mov)$/i))) ? "1" : "0",
  animation: (p.photoUrl && String(p.photoUrl).endsWith?.(".gif")) || (p.media_url && String(p.media_url).endsWith?.(".gif")) ? "1" : "0",
  date: p.date ?? p.year ?? p.createdAt ?? p.created_at ?? "",
  publisher: p.publisher ?? "-",
  status: p.status ?? "Review",
  mediaFiles: p.media_urls ?? (p.mediaUrls ?? (p.media_url ? [p.media_url] : (p.mediaUrl ? [p.mediaUrl] : (p.photoUrl ? [p.photoUrl] : (p.videoUrl ? [p.videoUrl] : []))))),
  mediaFilesRaw: undefined,
  thumbnailUrl: p.cover_url ?? p.coverUrl ?? p.thumbnailUrl ?? "",
  _raw: p,
  type: p.media_type ?? (p.media_url && p.media_url.match(/\.(mp4|webm|ogg)$/i) ? "video" : (p.photoUrl || p.media_url && p.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? "photo" : "photo")),
});

const mapVideoToGalleryRow = (v: any) => ({
  id: v.id,
  title: v.title ?? "-",
  photo: v.media_type === "photo" ? "1" : (v.photoUrl ? "1" : "0"),
  video: v.media_type === "video" ? "1" : (v.videoUrl ? "1" : "0"),
  animation: (v.media_url && v.media_url.endsWith?.(".gif")) ? "1" : "0",
  date: v.date ?? v.year ?? v.createdAt ?? v.created_at ?? "",
  publisher: v.publisher ?? "-",
  status: v.status ?? "Review",
  mediaFiles: v.media_urls ?? (v.mediaUrls ?? (v.media_url ? [v.media_url] : (v.mediaUrl ? [v.mediaUrl] : (v.videoUrl ? [v.videoUrl] : [])))),
  mediaFilesRaw: undefined,
  thumbnailUrl: v.cover_url ?? v.coverUrl ?? v.thumbnailUrl ?? "",
  _raw: v,
  type: v.media_type ?? (v.media_url && v.media_url.match(/\.(mp4|webm|ogg)$/i) ? "video" : "video"),
});

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

  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
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
      if (!raw) return "LabHead";
      const parsed = JSON.parse(raw);
      return parsed.name ?? parsed.fullname ?? parsed.username ?? "LabHead";
    } catch {
      return "LabHead";
    }
  };

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch(PHOTO_ENDPOINT, { headers: getAuthHeaders() }),
        fetch(VIDEO_ENDPOINT, { headers: getAuthHeaders() }),
      ]);

      if (!r1.ok || !r2.ok) {
        const t1 = await r1.text().catch(() => "");
        const t2 = await r2.text().catch(() => "");
        throw new Error(`Fetch error: photo(${r1.status}) ${t1} / video(${r2.status}) ${t2}`);
      }

      const [photos, videos] = await Promise.all([r1.json(), r2.json()]);

      const mappedPhotos = Array.isArray(photos) ? photos.map(mapPhotoToGalleryRow) : [];
      const mappedVideos = Array.isArray(videos) ? videos.map(mapVideoToGalleryRow) : [];

      const combined = [...mappedPhotos, ...mappedVideos].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setGalleryList(combined);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
      setError("Gagal memuat gallery.");
      setGalleryList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

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

  const handleToggleMute = async (id: string | number) => {
    const item = galleryList.find((g) => g.id === id);
    if (!item) return;

    const newStatus = item.status === "Muted" ? "Published" : "Muted";
    const endpoint = item.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Toggle failed: ${res.status} ${text}`);
      }
      await fetchGallery();
    } catch (err) {
      console.error("Failed to toggle mute:", err);
      alert("Gagal mengubah status gallery.");
    }
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
      const d = new Date(dateString);
      if (!isNaN(d.getTime())) return String(d.getFullYear());
      const parts = String(dateString ?? "").trim().split(" ");
      return parts[parts.length - 1];
    };

    if (selectedYear !== "All Year") {
      data = data.filter((row) => getYearFromString(row.date) === selectedYear);
    }

    if (searchTerm) {
      const lowerCaseQuery = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          String(row.title).toLowerCase().includes(lowerCaseQuery) ||
          String(row.publisher).toLowerCase().includes(lowerCaseQuery)
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

  const uploadFile = async (file: File, type: "photo" | "video") => {
    const fd = new FormData();
    fd.append("file", file);
    const url = type === "video" ? VIDEO_UPLOAD : PHOTO_UPLOAD;
    const formHeaders = getAuthHeaderForFormData();
    const res = await fetch(url, {
      method: "POST",
      body: fd,
      headers: formHeaders,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Upload failed (${res.status}): ${txt}`);
    }
    const j = await res.json();
    return j.url ?? j.media_url ?? j.data?.url ?? j.uploadedUrl ?? null;
  };

  const handleSaveGallery = async (formData: any) => {
    const publisher = getPublisherName();
    let coverUrl = "";
    try {
      if (formData.thumbnailFile) {
        coverUrl = await uploadFile(formData.thumbnailFile, "photo");
      }
    } catch (err) {
      console.error("Thumbnail upload failed", err);
      alert("Gagal upload thumbnail.");
      return;
    }

    const files: File[] = formData.mediaFilesRaw ?? [];
    if (!files || files.length === 0) {
      alert("Please attach at least one media file.");
      return;
    }

    try {
      for (const file of files) {
        const isVideo = file.type.startsWith("video/");
        const uploadedUrl = await uploadFile(file, isVideo ? "video" : "photo");
        if (!uploadedUrl) {
          throw new Error("Upload returned no url");
        }

        const endpoint = isVideo ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;
        const payload: any = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: formData.date,
          publisher,
          status: "Review",
          cover_url: coverUrl || uploadedUrl,
        };

        if (isVideo) {
          payload.videoUrl = uploadedUrl;
        } else {
          payload.photoUrl = uploadedUrl;
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Create record failed: ${res.status} ${text}`);
        }
      }
      await fetchGallery();
      setIsFormOpen(false);
      setEditData(null);
    } catch (err) {
      console.error("Failed to save gallery:", err);
      alert("Gagal menyimpan gallery. Cek console untuk detail.");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;

    const item = galleryList.find((g) => g.id === id);
    if (!item) return;

    const endpoint = item.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Delete failed: ${res.status} ${text}`);
      }
      await fetchGallery();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Gagal menghapus gallery.");
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
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">Loading gallery...</td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-red-500">{error}</td>
                  </tr>
                )}

                {!isLoading && !error && filteredData.map((row, index) => {
                  const isLastRow = index === filteredData.length - 1;
                  const borderClass = isLastRow ? "" : "border-b border-gray-200";

                  return (
                    <tr key={row.id ?? index}>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>{row.title}</td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>{row.photo}</td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>{row.video}</td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>{row.animation}</td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>{formatDate(row.date)}</td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>{row.publisher}</td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}><TableStatus status={row.status} /></td>
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

                {!isLoading && !error && filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">No matching data found.</td>
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