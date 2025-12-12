import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, Plus } from "lucide-react";
import DropdownFilter from "~/common/dropdown-filter";
import ProjectForm, { type ProjectData } from "~/common/project-form";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";
const API_BASE_URL = "http://localhost:3000";

const mapApiToProject = (p: any) => ({
  id: p.id as string,
  title: p.title ?? "-",
  category: p.kategori ?? p.category ?? "-",
  date: p.year || p.date || "",
  publisher: p.publisher ?? "-",
  stars: typeof p.stars === "number" ? String(p.stars) : (p.stars ?? "0"),
  status: p.status ?? "Review",
  description: p.description ?? "",
  tech: p.tech ?? "",
  teamMembers: Array.isArray(p.teamMembers) ? p.teamMembers : [],
  githubLink: p.githubLink ?? "",
  demoLink: p.demoLink ?? "",
  mediaUrls: Array.isArray(p.mediaUrls) ? p.mediaUrls : [],
});

export default function ProjectPage() {
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

  const [publisherName, setPublisherName] = useState("KetuaLab");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setPublisherName(
          parsed.name ?? parsed.fullname ?? parsed.username ?? "KetuaLab"
        );
      }
    } catch (e) {
      console.error("Failed to parse user profile", e);
    }
  }, []);

  const [editData, setEditData] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/project`);

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map(mapApiToProject);
        setProjects(mapped);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data project.");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleMute = async (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    const newStatus = project.status === "Muted" ? "Published" : "Muted";

    try {
      const res = await fetch(`${API_BASE_URL}/project/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status project.");
    }
  };

  const handleEditClick = (project: any) => {
    setEditData(project);
    setIsFormOpen(true);
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
    let data = [...projects];

    const getYearFromString = (dateString: string) => {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      return String(d.getFullYear());
    };

    if (selectedCategory !== "All") {
      data = data.filter((row) => row.category === selectedCategory);
    }
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
    } else if (selectedSort === "Most Popular") {
      data.sort((a, b) => Number(b.stars) - Number(a.stars));
    }

    if (selectedStatus !== "All Status") {
      data = data.filter((row) => row.status === selectedStatus);
    }

    return data;
  }, [
    projects,
    selectedYear,
    selectedCategory,
    searchTerm,
    selectedSort,
    selectedStatus,
  ]);

  const handleSaveProject = async (formData: ProjectData) => {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const payload = {
      title: formData.title,
      kategori: formData.type,
      year: formData.date,
      description: formData.description,
      publisher: publisherName,
    };

    try {
      if (editData) {
        const res = await fetch(`${API_BASE_URL}/project/${editData.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            ...payload,
            status: "Review",
            stars: 0,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Update project failed", res.status, text);
          throw new Error("Failed to update project");
        }

        const updated = await res.json();
        const mapped = mapApiToProject(updated);

        setProjects((prev) =>
          prev.map((p) => (p.id === mapped.id ? mapped : p))
        );
      } else {
        const res = await fetch(`${API_BASE_URL}/project`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...payload,
            status: "Review",
            stars: 0,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Create project failed", res.status, text);
          throw new Error("Failed to create project");
        }

        const created = await res.json();
        const mapped = mapApiToProject(created);

        setProjects((prev) => [mapped, ...prev]);
      }
      setIsFormOpen(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
      alert(
        editData
          ? "Gagal menyimpan perubahan project."
          : "Gagal membuat project baru."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/project/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus project.");
    }
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
            <span>Add Project</span>
          </button>
        </div>

        {/* Table Section */}
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
                  filteredData.map((row, index) => {
                    const isLastRow = index === filteredData.length - 1;
                    const borderClass = isLastRow
                      ? ""
                      : "border-b border-gray-200";

                    return (
                      <tr key={row.id ?? index}>
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