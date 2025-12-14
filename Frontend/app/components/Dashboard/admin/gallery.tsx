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
const PHOTO_ENDPOINT = `${API_BASE_URL}/photo`;
const VIDEO_ENDPOINT = `${API_BASE_URL}/video`;
const PHOTO_UPLOAD = `${PHOTO_ENDPOINT}/upload`;
const VIDEO_UPLOAD = `${VIDEO_ENDPOINT}/upload`;

const normalizePhoto = (p: any) => ({
  id: p.id,
  type: "photo" as const,
  title: p.title ?? "-",
  publisher: p.publisher ?? "-",
  status: p.status ?? "Review",
  category: p.category ?? "-",
  date: p.date ?? p.createdAt ?? "",
  isAnimation:
    (p.photoUrl && String(p.photoUrl).toLowerCase().endsWith(".gif")) ||
    (p.media_url && String(p.media_url).toLowerCase().endsWith(".gif")),
  raw: p,
});

const normalizeVideo = (v: any) => ({
  id: v.id,
  type: "video" as const,
  title: v.title ?? "-",
  publisher: v.publisher ?? "-",
  status: v.status ?? "Review",
  category: "-", 
  date: v.date ?? v.createdAt ?? "",
  isAnimation: false,
  raw: v,
});

const STATUS_PRIORITY: Record<string, number> = {
  Rejected: -1,
  Muted: 0,
  Waiting: 1,
  Review: 2,
  Published: 3,
};

