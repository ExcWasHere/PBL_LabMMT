import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Users,
  MessageCircle,
  Heart,
  FileText,
  Bell,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  LogOut,
  Plus,
  Phone,
  Gamepad2,
  PenTool,
  Glasses,
} from "lucide-react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ActivityType = "Game Dev" | "UI/UX" | "AR/VR" | "Workshop" | "Meeting";

const activityIcon: Record<ActivityType, string> = {
  "Game Dev": "🎮",
  "UI/UX": "✏️",
  "AR/VR": "🥽",
  "Workshop": "🛠️",
  "Meeting": "👥",
};

interface DashboardProps {
  userName?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  date: string;
  status: string;
}

const Dashboard = ({ 
  userName = "John Doe", 
  userId = "12345", 
  userRole = "Viewer" 
}: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [activityData] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "Game Dev",
      title: "Unity Workshop",
      description: "Mengikuti workshop pengembangan game dengan Unity",
      date: new Date().toISOString(),
      status: "Completed",
    },
    {
      id: "2",
      type: "UI/UX",
      title: "Design Sprint",
      description: "Membuat desain untuk pengembangan aplikasi laboratorium",
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "In Progress",
    },
    {
      id: "3",
      type: "AR/VR",
      title: "VR Development",
      description: "Eksplorasi teknologi Virtual Reality",
      date: new Date(Date.now() - 172800000).toISOString(),
      status: "In Progress",
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<
    {
      id: string;
      type: string;
      activity: string;
      time: string;
      status: ActivityType;
      avatar: string;
    }[]
  >([]);

  useEffect(() => {
    setRecentActivities(
      activityData.map((item) => ({
        id: item.id,
        type: item.type,
        activity: item.description || "-",
        time: new Date(item.date).toLocaleString("id-ID"),
        status: item.type,
        avatar: activityIcon[item.type as ActivityType] || "📋",
      }))
    );
  }, []);

  const chartData = activityData.map((item, index) => ({
    date: new Date(item.date).toLocaleDateString("id-ID"),
    value: 5 - index,
  }));

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getFirstName = (fullName: string): string => {
    if (!fullName || typeof fullName !== "string") return "Pengguna";
    return fullName.trim().split(" ")[0];
  };

  const getInitials = (fullName: string): string => {
    if (!fullName || typeof fullName !== "string") return "P";
    return fullName
      .trim()
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "#dashboard",
    },
    {
      id: "projects",
      label: "Projects",
      icon: Calendar,
      href: "#projects",
    },
    {
      id: "members",
      label: "Members",
      icon: Users,
      href: "#members",
    },
    {
      id: "discussion",
      label: "Discussion",
      icon: MessageCircle,
      href: "#discussion",
    },
    {
      id: "resources",
      label: "Resources",
      icon: Heart,
      href: "#resources",
    },
    {
      id: "documentation",
      label: "Documentation",
      icon: FileText,
      href: "#documentation",
    },
  ];

  const statsCards = [
    {
      title: "Active Projects",
      value: "12",
      description: "Bulan ini",
      change: "+3 dari bulan lalu",
      changeType: "positive" as const,
      icon: Gamepad2,
      bgColor: "bg-orange-100",
    },
    {
      title: "Team Members",
      value: String(activityData.length),
      description: "Total Anggota",
      change: "+5 anggota baru",
      changeType: "positive" as const,
      icon: Users,
      bgColor: "bg-amber-100",
    },
    {
      title: "Workshops",
      value: "8",
      description: "Minggu ini",
      change: "Jadwal berikutnya: 20 Nov",
      changeType: "neutral" as const,
      icon: PenTool,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Equipment",
      value: "24",
      description: "Total Perangkat",
      change: "Semua berfungsi normal",
      changeType: "positive" as const,
      icon: Glasses,
      bgColor: "bg-orange-100",
    },
  ];

  const handleLogout = () => {
    if (confirm("Apakah kamu yakin ingin logout?")) {
      alert("Logout berhasil!");
    }
  };

  const Logo = () => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
      <img src="favicon.ico" alt="logo" />
    </div>
  );

  const SidebarItem = ({ item }: { item: (typeof sidebarItems)[0] }) => (
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        setActiveTab(item.id);
        setSidebarOpen(false);
      }}
      className={`group relative w-full flex items-center px-4 py-3.5 text-left rounded-xl transition-all duration-300 ${
        item.id === activeTab
          ? "bg-white text-orange-800 shadow-lg transform translate-x-2 scale-105"
          : "text-white hover:bg-white/20 hover:transform hover:translate-x-1"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 shadow-md transition-all duration-300 ${
          item.id === activeTab
            ? "bg-orange-500"
            : "bg-white/20 group-hover:bg-white/30 group-hover:scale-110"
        }`}
      >
        <item.icon
          className={`w-4 h-4 ${
            item.id === activeTab ? "text-white" : "text-white"
          }`}
        />
      </div>
      <span className="font-medium text-sm">{item.label}</span>
      {item.id === activeTab && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full"></div>
      )}
    </a>
  );

  const StatsCard = ({
    card,
    index,
  }: {
    card: (typeof statsCards)[0];
    index: number;
  }) => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform border border-gray-100 ${
        animateStats ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">{card.title}</h3>
        <div
          className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center shadow-md`}
        >
          <card.icon className="w-6 h-6 text-orange-600" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-black text-gray-800 mb-1">
            {card.value}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {card.description}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              card.changeType === "positive"
                ? "text-green-700 bg-green-100"
                : "text-gray-700 bg-gray-100"
            }`}
          >
            {card.change}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSidebarOpen(false);
            }
          }}
          style={{ cursor: "pointer" }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-orange-500 shadow-2xl transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 bg-orange-600">
          <div className="flex items-center space-x-3">
            <Logo />
            <h2 className="text-xl font-black text-white">
              Lab<span className="text-orange-200">MMT</span>
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="lg:flex hidden items-center justify-center w-8 h-8 text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 pb-20">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </div>
        </nav>

        {/* Mobile Logout Button */}
        <div className="absolute bottom-4 left-3 right-3 lg:hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden bg-orange-100 text-orange-600 p-2 rounded-xl hover:bg-orange-200 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-orange-600">
                    Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                    Selamat datang kembali, {getFirstName(userName)}! ✨
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                    <span className="hidden sm:inline font-medium">
                      Notifikasi
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center px-2 py-2 sm:px-4 sm:py-3 bg-amber-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full mr-0 sm:mr-3 flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {getInitials(userName ?? "")}
                      </span>
                    </div>
                    <span className="hidden sm:inline mr-2 font-semibold">
                      {getFirstName(userName ?? "")}
                    </span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statsCards.map((card, index) => (
              <StatsCard key={index} card={card} index={index} />
            ))}
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Activity Graph */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Grafik Aktivitas 7 Hari
                </h3>
                <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all duration-300 shadow-md text-sm">
                  7 Hari
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="h-48 sm:h-72 bg-orange-50 rounded-2xl border border-orange-200 shadow-md p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                    <XAxis dataKey="date" stroke="#ea580c" />
                    <YAxis domain={[0, 5]} stroke="#ea580c" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff7ed",
                        borderColor: "#fed7aa",
                        color: "#ea580c",
                      }}
                    />
                    <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Aktivitas Terbaru
                </h3>
                <button className="px-3 py-2 sm:px-5 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm flex items-center">
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Tambah Baru</span>
                  <span className="sm:hidden">Tambah</span>
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-4 sm:p-5 border border-gray-100 rounded-2xl bg-orange-50 hover:shadow-lg transition-all duration-300 transform hover:scale-102 ${
                      animateStats
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar Icon */}
                      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-md text-2xl">
                        {activityIcon[activity.status as ActivityType]}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                            {activity.type}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {activity.time}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600">
                          {activity.activity}
                        </p>

                        {/* Badge */}
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            activity.status === "Game Dev"
                              ? "bg-blue-100 text-blue-700"
                              : activity.status === "UI/UX"
                              ? "bg-purple-100 text-purple-700"
                              : activity.status === "AR/VR"
                              ? "bg-green-100 text-green-700"
                              : activity.status === "Workshop"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 text-center">
                <button className="flex items-center justify-center mx-auto text-orange-600 hover:text-orange-800 font-bold transition-colors group text-sm">
                  Lihat semua aktivitas
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-600 mb-4 md:mb-0 font-medium text-center md:text-left">
                © 2025{" "}
                <span className="font-bold text-orange-600">Laboratorium MMT</span>. Hak Cipta Dilindungi.
              </div>
              <div className="flex items-center space-x-6 sm:space-x-8">
                <button
                  onClick={() => alert("About Us coming soon!")}
                  className="text-xs sm:text-sm text-orange-500 hover:text-orange-700 transition-colors font-semibold"
                >
                  About Us
                </button>
                <button
                  onClick={() => alert("Help center coming soon!")}
                  className="text-xs sm:text-sm text-orange-500 hover:text-orange-700 transition-colors font-semibold"
                >
                  Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;