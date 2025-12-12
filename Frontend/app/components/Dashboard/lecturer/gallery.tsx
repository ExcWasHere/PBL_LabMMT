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

/**
 * Map raw photo/video items into a normalized internal shape.
 * We keep `raw` so we can reference original fields (e.g. id, media type).
 */
const normalizePhoto = (p: any) => ({
  id: p.id,
  type: "photo" as const,
  title: p.title ?? "-",
  publisher: p.publisher ?? "-",
  status: p.status ?? "Review",
  date: p.date ?? p.createdAt ?? p.created_at ?? "",
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
  date: v.date ?? v.createdAt ?? v.created_at ?? "",
  isAnimation: false,
  raw: v,
});

const STATUS_PRIORITY: Record<string, number> = {
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

  // Utility to create a stable group key: prefer gallery_id if present, else title|publisher
  const makeGroupKey = (raw: any) => {
    if (!raw) return "unknown";
    const gid = raw.gallery_id ?? raw.groupId ?? raw.galleryId ?? null;
    if (gid) return `gid:${String(gid)}`;
    return `${String(raw.title ?? raw.name ?? "").trim()}|${String(raw.publisher ?? "").trim()}`;
  };

  /**
   * fetchGallery: fetch photo & video endpoints, normalize, group by groupKey,
   * then produce aggregated group rows that include `members` (array of original items).
   */
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

      const [photosJson, videosJson] = await Promise.all([r1.json(), r2.json()]);
      const photos = Array.isArray(photosJson) ? photosJson.map(normalizePhoto) : [];
      const videos = Array.isArray(videosJson) ? videosJson.map(normalizeVideo) : [];

      const all = [...photos, ...videos];

      const grouped = new Map<
        string,
        {
          groupKey: string;
          title: string;
          photo: number;
          video: number;
          animation: number;
          date?: string;
          publisher: string;
          status: string;
          members: Array<{ id: any; type: string; raw: any }>;
        }
      >();

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
          // increment counts
          if (item.type === "photo") existing.photo++;
          if (item.type === "video") existing.video++;
          if (item.isAnimation) existing.animation++;

          // choose latest date
          try {
            const oldD = new Date(existing.date ?? 0);
            const newD = new Date(item.date ?? 0);
            if (!isNaN(newD.getTime()) && newD > oldD) existing.date = item.date;
          } catch {}

          // choose best status
          existing.status = pickBetterStatus(existing.status, item.status) ?? existing.status;

          // push member
          existing.members.push({ id: item.id, type: item.type, raw: item.raw });
        }
      });

      const aggregated = Array.from(grouped.values()).sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );

      setGalleryList(aggregated);
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

  /**
   * Helper: call delete for each member in the group.
   * Uses correct endpoint per type.
   */
  const deleteGroup = async (group: any) => {
    const members: Array<{ id: any; type: string }> = group.members ?? [];
    for (const m of members) {
      const endpoint = m.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;
      const res = await fetch(`${endpoint}/${m.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Delete failed for ${m.id} (${m.type}): ${res.status} ${t}`);
      }
    }
  };

  const handleDelete = async (groupKey: string) => {
    const group = galleryList.find((g) => g.groupKey === groupKey);
    if (!group) return;
    if (!window.confirm("Are you sure you want to delete this gallery group? This will delete all files in the group.")) return;

    try {
      await deleteGroup(group);
      await fetchGallery();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Gagal menghapus gallery group. Cek console.");
    }
  };

  /**
   * Toggle mute will flip between Muted and Published for whole group.
   * It PATCHes all member records.
   */
  const handleToggleMute = async (groupKey: string) => {
    const group = galleryList.find((g) => g.groupKey === groupKey);
    if (!group) return;

    const newStatus = group.status === "Muted" ? "Published" : "Muted";
    try {
      const members: Array<{ id: any; type: string }> = group.members ?? [];
      for (const m of members) {
        const endpoint = m.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;
        const res = await fetch(`${endpoint}/${m.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(`Toggle failed for ${m.id}: ${res.status} ${t}`);
        }
      }
      await fetchGallery();
    } catch (err) {
      console.error("Failed to toggle mute:", err);
      alert("Gagal mengubah status gallery group.");
    }
  };

  /**
   * Format date similarly to before
   */
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

  /**
   * Upload helper unchanged
   */
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

  /**
   * Save gallery:
   * - If editData exists and contains groupKey -> we PATCH all member records in that group
   * - Otherwise we create new records (one per file) like before
   */
  const handleSaveGallery = async (formData: any) => {
    // formData expected: { title, description, location, date, thumbnailFile?, mediaFilesRaw: File[] }
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
      // If editing an existing group -> PATCH all members
      if (editData && editData.groupKey) {
        const group = galleryList.find((g) => g.groupKey === editData.groupKey);
        if (!group) {
          alert("Group not found for edit.");
          return;
        }

        const members = group.members ?? [];
        // For each member, PATCH with new fields
        for (const m of members) {
          const endpoint = m.type === "video" ? VIDEO_ENDPOINT : PHOTO_ENDPOINT;
          // We only update the shared metadata fields. We will not overwrite media urls here.
          const payload: any = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            date: formData.date,
            publisher,
            status: formData.status ?? group.status ?? "Review",
            cover_url: coverUrl || undefined,
          };
          // remove undefined keys
          Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
          const res = await fetch(`${endpoint}/${m.id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`Update failed for ${m.id}: ${res.status} ${t}`);
          }
        }
      } else {
        // creating new gallery: upload each file and create one record per file (same as before)
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
      }

      await fetchGallery();
      setIsFormOpen(false);
      setEditData(null);
    } catch (err) {
      console.error("Failed to save gallery:", err);
      alert("Gagal menyimpan gallery. Cek console untuk detail.");
    }
  };

  /**
   * Edit click now opens form with aggregated data
   * For initial data we provide:
   *  - title, description (if found in any member raw), date, location, mediaTypes summary, thumbnailUrl (if any)
   *  - and store groupKey in editData so handleSaveGallery knows it's an edit
   */
  const handleEditClick = (groupKey: string) => {
    const group = galleryList.find((g) => g.groupKey === groupKey);
    if (!group) return;

    // try to pick representative raw data from first member
    const rep = group.members && group.members[0] && group.members[0].raw;
    const initial = {
      groupKey,
      title: group.title || (rep && (rep.title ?? rep.name)) || "",
      description: rep?.description ?? "",
      date: group.date ?? rep?.date ?? "",
      location: rep?.location ?? "",
      mediaTypes: [], // optional
      mediaFiles: group.members.map((m: any) => m.raw),
      thumbnailUrl: rep?.cover_url ?? rep?.coverUrl ?? rep?.thumbnailUrl ?? "",
    };

    setEditData(initial);
    setIsFormOpen(true);
  };

  /**
   * Delete handler wrapper for TableAction which now passes groupKey
   */
  const handleDeleteWrapper = (groupKey: string) => {
    handleDelete(groupKey);
  };

  /**
   * Toggle mute wrapper for TableAction
   */
  const handleToggleMuteWrapper = (groupKey: string) => {
    handleToggleMute(groupKey);
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
            onClick={() => {
              setIsFormOpen(true);
              setEditData(null);
            }}
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
                    <tr key={row.groupKey ?? index}>
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
                          onToggleMute={() => handleToggleMuteWrapper(row.groupKey)}
                          onEdit={() => handleEditClick(row.groupKey)}
                          onDelete={() => handleDeleteWrapper(row.groupKey)}
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
                    // editData has groupKey and representative fields
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
