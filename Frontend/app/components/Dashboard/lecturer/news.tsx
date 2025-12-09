import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, Plus } from "lucide-react";
import NewsForm from "~/common/news-form";
import DropdownFilter from "~/common/dropdown-filter";
import TableAction from "~/common/table-action";
import TableStatus from "~/common/table-status";

const API_BASE_URL = "http://localhost:3000";
const NEWS_ENDPOINT = `${API_BASE_URL}/news`;

const getPublisherName = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "KetuaLab";
    const parsed = JSON.parse(raw);
    return (
      parsed.name ??
      parsed.fullname ??
      parsed.username ??
      "KetuaLab"
    );
  } catch {
    return "KetuaLab";
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const mapApiToNews = (n: any) => ({
  id: n.id,
  title: n.title ?? "-",
  category: n.kategori ?? n.category ?? "-",
  date: n.year ?? n.date ?? "",
  publisher: n.publisher ?? "-",
  status: n.status ?? "Review",
  description: n.description ?? "",
  image: n.coverUrl ?? n.image ?? "",
  location: n.location ?? "",
  docGuide: n.docGuide ?? "",
  newsLink: n.newsLink ?? "",
});

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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState("All Year");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [newsList, setNewsList] = useState<any[]>([]);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(NEWS_ENDPOINT, {
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Fetch news failed", res.status, text);
          throw new Error("Failed to fetch news");
        }

        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map(mapApiToNews);
        setNewsList(mapped);
      } catch (err) {
        console.error(err);
        setNewsList([]);
      }
    };

    fetchNews();
  }, []);

  const stats = [
    {
      label: "Published",
      value: newsList.filter((n) => n.status === "Published").length,
      color: "border-orange-400 text-orange-500",
    },
    {
      label: "Review",
      value: newsList.filter((n) => n.status === "Review").length,
      color: "border-blue-400 text-blue-500",
    },
    {
      label: "Wait To Publish",
      value: newsList.filter((n) => n.status === "Waiting").length,
      color: "border-green-400 text-green-500",
    },
    {
      label: "Muted",
      value: newsList.filter((n) => n.status === "Muted").length,
      color: "border-red-400 text-red-500",
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleMute = async (id: number) => {
    const item = newsList.find((n) => n.id === id);
    if (!item) return;

    const newStatus = item.status === "Muted" ? "Published" : "Muted";

    try {
      const res = await fetch(`${NEWS_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update status failed", res.status, text);
        throw new Error("Failed to update status");
      }

      const updated = await res.json();
      const mapped = mapApiToNews(updated);

      setNewsList((prev) =>
        prev.map((n) => (n.id === mapped.id ? mapped : n))
      );
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status news.");
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
    let data = [...newsList];

    const getYearFromString = (dateString: string) => {
      const d = new Date(dateString);
      if (!isNaN(d.getTime())) {
        return String(d.getFullYear());
      }
      const parts = dateString.trim().split(" ");
      return parts[parts.length - 1];
    };

    if (selectedCategory !== "All") {
      data = data.filter((row) => row.category === selectedCategory);
    }
    if (selectedDate !== "All Year") {
      data = data.filter(
        (row) => getYearFromString(row.date) === selectedDate
      );
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
    }

    if (selectedStatus !== "All Status") {
      data = data.filter((row) => row.status === selectedStatus);
    }

    return data;
  }, [
    newsList,
    selectedDate,
    selectedCategory,
    searchTerm,
    selectedSort,
    selectedStatus,
  ]);

  const handleSaveNews = async (formData: any) => {
    const publisherName = getPublisherName();

    const payload = {
      title: formData.title,
      kategori: formData.type ?? formData.category,
      year: formData.date,
      description: formData.content ?? formData.description ?? "",
      publisher: publisherName,
      location: formData.location,
      newsLink: formData.newsLink,
      docGuide: formData.docGuide,
      coverUrl: formData.coverUrl,
    };

    try {
      if (editData) {
        const res = await fetch(`${NEWS_ENDPOINT}/${editData.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Update news failed", res.status, text);
          throw new Error("Failed to update news");
        }

        const updated = await res.json();
        const mapped = mapApiToNews(updated);

        setNewsList((prev) =>
          prev.map((n) => (n.id === mapped.id ? mapped : n))
        );
      } else {
        const res = await fetch(NEWS_ENDPOINT, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...payload,
            status: "Review",
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Create news failed", res.status, text);
          throw new Error("Failed to create news");
        }

        const created = await res.json();
        const mapped = mapApiToNews(created);

        setNewsList((prev) => [mapped, ...prev]);
      }

      setIsFormOpen(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
      alert(
        editData
          ? "Gagal menyimpan perubahan news."
          : "Gagal membuat news baru."
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this news?")) {
      return;
    }

    try {
      const res = await fetch(`${NEWS_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete news failed", res.status, text);
        throw new Error("Failed to delete news");
      }

      setNewsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus news.");
    }
  };

  const handleEditClick = (news: any) => {
    setEditData(news);
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
            News
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`border rounded-lg p-4 ${s.color}`}>
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
              currentFilter={selectedDate}
              onSelect={setSelectedDate}
            />
            <DropdownFilter
              label="Category"
              options={[
                "All",
                "News",
                "Training",
                "Workshops",
                "Certifications",
                "Articles",
              ]}
              currentFilter={selectedCategory}
              onSelect={setSelectedCategory}
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
            <span>Add News</span>
          </button>
        </div>

        <div className="border border-orange-500 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-orange-50">
                <tr>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Year</th>
                  <th className="py-3 px-2">Publisher</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Action</th>
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