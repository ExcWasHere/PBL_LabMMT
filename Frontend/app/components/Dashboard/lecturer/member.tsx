import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useMemo, useEffect } from "react";
import { Menu, FileText, Check, X } from "lucide-react";
import DropdownFilter from "~/common/dropdown-filter";

const API_BASE = "http://localhost:3000";

type MemberItem = {
  id: string;
  userId?: number | null;
  name: string;
  identityNum?: string;
  field?: string;
  startDate?: string;
  role: "admin" | "dosen" | "mahasiswa";
  email?: string;
  phone?: string;
  photoUrl?: string;
  cvUrl?: string;
  status?: "pending" | "active" | string;
  createdAt?: string;
};

type PendingItem = {
  id: string;
  name: string;
  nim?: string;
  email?: string;
  field?: string;
  registrationDate?: string;
  cvUrl?: string;
};

export default function MemberPage() {
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

  const [selectedYear, setSelectedYear] = useState("All Year");
  const [selectedField, setSelectedField] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [memberList, setMemberList] = useState<MemberItem[]>([]);
  const [memberPending, setMemberPending] = useState<PendingItem[]>([]);
  const [showPending, setShowPending] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [approveTarget, setApproveTarget] = useState<PendingItem | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const token = localStorage.getItem("access_token");

  const stats = useMemo(() => {
    const lecturer = memberList.filter(
      (m) =>
        (m.role ?? "").toLowerCase() === "dosen" ||
        (m.role ?? "").toLowerCase() === "lecturer"
    ).length;
    const student = memberList.filter(
      (m) => (m.role ?? "").toLowerCase() === "mahasiswa"
    ).length;
    const alumni = memberList.filter(
      (m) => (m.role ?? "").toLowerCase() === "alumni"
    ).length;
    return [
      {
        label: "Lecturer",
        value: lecturer,
        color: "border-orange-400 text-orange-500",
      },
      {
        label: "Student",
        value: student,
        color: "border-blue-400 text-blue-500",
      },
      {
        label: "Alumni",
        value: alumni,
        color: "border-green-400 text-green-500",
      },
    ];
  }, [memberList]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Muted":
        return "text-red-500";
      case "Waiting":
        return "text-blue-600";
      default:
        return "text-black";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const buildCvUrl = (raw?: string) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed) || /^data:/i.test(trimmed))
      return trimmed;
    if (trimmed.startsWith("/")) return `${API_BASE}${trimmed}`;
    return `${API_BASE}/${trimmed.replace(/^\/+/, "")}`;
  };

  const formatDateShort = (raw?: string) => {
    if (!raw) return "-";
    try {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d.toLocaleDateString("id-ID");
      return raw;
    } catch {
      return raw;
    }
  };

  const normalizeMembers = (rows: any[]): MemberItem[] => {
    if (!Array.isArray(rows)) return [];
    return rows.map((r: any) => {
      const start =
        r.startDate ?? r.createdAt ?? r.start_date ?? r.created_at ?? null;
      const startStr = start ? formatDateShort(start) : "-";
      return {
        id: r.id,
        userId: r.userId ?? r.user_id ?? null,
        name: r.name ?? r.fullname ?? r.username ?? "",
        identityNum:
          r.identityNum ?? r.identity_num ?? r.validationField ?? r.nim ?? "",
        field: r.field ?? "",
        startDate: startStr,
        role: r.role,
        email: r.email ?? "",
        phone: r.phone ?? "",
        photoUrl: r.photoUrl ?? r.photo_url ?? r.photo ?? "",
        cvUrl: r.cvUrl ?? r.cv_url ?? r.cvPath ?? r.cv_path ?? "",
        status: r.status ?? "active",
        createdAt: r.createdAt ?? r.created_at ?? null,
      } as MemberItem;
    });
  };

  const normalizePending = (rows: any[]): PendingItem[] => {
    if (!Array.isArray(rows)) return [];
    return rows.map((p: any) => {
      const reg =
        p.createdAt ??
        p.created_at ??
        p.registrationDate ??
        p.registration_date ??
        null;
      const regStr = reg ? formatDateShort(reg) : "-";
      return {
        id: p.id,
        name: p.name ?? p.fullname ?? "",
        nim: p.identityNum ?? p.validationField ?? p.nim ?? "",
        email: p.email ?? "",
        field: p.role ?? p.field ?? "",
        registrationDate: regStr,
        cvUrl: p.cvUrl ?? p.cv_url ?? p.cvPath ?? p.cv_path ?? "",
      } as PendingItem;
    });
  };

  const fetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch(`${API_BASE}/member`);
      if (!res.ok) {
        console.error("Failed to fetch members", res.status);
        setMemberList([]);
        return;
      }
      const data = await res.json();
      const rows = Array.isArray(data) ? data : (data.data ?? []);
      const normalized = normalizeMembers(rows);
      setMemberList(normalized);
    } catch (err) {
      console.error("Error fetching members", err);
      setMemberList([]);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const fetchPending = async () => {
    setIsLoadingPending(true);
    try {
      const res = await fetch(`${API_BASE}/member/pending`);
      if (!res.ok) {
        console.error("Failed to fetch pending", res.status);
        setMemberPending([]);
        return;
      }
      const data = await res.json();
      const rows = Array.isArray(data) ? data : (data.data ?? []);
      const normalized = normalizePending(rows);
      setMemberPending(normalized);
    } catch (err) {
      console.error("Error fetching pending", err);
      setMemberPending([]);
    } finally {
      setIsLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPending();
    const interval = setInterval(() => {
      fetchMembers();
      fetchPending();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleReject = async (p: PendingItem) => {
    if (!p?.id) return;
    if (!confirm(`Reject ${p.name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/member/${p.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Failed to reject");
        return;
      }
      setMemberPending((prev) => prev.filter((x) => x.id !== p.id));
      alert(`${p.name} rejected`);
    } catch (err) {
      console.error(err);
      alert("Failed to reject, check console");
    }
  };

  const filteredData = useMemo(() => {
    let data = [...memberList];
    const getYearFromString = (dateString: string) => {
      const parts = dateString.trim().split(" ");
      return parts[parts.length - 1];
    };

    if (selectedField !== "All") {
      data = data.filter(
        (row) => (row.field ?? "").toLowerCase() === selectedField.toLowerCase()
      );
    }
    if (selectedYear !== "All Year") {
      data = data.filter(
        (row) => getYearFromString(row.startDate ?? "") === selectedYear
      );
    }

    if (searchTerm) {
      const lowerCaseQuery = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          (row.name ?? "").toLowerCase().includes(lowerCaseQuery) ||
          (row.field ?? "").toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (selectedSort === "A-Z") {
      data.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    } else if (selectedSort === "Z-A") {
      data.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
    } else {
      data.sort((a, b) => {
        const da = a.createdAt
          ? new Date(a.createdAt).getTime()
          : new Date(a.startDate ?? "").getTime();
        const db = b.createdAt
          ? new Date(b.createdAt).getTime()
          : new Date(b.startDate ?? "").getTime();
        return (db || 0) - (da || 0);
      });
    }

    return data;
  }, [memberList, selectedYear, selectedField, searchTerm, selectedSort]);

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
            Member
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
              currentFilter={selectedYear}
              onSelect={setSelectedYear}
            />
            <DropdownFilter
              label="Kategori"
              options={[
                "All",
                "UI/UX Designer",
                "Game Developer",
                "Frontend Developer",
              ]}
              currentFilter={selectedField}
              onSelect={setSelectedField}
            />
            <DropdownFilter
              label="Urutkan"
              options={["A-Z", "Z-A", "Latest"]}
              currentFilter={selectedSort}
              onSelect={setSelectedSort}
            />
          </div>
        </div>

        <div className="border border-orange-500 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-orange-50">
                <tr>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">NIM/NIDN</th>
                  <th className="py-3 px-2">Field</th>
                  <th className="py-3 px-2">Start Date</th>
                  <th className="py-3 px-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => {
                  const isLastRow = index === filteredData.length - 1;
                  const borderClass = isLastRow
                    ? ""
                    : "border-b border-gray-200";

                  return (
                    <tr key={row.id ?? index}>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.name}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.identityNum}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.field}
                      </td>
                      <td className={`py-3 px-2 ${borderClass} text-center`}>
                        {row.startDate}
                      </td>
                      <td
                        className={`py-3 px-2 ${borderClass} font-medium text-center ${getStatusColorClass(
                          row.role ?? "capitalize"
                        )}`}
                      >
                        {row.role}
                      </td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No data matches the applied filter.
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
            className="flex items-center justify-between w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
          >
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 mr-3">
                Registrations
              </h3>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                {memberPending.length} new
              </span>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                showPending ? "rotate-0" : "rotate-180"
              }`}
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">NIM</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Field</th>
                      <th className="py-3 px-2">Registration Date</th>
                      <th className="py-3 px-2">Document</th>
                      <th className="py-3 px-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoadingPending ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-gray-500"
                        >
                          Loading pending...
                        </td>
                      </tr>
                    ) : memberPending.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-gray-500"
                        >
                          No pending registrations.
                        </td>
                      </tr>
                    ) : (
                      memberPending.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200">
                          <td className="py-3 px-2 text-center">{user.name}</td>
                          <td className="py-3 px-2 text-center">{user.nim}</td>
                          <td className="py-3 px-2 text-center">
                            {user.email}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {user.field}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {user.registrationDate}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex justify-center gap-3">
                              <a
                                href={buildCvUrl(user.cvUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative p-2 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                                title="Open CV in new tab"
                              >
                                <FileText size={18} />
                              </a>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  setApproveTarget(user);
                                  setSelectedField("");
                                }}
                                className="text-green-600 hover:text-green-800"
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>

                              <button
                                onClick={() => handleReject(user)}
                                className="text-red-600 hover:text-red-800"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {approveTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-orange-600 mb-4">
                  Approve Registration
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                  Approve <b>{approveTarget.name}</b> sebagai anggota?
                </p>

                {/* FIELD SELECT */}
                <label className="block text-sm font-medium mb-1">
                  Pilih Field
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mb-4"
                >
                  <option value="">-- pilih field --</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Game Developer">Game Developer</option>
                </select>

                {/* ACTION */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setApproveTarget(null)}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                    disabled={isApproving}
                  >
                    Cancel
                  </button>

                  <button
                    disabled={!selectedField || isApproving}
                    onClick={async () => {
                      try {
                        setIsApproving(true);
                        const res = await fetch(
                          `${API_BASE}/member/${approveTarget.id}/approve`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              field: selectedField,
                            }),
                          }
                        );

                        if (!res.ok) {
                          const err = await res.json().catch(() => ({}));
                          alert(err.message || "Failed to approve");
                          return;
                        }

                        alert(`${approveTarget.name} approved`);
                        setMemberPending((prev) =>
                          prev.filter((x) => x.id !== approveTarget.id)
                        );
                        await fetchMembers();
                        setApproveTarget(null);
                      } catch (err) {
                        console.error(err);
                        alert("Approve failed");
                      } finally {
                        setIsApproving(false);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}