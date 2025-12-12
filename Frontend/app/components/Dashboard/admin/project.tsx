import Sidebar from "~/components/Dashboard/admin/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, Plus, Eye, EyeOff, Pencil, Trash, Check, X, Link } from "lucide-react";
import { project_dummy, project_pending_dummy } from "~/components/Dashboard/admin/dataDummy";
import DropdownFilter from "~/common/dropdown-filter";
import ProjectForm from "~/common/project-form";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";

// --- ProjectPage Component ---
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedKategori, setSelectedKategori] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [projects, setProjects] = useState(project_dummy);
  const [editData, setEditData] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Published": return "text-orange-500";
      case "Review": return "text-blue-600";
      case "Waiting": return "text-green-600";
      case "Muted": return "text-red-500";
      default: return "text-black";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // --- Filtering ---
  const filteredData = useMemo(() => {
    let data = [...projects];
    const getYearFromString = (dateString: string) => {
      const parts = dateString.trim().split(' ');
      return parts[parts.length - 1];
    };

    if (selectedKategori !== "All") {
      data = data.filter(row => row.category === selectedKategori);
    }
    if (selectedYear !== "All Years") {
      data = data.filter(row => getYearFromString(row.date) === selectedYear);
    }
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
    } else if (selectedSort === "Most Popular") {
      data.sort((a, b) => Number(b.stars) - Number(a.stars));
    }

    if (selectedStatus !== "All") {
      data = data.filter(row => row.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    return data;
  }, [projects, selectedYear, selectedKategori, searchTerm, selectedSort, selectedStatus]);

  const handleToggleMute = (id: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === id) {
          const projectStatus = project.status === "Muted" ? "Published" : "Muted";
          return { ...project, status: projectStatus };
        }
        return project;
      })
    );
  };

  const handleEditClick = (project: any) => {
    setEditData(project);
    setIsFormOpen(true);
  }

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

  const handleSaveProject = (formData: any) => {
    if (editData) {
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === editData.id) {
            return {
              ...project,
              title: formData.title,
              category: formData.type,
              date: formData.date,
            };
          }
          return project;
        })
      );
    } else {
      const newProject = {
        id: projects.length + 1,
        title: formData.title,
        category: formData.type,
        date: formData.date,
        publisher: "Me",
        stars: "0",
        status: "Review",
      };
      setProjects([newProject as any, ...projects]);
    }

    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prevProjects) =>
        prevProjects.filter((projects) => projects.id !== id)
      );
    }
  };

  const [pending, setPending] = useState(project_pending_dummy);
  const [showPending, setShowPending] = useState(false);
  const pendingCounter = [{ value: pending.length }]


  const handleViewFile = (file: any) => {
    alert("Preview file: " + file.name);
  };

  const handleApprove = (item: any) => {
    alert("Approved: " + item.title);
  };

  const handleReject = (item: any) => {
    alert("Rejected: " + item.title);
  };

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}
      <div
        className={`w-full p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Project</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`border-1 rounded-lg p-4 ${s.color}`}>
              <p className="text-sm">{s.label}</p>
              <h2 className="text-3xl font-semibold">{s.value}</h2>
            </div>
          ))}
        </div>

        {/* FILTER BAR FIX */}
        <div className="flex items-center flex-nowrap gap-2 mb-6 text-sm">
          <div className="flex items-center flex-1 border border-orange-500 rounded-lg bg-white px-3 py-2">
            <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>

          <DropdownFilter label="Year" options={["All Years", "2025", "2024", "2023"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
          <DropdownFilter label="Kategori" options={["All", "UI/UX", "Game", "Frontend", "AR", "VR"]} currentFilter={selectedKategori} onSelect={setSelectedKategori} />
          <DropdownFilter label="Sort" options={["A-Z", "Z-A", "Most Popular", "Latest"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
          <DropdownFilter label="Status" options={["All", "Published", "Review", "Muted", "Waiting", "Denied"]} currentFilter={selectedStatus} onSelect={setSelectedStatus} />

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap transition"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* --- Table Section --- */}
        <div className="border border-orange-400 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50">
              <tr>
                <th className="py-3">Title</th>
                <th className="py-3">Category</th>
                <th className="py-3">Date</th>
                <th className="py-3">Publisher</th>
                <th className="py-3">Stars</th>
                <th className="py-3">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => {
                const isLastRow = index === filteredData.length - 1;
                const borderClass = isLastRow ? "" : 'border-b border-gray-200';

                const isReview = row.status === "Review";
                const isMuted = row.status === "Muted";
                const isWaiting = row.status === "Waiting";

                const disabledStyle = "text-gray-300 cursor-not-allowed";

                return (
                  <tr key={index}>
                    <td className={`py-3 ${borderClass} text-center`}>{row.title}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.category}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{formatDate(row.date)}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.publisher}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.stars}</td>
                    <td className={`py-3 ${borderClass} text-center`}><TableStatus status={row.status} /> </td>
                    <td className={`py-3 ${borderClass} text-center`}>
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
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No matching data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pending Section */}
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
                {pendingCounter.map(pc => pc.value)} New
              </span>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${showPending ? "rotate-0" : "rotate-180"
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                        <p className="font-medium">{item.submittedBy?.name || "Unknown"}</p>
                      </td>
                      <td className="py-3 text-center">{item.submissionDate}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleViewFile(item)} className="text-blue-500 hover:text-blue-800">
                            <Link size={18} />
                          </button>

                          <button onClick={() => handleApprove(item)} className="text-green-600 hover:text-green-800">
                            <Check size={18} />
                          </button>

                          <button onClick={() => handleReject(item)} className="text-red-600 hover:text-red-800">
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
                  teamMembers: editData.teamMembers || "",
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
