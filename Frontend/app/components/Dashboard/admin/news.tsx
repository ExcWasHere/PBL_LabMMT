import Sidebar from "~/components/Dashboard/admin/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, Plus,  Check, X, Link } from "lucide-react";
import { news_dummy, news_pending_dummy } from "~/components/Dashboard/admin/dataDummy";
import NewsForm from "~/common/news-form";
import DropdownFilter from "~/common/dropdown-filter";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";

export default function NewsPage() {
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
  const [newsList, setNewsList] = useState(news_dummy);
  const [showPending, setShowPending] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [pending, setPending] = useState(news_pending_dummy);
  const pendingCounter = [{value: pending.length}]

  const stats = [
    {
      label: "Published",
      value: newsList.filter((p) => p.status === "Published").length,
      color: "border-orange-400 text-orange-500",
    },
    {
      label: "Review",
      value: newsList.filter((p) => p.status === "Review").length,
      color: "border-blue-400 text-blue-500",
    },
    {
      label: "Wait To Publish",
      value: newsList.filter((p) => p.status === "Waiting").length,
      color: "border-green-400 text-green-500",
    },
    {
      label: "Muted",
      value: newsList.filter((p) => p.status === "Muted").length,
      color: "border-red-400 text-red-500",
    },
  ];


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleToggleMute = (id: number) => {
    setNewsList((prev) =>
      prev.map((news) =>
        news.id === id
          ? { ...news, status: news.status === "Muted" ? "Published" : "Muted" }
          : news
      )
    );
  };

  const filteredData = useMemo(() => {
    let data = [...newsList];
    const getYearFromString = (dateString: string) => {
      const parts = dateString.trim().split(" ");
      return parts[parts.length - 1];
    };

    if (selectedYear !== "All Years") {
      data = data.filter((r) => getYearFromString(r.date) === selectedYear);
    }

    if (selectedKategori !== "All") {
      data = data.filter((r) => r.category === selectedKategori);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.publisher.toLowerCase().includes(q)
      );
    }

    if (selectedSort === "A-Z") data.sort((a, b) => a.title.localeCompare(b.title));
    else if (selectedSort === "Z-A") data.sort((a, b) => b.title.localeCompare(a.title));
    else if (selectedSort === "Latest") {
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (selectedStatus !== "All") {
      data = data.filter((r) => r.status === selectedStatus);
    }

    return data;
  }, [newsList, selectedYear, selectedKategori, searchTerm, selectedSort, selectedStatus]);

  const AddNews = () => alert("Add News clicked!");
  const handleApprove = (item: any) => alert("Approved: " + item.title);
  const handleReject = (item: any) => alert("Rejected: " + item.title);

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

  const handleSaveNews = (formData: any) => {
    if (editData) {
      setNewsList((prevNews) =>
        prevNews.map((news) => {
          if (news.id === editData.id) {
            return {
              ...news,
              title: formData.title,
              category: formData.type,
              date: formData.date,
            };
          }
          return news;
        })
      );
    } else {
      const newNews = {
        id: newsList.length + 1,
        title: formData.title,
        category: formData.type,
        date: formData.date,
        publisher: "Me",
        status: "Review",
      };
      setNewsList([newNews as any, ...newsList]);
    }

    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditClick = (news: any) => {
    setEditData(news);
    setIsFormOpen(true);
  };

  return (
    <div className="flex min-h-screen overflow-y-scroll [scrollbar-gutter:stable]">
      {isSidebarOpen && <Sidebar />}

      <div className={`w-full p-8 transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>

        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">News</h1>
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

        {/* Filters — FIX 1 BARIS */}
        <div className="flex items-center flex-nowrap gap-2 mb-6 text-sm">

          <div className="flex items-center flex-1 border border-orange-500 rounded-lg px-3 py-2 bg-white">
            <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>

          <DropdownFilter label="Tahun" options={["All Years", "2025", "2024", "2023"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
          <DropdownFilter label="Kategori" options={["All", "News", "Training", "Workshop", "Certification", "Articles"]} currentFilter={selectedKategori} onSelect={setSelectedKategori} />
          <DropdownFilter label="Urutkan" options={["A-Z", "Z-A", "Most Popular", "Latest"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
          <DropdownFilter label="Status" options={["All", "Published", "Review", "Waiting", "Muted"]} currentFilter={selectedStatus} onSelect={setSelectedStatus} />

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Add News
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
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((row, index) => {
                const isLastRow = index === filteredData.length - 1;
                  const borderClass = isLastRow
                    ? ""
                    : "border-b border-gray-200";
                    
                return (
                  <tr key={index}>
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

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No matching data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pending */}
        <div className="mt-8">
          <button
            onClick={() => setShowPending(!showPending)}
            className="flex items-center justify-between w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
          >
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-3">News Submissions</h3>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                {pendingCounter.map(pc => pc.value)} New
              </span>
            </div>

            <svg
              className={`w-5 h-5 transition-transform ${showPending ? "rotate-0" : "rotate-180"
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
                        <div className="flex justify-center gap-2">
                          <button className="text-blue-500 hover:text-blue-800">
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
          <NewsForm
            onClose={() => {
              setIsFormOpen(false);
              setEditData(null);
            }}
            onSubmit={handleSaveNews}
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
