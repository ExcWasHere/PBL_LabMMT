import Sidebar from "~/components/Dashboard/admin/sidebar";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Menu, Plus, Link as LinkIcon, Check, X as XIcon } from "lucide-react";
import DropdownFilter from "~/common/dropdown-filter";
import ProjectForm, { type ProjectData } from "~/common/project-form";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";

const API_BASE_URL = "http://localhost:3000";
const PROJECT_ENDPOINT = `${API_BASE_URL}/project`;
const UPLOAD_ENDPOINT = `${API_BASE_URL}/upload`;

const mapApiToProject = (p: any) => ({
  id: String(p.id),
  title: p.title ?? p.name ?? "-",
  category: p.kategori ?? p.category ?? p.type ?? "-",
  date: p.year ?? p.date ?? p.createdAt ?? "",
  publisher: p.publisher ?? "-",
  stars: typeof p.stars === "number" ? String(p.stars) : (p.stars ?? "0"),
  status: p.status ?? "Review",
  description: p.description ?? "",
  tech: p.tech ?? "",
  teamMembers: Array.isArray(p.teamMembers)
    ? p.teamMembers
    : p.teamMembers
      ? [p.teamMembers]
      : [],
  githubLink: p.githubLink ?? p.repo ?? "",
  demoLink: p.demoLink ?? p.demo ?? "",
  thumbnailUrl: p.thumbnailUrl ?? "",
  mediaUrls: Array.isArray(p.mediaUrls)
    ? p.mediaUrls
    : p.mediaUrls
      ? [p.mediaUrls]
      : [],
  raw: p,
});

