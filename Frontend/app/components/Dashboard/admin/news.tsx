import Sidebar from "~/components/Dashboard/admin/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, Plus, Check, X, Link } from "lucide-react";
import NewsForm from "~/common/news-form";
import DropdownFilter from "~/common/dropdown-filter";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";

const API_BASE = "http://localhost:3000";
const API_URL = `${API_BASE}/news`;
const UPLOAD_ENDPOINT = `${API_BASE}/upload`;

export default function NewsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedKategori, setSelectedKategori] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showPending, setShowPending] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const uploadFiles = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("files", file); 

      try {
        const res = await fetch(UPLOAD_ENDPOINT, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `Upload failed: ${res.statusText}`);
        }
        
        return await res.json();
      } catch (err) {
        console.error("Upload error details:", err);
        throw err;
      }
    });

    return await Promise.all(uploadPromises);
  };

  const extractUrlFromResponse = (raw: any): string | null => {
    if (!raw) return null;
    if (Array.isArray(raw)) {
        if (raw.length === 0) return null;
        raw = raw[0];
    }
    if (typeof raw === "string") return raw;
    return raw?.url || raw?.path || raw?.data || raw?.file || raw?.filename || raw?.name || null;
  };

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        
        const mappedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.kategori,
          date: item.year,
          publisher: item.publisher,
          status: item.status,
          description: item.content, 
          image: item.imageUrl,      
          docGuide: item.docGuide,
          location: item.location || "",
          newsLink: item.newsLink,
        }));

        setNewsList(mappedData);
      } else {
        console.error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error connecting to API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const mainNewsData = useMemo(() => {
    let data = [...newsList];
    
    const getYearFromString = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "" : date.getFullYear().toString();
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

    if (selectedSort === "A-Z")
      data.sort((a, b) => a.title.localeCompare(b.title));
    else if (selectedSort === "Z-A")
      data.sort((a, b) => b.title.localeCompare(a.title));
    else if (selectedSort === "Latest") {
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    if (selectedStatus !== "All") {
      data = data.filter((r) => r.status === selectedStatus);
    }

    return data;
  }, [newsList, selectedYear, selectedKategori, searchTerm, selectedSort, selectedStatus]);

  const pendingNewsData = useMemo(() => {
    return newsList.filter(item => item.status === 'Review');
  }, [newsList]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    }).format(date);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        setNewsList((prev) =>
          prev.map((news) =>
            news.id === id ? { ...news, status: newStatus } : news
          )
        );
      } else {
        alert(`Gagal mengubah status. Pastikan backend support enum '${newStatus}'.`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleToggleMute = (id: string) => {
    const item = newsList.find((n) => n.id === id);
    if (!item) return;

    if (item.status === "Published") {
        updateStatus(id, "Muted");
    } else if (item.status === "Muted") {
        updateStatus(id, "Published");
    } else if (item.status === "Rejected") {
        if(window.confirm("Restore this rejected post to Published?")) {
            updateStatus(id, "Published");
        }
    }
  };

  const handleApprove = (item: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postDate = new Date(item.date);
    postDate.setHours(0, 0, 0, 0);

    let newStatus = "Published";
    let message = "Approve this submission? It will be Published immediately.";

    if (postDate > today) {
      newStatus = "Waiting";
      message = `The publish date is ${formatDate(item.date)}. The post will be set to Waiting status. Continue?`;
    }

    if (window.confirm(message)) {
      updateStatus(item.id, newStatus);
    }
  };

  const handleReject = (id: string) => {
    if (window.confirm("Reject this submission? It will be marked as Rejected.")) {
      updateStatus(id, "Rejected");
    }
  };

  const handleViewSubmission = (item: any) => {
    setEditData(item);
    setIsReadOnly(true); 
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this permanently?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setNewsList((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleEditClick = (news: any) => {
    setEditData(news);
    setIsReadOnly(false);
    setIsFormOpen(true);
  };

  const handleSaveNews = async (formData: any) => {
    console.log("Admin Save News Payload:", formData);

    const payload = {
      title: formData.title,
      kategori: formData.category ?? formData.type,
      year: formData.date,
      publisher: formData.publisher ?? "Admin",
      status: "Review", 

      content: formData.content ?? formData.description ?? "",
      imageUrl: formData.coverUrl ?? "", 
      docGuide: formData.docGuide ?? "",
      location: formData.location ?? formData.place ?? "",
      newsLink: formData.newsLink ?? formData.link ?? "",
    };

    const coverFile = formData.coverFile || (formData.image instanceof File ? formData.image : null);
    const docFile = formData.docFile || formData.documentFile || (formData.docGuide instanceof File ? formData.docGuide : null);

    try {
      if (coverFile) {
        console.log("Uploading cover...", coverFile);
        const uploadRes = await uploadFiles([coverFile]);
        const url = extractUrlFromResponse(uploadRes[0]);
        if (url) payload.imageUrl = url;
      }

      if (docFile) {
        console.log("Uploading doc...", docFile);
        const uploadRes = await uploadFiles([docFile]);
        const url = extractUrlFromResponse(uploadRes[0]);
        if (url) payload.docGuide = url;
      }

      console.log("Final Payload to Backend:", payload);
      let response;
      if (editData) {
        response = await fetch(`${API_URL}/${editData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        await fetchNews();
        setIsFormOpen(false);
        setEditData(null);
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Terjadi kesalahan saat menyimpan data (Cek Console).");
    }
  };

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

  return (
    <div className="flex min-h-screen overflow-y-scroll [scrollbar-gutter:stable]">
      {isSidebarOpen && <Sidebar />}

      <div className={`w-full p-8 transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="flex items-center mb-6">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 text-gray-700 hover:text-orange-600">
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">News</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`border-1 rounded-lg p-4 ${s.color}`}>
              <p className="text-sm">{s.label}</p>
              <h2 className="text-3xl font-semibold">{s.value}</h2>
            </div>
          ))}
        </div>

        <div className="flex items-center flex-nowrap gap-2 mb-6 text-sm">
          <div className="flex items-center flex-1 border border-orange-500 rounded-lg px-3 py-2 bg-white">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
          <DropdownFilter label="Tahun" options={["All Years", "2025", "2024"]} currentFilter={selectedYear} onSelect={setSelectedYear} />
          <DropdownFilter label="Kategori" options={["All", "News", "Training", "Workshop", "Article"]} currentFilter={selectedKategori} onSelect={setSelectedKategori} />
          <DropdownFilter label="Urutkan" options={["Latest", "A-Z", "Z-A"]} currentFilter={selectedSort} onSelect={setSelectedSort} />
          <DropdownFilter label="Status" options={["All", "Published", "Review", "Waiting", "Muted", "Rejected"]} currentFilter={selectedStatus} onSelect={setSelectedStatus} />

          <button
            onClick={() => {
              setEditData(null);
              setIsReadOnly(false);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Add News
          </button>
        </div>

        <div className="border border-orange-500 rounded-lg overflow-hidden mb-8">
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
              {mainNewsData.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-orange-50/50">
                  <td className="py-3 px-2 text-center">{row.title}</td>
                  <td className="py-3 px-2 text-center">{row.category}</td>
                  <td className="py-3 px-2 text-center">{formatDate(row.date)}</td>
                  <td className="py-3 px-2 text-center">{row.publisher}</td>
                  <td className="py-3 px-2 text-center">
                    <TableStatus status={row.status} />
                  </td>
                  <td className="py-3 px-2 text-center">
                    <TableAction
                      status={row.status}
                      onToggleMute={() => handleToggleMute(row.id)}
                      onEdit={() => handleEditClick(row)}
                      onDelete={() => handleDelete(row.id)}
                    />
                  </td>
                </tr>
              ))}
              {mainNewsData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    {isLoading ? "Loading..." : "No data found."}
                  </td>
                </tr>
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
              <h3 className="text-lg font-semibold mr-3">News Submissions (Review)</h3>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                {pendingNewsData.length} New
              </span>
            </div>
            <svg className={`w-5 h-5 transition-transform ${showPending ? "rotate-0" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {pendingNewsData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 text-center">{item.title}</td>
                      <td className="py-3 text-center">{item.category}</td>
                      <td className="py-3 text-center font-medium">{item.publisher}</td>
                      <td className="py-3 text-center">{formatDate(item.date)}</td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewSubmission(item)}
                            className="text-blue-500 hover:text-blue-800 p-1"
                            title="Review Content"
                          >
                            <Link size={18} />
                          </button>
                          <button
                            onClick={() => handleApprove(item)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Approve (Publish/Schedule)"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Reject (Deny)"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingNewsData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500 italic">
                        No submissions waiting for review.
                      </td>
                    </tr>
                  )}
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
            readOnly={isReadOnly}
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