const pickBetterStatus = (cur?: string, inc?: string) => {
  if (!cur) return inc;
  if (!inc) return cur;
  return (STATUS_PRIORITY[inc] ?? 0) > (STATUS_PRIORITY[cur] ?? 0) ? inc : cur;
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

  const makeGroupKey = (raw: any) => {
    if (!raw) return "unknown";
    const gid = raw.gallery_id ?? raw.groupId ?? raw.galleryId ?? null;
    if (gid) return `gid:${String(gid)}`;
    return `${String(raw.title ?? raw.name ?? "").trim()}|${String(raw.publisher ?? "").trim()}`;
  };

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch(PHOTO_ENDPOINT, { headers: getAuthHeaders() }),
        fetch(VIDEO_ENDPOINT, { headers: getAuthHeaders() }),
      ]);

      if (!r1.ok || !r2.ok) throw new Error("Gagal mengambil data dari server");

      const [photosJson, videosJson] = await Promise.all([r1.json(), r2.json()]);
      const photos = Array.isArray(photosJson) ? photosJson.map(normalizePhoto) : [];
      const videos = Array.isArray(videosJson) ? videosJson.map(normalizeVideo) : [];

      const all = [...photos, ...videos];
      const grouped = new Map<string, any>();

      all.forEach((item) => {
        const key = makeGroupKey(item.raw);
        const existing = grouped.get(key);
        if (!existing) {
          grouped.set(key, {
            groupKey: key,
            title: item.title ?? "-",
            photo: item.type === "photo" ? 1 : 0,
            video: item.type === "video" ? 1 : 0,
            animation: item.isAnimation ? 1 : 0,
            date: item.date,
            publisher: item.publisher ?? "-",
            status: item.status ?? "Review",
            members: [{ id: item.id, type: item.type, raw: item.raw }],
          });
        } else {
          if (item.type === "photo") existing.photo++;
          if (item.type === "video") existing.video++;
          if (item.isAnimation) existing.animation++;
          
          try {
            const oldD = new Date(existing.date ?? 0);
            const newD = new Date(item.date ?? 0);
            if (!isNaN(newD.getTime()) && newD > oldD) existing.date = item.date;
          } catch {}

          existing.status = pickBetterStatus(existing.status, item.status) ?? existing.status;
          existing.members.push({ id: item.id, type: item.type, raw: item.raw });
        }
      });

      const aggregated = Array.from(grouped.values()).sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );

      const pendingItems = aggregated.filter(item => item.status === "Waiting" || item.status === "Review");
      
      setPending(pendingItems);
      setGalleryList(aggregated);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);


  const updateMemberStatus = async (item: any, newStatus: string) => {
    try {
      const members = item.members ?? [];
      for (const m of members) {
        const endpoint = m.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;
        await fetch(`${endpoint}/${m.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        });
      }
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
      updateMemberStatus(item, newStatus);
    }
  };

  const handleReject = (item: any) => {
    if (window.confirm(`Reject submission "${item.title}"? Status will be set to Rejected.`)) {
      updateMemberStatus(item, "Rejected");
    }
  };

  const handleToggleMute = (groupKey: string) => {
    const group = galleryList.find((g) => g.groupKey === groupKey);
    if (!group) return;

    const newStatus = group.status === "Muted" ? "Published" : "Muted";
    updateMemberStatus(group, newStatus);
  };

  const handleDeleteMain = async (groupKey: string) => {
    const group = galleryList.find((g) => g.groupKey === groupKey);
    if (!group) return;
    if (!window.confirm("Are you sure you want to delete this gallery permanently?")) return;

    try {
      const members = group.members ?? [];
      for (const m of members) {
        const endpoint = m.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;
        await fetch(`${endpoint}/${m.id}`, { method: "DELETE", headers: getAuthHeaders() });
      }
      fetchGallery();
    } catch (err) {
      alert("Gagal menghapus gallery.");
    }
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

  const handleSaveGallery = async (formData: any) => {
  const publisher = getPublisherName();
  let finalCoverUrl = "";

  if (formData.thumbnailFile) {
    try {
      finalCoverUrl = await uploadFile(formData.thumbnailFile, "photo");
    } catch (e) {
      alert("Gagal upload thumbnail");
      return;
    }
  }

  if (editData && editData.groupKey) {
    const group = galleryList.find((g) => g.groupKey === editData.groupKey);
    if (!group) return;

    const coverUrlForUpdate = finalCoverUrl || editData.thumbnailUrl;

    const desiredUrls = new Set(formData.mediaFiles);

    for (const m of group.members) {
      const endpoint = m.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;

      const currentUrl = m.type === "video"
        ? (m.raw.videoUrl || m.raw.url)
        : (m.raw.photoUrl || m.raw.url);

      if (currentUrl && !desiredUrls.has(currentUrl)) {
        await fetch(`${endpoint}/${m.id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
      } else {
        const payload: any = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: formData.date,
          publisher,
          status: "Review", 
          cover_url: coverUrlForUpdate || undefined,
        };

        Object.keys(payload).forEach(
          (k) => payload[k] === undefined && delete payload[k]
        );

        await fetch(`${endpoint}/${m.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }
    }

    const newFiles: File[] = formData.mediaFilesRaw ?? [];
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const isVideo = file.type.startsWith("video/");
        const uploadedUrl = await uploadFile(file, isVideo ? "video" : "photo");
        const endpoint = isVideo ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;

        const payload: any = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: formData.date,
          publisher,
          status: "Review", 
          cover_url: coverUrlForUpdate || uploadedUrl,
        };

        if (isVideo) payload.videoUrl = uploadedUrl;
        else payload.photoUrl = uploadedUrl;

        await fetch(endpoint, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }
    }

  } else {
    const files: File[] = formData.mediaFilesRaw ?? [];
    if (!files || files.length === 0) {
      alert("Please attach media.");
      return;
    }

    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      const uploadedUrl = await uploadFile(file, isVideo ? "video" : "photo");
      const endpoint = isVideo ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;

      const payload: any = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        publisher,
        status: "Review",
        cover_url: finalCoverUrl || uploadedUrl,
      };

      if (isVideo) payload.videoUrl = uploadedUrl;
      else payload.photoUrl = uploadedUrl;

      await fetch(endpoint, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
    }
  }

  fetchGallery();
  setIsFormOpen(false);
  setEditData(null);
};

  const handleEditClick = (groupKey: string) => {
    const group = galleryList.find((g) => g.groupKey === groupKey);
    if (!group) return;

    const rep = group.members[0]?.raw;
    const initial = {
      groupKey,
      title: group.title,
      description: rep?.description ?? "",
      date: group.date,
      location: rep?.location ?? "",
      mediaTypes: [],
      mediaFiles: group.members.map((m: any) => m.raw.photoUrl || m.raw.videoUrl),
      thumbnailUrl: rep?.cover_url ?? rep?.coverUrl ?? rep?.thumbnailUrl ?? "",
    };
    setEditData(initial);
    setIsFormOpen(true);
  };

  const handlePreview = (item: any) => {
    const files = item.members.map((m: any) => 
       m.raw.photoUrl || m.raw.videoUrl || m.raw.url
    ).filter((url: any) => url);

    if (files.length === 0) { alert("No files"); return; }

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
                        filteredData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-200">
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
                                        onToggleMute={() => handleToggleMute(row.groupKey)}
                                        onEdit={() => handleEditClick(row.groupKey)}
                                        onDelete={() => handleDeleteMain(row.groupKey)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        {/* PENDING / SUBMISSIONS */}
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
                                    <tr key={item.groupKey} className="border-b border-gray-200">
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