const getAuthHeaders = (json = true) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export default function ProjectPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [projects, setProjects] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showPending, setShowPending] = useState(false);

  const [publisherName, setPublisherName] = useState("Admin");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setPublisherName(u.name ?? u.fullname ?? u.username ?? "Admin");
      }
    } catch {}
  }, []);

  const stats = [
    {
      label: "Published",
      value: projects.filter((p) => p.status === "Published").length,
      color: "border-orange-400 text-orange-500",
    },
    {
      label: "Review",
      value: projects.filter((p) => p.status === "Review").length,
      color: "border-blue-400 text-blue-500",
    },
    {
      label: "Wait To Publish",
      value: projects.filter((p) => p.status === "Waiting").length,
      color: "border-green-400 text-green-500",
    },
    {
      label: "Muted",
      value: projects.filter((p) => p.status === "Muted").length,
      color: "border-red-400 text-red-500",
    },
  ];

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(PROJECT_ENDPOINT, {
        headers: getAuthHeaders(true),
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map(mapApiToProject);
      setProjects(mapped);
      try {
        const pendRes = await fetch(`${PROJECT_ENDPOINT}/pending`, {
          headers: getAuthHeaders(true),
        });
        if (pendRes.ok) {
          const pend = await pendRes.json();
          setPending(Array.isArray(pend) ? pend.map(mapApiToProject) : []);
        } else {
          setPending(
            mapped.filter(
              (p) => p.status === "Waiting" || p.status === "Review"
            )
          );
        }
      } catch {
        setPending(
          mapped.filter((p) => p.status === "Waiting" || p.status === "Review")
        );
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data project.");
      setProjects([]);
      setPending([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const filteredData = useMemo(() => {
    let data = [...projects];
    const getYearFromString = (dateString: string) => {
      const d = new Date(dateString);
      if (!isNaN(d.getTime())) return String(d.getFullYear());
      const parts = String(dateString ?? "")
        .trim()
        .split(" ");
      return parts[parts.length - 1] ?? "";
    };

    if (selectedCategory !== "All")
      data = data.filter((r) => r.category === selectedCategory);
    if (selectedYear !== "All Year")
      data = data.filter((r) => getYearFromString(r.date) === selectedYear);
    if (selectedStatus !== "All Status")
      data = data.filter((r) => r.status === selectedStatus);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.publisher.toLowerCase().includes(q)
      );
    }

    if (selectedSort === "A-Z")
      data.sort((a, b) => a.title.localeCompare(b.title));
    else if (selectedSort === "Z-A")
      data.sort((a, b) => b.title.localeCompare(a.title));
    else if (selectedSort === "Most Popular")
      data.sort((a, b) => Number(b.stars) - Number(a.stars));
    else
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    return data;
  }, [
    projects,
    selectedCategory,
    selectedYear,
    selectedStatus,
    selectedSort,
    searchTerm,
  ]);

  // upload helper (optional — backend dependent)
  const uploadFiles = async (files: File[] = []) => {
    if (!files || files.length === 0) return [];
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: getAuthHeaders(false),
      });
      if (!res.ok) throw new Error("Upload failed");
      const j = await res.json();
      if (Array.isArray(j)) return j;
      if (Array.isArray(j.urls)) return j.urls;
      if (Array.isArray(j.data))
        return j.data.map((d: any) => d.url ?? d.path ?? d);
      return [];
    } catch (err) {
      console.warn("Upload error, fallback single uploads", err);
      const uploaded: string[] = [];
      for (const file of files) {
        try {
          const fd = new FormData();
          fd.append("file", file);
          const r = await fetch(UPLOAD_ENDPOINT, {
            method: "POST",
            body: fd,
            headers: getAuthHeaders(false),
          });
          if (!r.ok) continue;
          const jj = await r.json();
          uploaded.push(jj.url ?? jj.path ?? "");
        } catch (e) {
          console.warn("single upload failed", e);
        }
      }
      return uploaded;
    }
  };

  const handleSaveProject = async (
    formData: ProjectData & { mediaFiles?: File[] }
  ) => {
    const payload: any = {
      title: formData.title,
      kategori: formData.type,
      year: formData.date,
      description: formData.description,
      tech: formData.tech ?? "",
      teamMembers: formData.teamMembers ?? [],
      githubLink: formData.githubLink ?? "",
      demoLink: formData.demoLink ?? "",
      publisher: publisherName,
    };
    setIsLoading(true);
    try {
      if (formData.thumbnailFile) {
        const thumbnailUrls = await uploadFiles([formData.thumbnailFile]);

        const raw = thumbnailUrls?.[0];

        const url = typeof raw === "string" ? raw : raw?.url || raw?.path;

        if (!url) throw new Error("Thumbnail upload failed");

        payload.thumbnailUrl = url;
      }
      if (formData.mediaFiles && formData.mediaFiles.length > 0) {
        const urls = await uploadFiles(formData.mediaFiles);
        if (urls.length > 0) payload.mediaUrls = urls;
      }
      const headers = getAuthHeaders(true);
      if (editData) {
        const statusToSend =
          (formData as any).status ?? editData.status ?? "Review";
        const res = await fetch(`${PROJECT_ENDPOINT}/${editData.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ ...payload, status: statusToSend }),
        });
        if (!res.ok) throw new Error("Failed to update project");
      } else {
        const res = await fetch(PROJECT_ENDPOINT, {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...payload,
            status: "Review",
            stars: 0,
          }),
        });
        if (!res.ok) throw new Error("Failed to create project");
      }
      await fetchProjects();
      setIsFormOpen(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
      alert(
        editData
          ? "Gagal menyimpan perubahan project."
          : "Gagal membuat project baru."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const res = await fetch(`${PROJECT_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(true),
      });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus project.");
      await fetchProjects();
    }
  };

  const handleToggleMute = async (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    const newStatus = p.status === "Muted" ? "Published" : "Muted";
    try {
      const res = await fetch(`${PROJECT_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setProjects((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: newStatus } : x))
      );
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status project.");
      await fetchProjects();
    }
  };

  const handleViewFile = (item: any) => {
    const raw =
      item.thumbnailUrl ||
      item.mediaUrls?.[0] ||
      item.raw?.fileUrl ||
      item.raw?.mediaUrl;

    const url = typeof raw === "string" ? raw : raw?.url || raw?.path;

    if (!url) return alert("No file to preview");

    window.open(url, "_blank");
  };

  const handleApprove = async (item: any) => {
    try {
      const res = await fetch(`${PROJECT_ENDPOINT}/${item.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ status: "Published" }),
      });
      if (!res.ok) throw new Error("Approve failed");
      await fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Gagal approve submission.");
    }
  };

  const handleReject = async (item: any) => {
    try {
      const res = await fetch(`${PROJECT_ENDPOINT}/${item.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ status: "Rejected" }),
      });
      if (!res.ok) throw new Error("Reject failed");
      await fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Gagal reject submission.");
    }
  };

  const handleEditClick = (project: any) => {
    setEditData(project);
    setIsFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
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
        className={`w-full p-4 md:p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-600">
            Project
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`border rounded-lg p-4 ${s.color}`}>
              <div className="text-left">
                <p className="text-sm">{s.label}</p>
                <h2 className="text-2xl md:text-3xl font-semibold">
                  {s.value}
                </h2>
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
              label="Category"
              options={["All", "UI/UX", "Game", "Web", "AR", "VR", "Mobile"]}
              currentFilter={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <DropdownFilter
              label="Urutkan"
              options={["A-Z", "Z-A", "Most Popular", "Latest"]}
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
                "Rejected",
              ]}
              currentFilter={selectedStatus}
              onSelect={setSelectedStatus}
            />
          </div>

          <button
            onClick={() => {
              setIsFormOpen(true);
              setEditData(null);
            }}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap mt-2 md:mt-0"
          >
            <Plus size={20} /> <span>Add Project</span>
          </button>
        </div>

        <div className="border border-orange-500 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-orange-50">
                <tr>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Publisher</th>
                  <th className="py-3 px-2">Stars</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Loading projects...
                    </td>
                  </tr>
                )}
                {!isLoading && error && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !error &&
                  filteredData.map((row, idx) => {
                    const isLast = idx === filteredData.length - 1;
                    const borderClass = isLast
                      ? ""
                      : "border-b border-gray-200";
                    return (
                      <tr key={row.id ?? idx}>
                        <td className={`py-3 px-2 ${borderClass} text-center`}>
                          {row.title}
                        </td>
                        <td className={`py-3 px-2 ${borderClass} text-center`}>
                          {row.category}
                        </td>
                        <td className={`py-3 px-2 ${borderClass} text-center`}>
                          {formatDate(row.date)}
                        </td>
                        <td className={`py-3 px-2 ${borderClass} text-center`}>
                          {row.publisher}
                        </td>
                        <td className={`py-3 px-2 ${borderClass} text-center`}>
                          {row.stars}
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
                {!isLoading && !error && filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No matching data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowPending(!showPending)}
            className="flex items-center justify-between w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
          >
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 mr-3">
                Project Submissions
              </h3>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                {pending.length} New
              </span>
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
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 text-center">{item.title}</td>
                      <td className="py-3 text-center">{item.category}</td>
                      <td className="py-3 text-center">
                        <p className="font-medium">{item.publisher}</p>
                      </td>
                      <td className="py-3 text-center">{item.date}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleViewFile(item)}
                            className="text-blue-500 hover:text-blue-800"
                          >
                            <LinkIcon size={18} />
                          </button>
                          <button
                            onClick={() => handleApprove(item)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(item)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XIcon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pending.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-gray-500"
                      >
                        No pending submissions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isFormOpen && (
          <ProjectForm
            onClose={() => {
              setIsFormOpen(false);
              setEditData(null);
            }}
            onSubmit={handleSaveProject}
            initialData={
              editData
                ? {
                    title: editData.title,
                    description: editData.description || "",
                    type: editData.category || "",
                    date: editData.date || "",
                    tech: editData.tech || "",
                    teamMembers: editData.teamMembers || [],
                    githubLink: editData.githubLink || "",
                    demoLink: editData.demoLink || "",
                    mediaUrls: editData.mediaUrls || [],
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}