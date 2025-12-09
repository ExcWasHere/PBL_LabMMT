import Sidebar from "~/components/Dashboard/student/sidebar";
import { useState, useMemo } from "react";
import { Menu, Plus } from "lucide-react";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";
import DropdownFilter from "~/common/dropdown-filter";
import NewsForm from "~/common/project-form";

import { project_dummy } from "~/components/Dashboard/student/dataDummy";


export default function ProjectPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedKategori, setSelectedKategori] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [projects, setProjects] = useState(project_dummy);

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

  const handleToggleMute = (id: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === id) {
          const newStatus =
            project.status === "Muted" ? "Published" : "Muted";
          return { ...project, status: newStatus };
        }
        return project;
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
    let data = [...projects];

    const getYearFromString = (dateString: string) => {
      const parts = dateString.trim().split(" ");
      return parts[parts.length - 1];
    };

    if (selectedKategori !== "All") data = data.filter(row => row.category === selectedKategori);
    if (selectedYear !== "All Year") data = data.filter(row => getYearFromString(row.date) === selectedYear);

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
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
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
    selectedKategori,
    searchTerm,
    selectedSort,
    selectedStatus,
  ]);
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
      const newNews = {
        id: projects.length + 1,
        title: formData.title,
        category: formData.type,
        date: formData.date,
        publisher: "Me",
        status: "Review",

        stars: 0,
      };
      setProjects([newNews as any, ...projects]);
    }

    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      setProjects((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditClick = (news: any) => {
    setEditData(news);
    setIsFormOpen(true);
  };

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div
        className={`w-full p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"
          }`}
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

        {/* Filters */}
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
              currentFilter={selectedKategori}
              onSelect={setSelectedKategori}
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
            <span>Add Project</span>
          </button>
        </div>

        {/* Table */}
        <div className="border border-orange-500 rounded-lg overflow-hidden">
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
                const borderClass = isLastRow
                  ? "" : "border-b border-gray-200";

                return (
                  <tr key={index}>
                    <td className={`py-3 ${borderClass} text-center`}>{row.title}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.category}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{formatDate(row.date)}</td>
                    <td className={`py-3 ${borderClass} text-center`}>{row.publisher}</td>
                    <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.stars}
                      </td>
                    <td className={`py-3 ${borderClass} text-center`}><TableStatus status={row.status} /></td>
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
                  <td
                    colSpan={7}
                    className="py-8 text-center text-gray-500"
                  >
                    No matching data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isFormOpen && (
                  <NewsForm
                    onClose={() => {
                      setIsFormOpen(false);
                      setEditData(null);
                    }}
                    onSubmit={handleSaveProject}
                    initialData={
                      editData
                        ? {
                          title: editData.title,
                          category: editData.category,
                          date: editData.date,
                          content: editData.description || "",
                          coverUrl: editData.image || "",
                          location: editData.location || "",
                          publisher: editData.publisher || "",
                          docGuide: editData.docGuide || "",
                          newsLink: editData.newsLink || "",
                        }
                        : undefined
                    }
                  />
                )}
      </div>
    </div>
  );
}
