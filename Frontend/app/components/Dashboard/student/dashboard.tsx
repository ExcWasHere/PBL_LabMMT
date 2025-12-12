import Sidebar from "~/components/Dashboard/lecturer/sidebar";
import { useState, useEffect } from "react";
import {
  Menu,
  FolderKanban,
  Newspaper,
  Image,
  Users2,
  Video,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TrafficPoint = { date: string; dayLabel?: string; views: number };

interface StatsData {
  totalProject: number;
  totalNews: number;
  totalVideo: number;
  totalPhoto: number;
  totalMembers: number;
}

type RecentActivity = {
  user: string;
  activity: string;
  at: string;
  type: string;
};

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "baru saja";
  if (diffMin < 60) return `${diffMin} minute ago`;
  if (diffHours < 24) return `${diffHours} hour ago`;
  if (diffDays < 7) return `${diffDays} day ago`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getActivityColor(type: string): string {
  switch (type) {
    case "project":
      return "bg-orange-500";
    case "news":
      return "bg-blue-500";
    case "photo":
      return "bg-green-500";
    case "video":
      return "bg-purple-500";
    case "member":
      return "bg-pink-500";
    default:
      return "bg-gray-400";
  }
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");

  const [statsData, setStatsData] = useState<StatsData>({
    totalProject: 0,
    totalNews: 0,
    totalVideo: 0,
    totalPhoto: 0,
    totalMembers: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  const stats = [
    {
      label: "Total Project",
      value: statsData.totalProject,
      icon: <FolderKanban size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total News",
      value: statsData.totalNews,
      icon: <Newspaper size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Video",
      value: statsData.totalVideo,
      icon: <Video size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Photo",
      value: statsData.totalPhoto,
      icon: <Image size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Members",
      value: statsData.totalMembers,
      icon: <Users2 size={24} />,
      color: "border-orange-400",
    },
  ];

  function rowsToPoints(rows: any[]): TrafficPoint[] {
    if (!rows || !Array.isArray(rows)) return [];

    const points = rows
      .map((r: any) => {
        const date = String(r.date ?? r.day ?? "");
        let label: string | undefined = undefined;
        try {
          const d = new Date(date);
          if (!isNaN(d.getTime())) {
            label = d.toLocaleDateString("id-ID", { weekday: "short" });
          }
        } catch {}
        return {
          date,
          dayLabel: label || String(r.dayLabel ?? r.label ?? "").slice(0, 3),
          views: Number(r.views ?? r.count ?? 0),
        } as TrafficPoint;
      })
      .filter((p: TrafficPoint) => p.date)
      .sort((a: TrafficPoint, b: TrafficPoint) =>
        a.date > b.date ? 1 : a.date < b.date ? -1 : 0
      );

    return points;
  }

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const res = await fetch("http://localhost:3000/stats");

        if (!res.ok) {
          console.error("Failed to fetch stats");
          return;
        }
        const data = await res.json();
        setStatsData({
          totalProject: data.totalProject || 0,
          totalNews: data.totalNews || 0,
          totalVideo: data.totalVideo || 0,
          totalPhoto: data.totalPhoto || 0,
          totalMembers: data.totalMembers || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTraffic = async () => {
      setIsLoadingTraffic(true);

      try {
        const res = await fetch("http://localhost:3000/api/analytics/landing");

        if (!res.ok) {
          setTrafficData([]);
          return;
        }

        const data = await res.json();
        const pts = rowsToPoints(data);
        setTrafficData(pts);
      } catch (err) {
        console.error("Failed to fetch traffic data:", err);
        setTrafficData([]);
      } finally {
        setIsLoadingTraffic(false);
      }
    };

    fetchTraffic();
    const socket: Socket = io("http://localhost:3000/analytics", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("traffic_update", (data: any[]) => {
      const incoming = rowsToPoints(data);
      if (!incoming || incoming.length === 0) return;

      setTrafficData((prev) => {
        const map = new Map(prev.map((p) => [p.date, p]));
        incoming.forEach((p) => map.set(p.date, p));
        const merged = Array.from(map.values()).sort((a, b) =>
          a.date > b.date ? 1 : a.date < b.date ? -1 : 0
        );
        return merged;
      });

      setIsLoadingTraffic(false);
    });

    return () => {
      socket.off("traffic_update");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoadingActivity(true);
      try {
        const res = await fetch(
          "http://localhost:3000/activity/recent?limit=3"
        );
        if (!res.ok) {
          setRecentActivities([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentActivities(data);
        } else {
          setRecentActivities([]);
        }
      } catch (err) {
        console.error("Failed to fetch recent activities:", err);
        setRecentActivities([]);
      } finally {
        setIsLoadingActivity(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalViews = trafficData.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div
        className={`w-full p-8 transition-all duration-300 ease-in-out bg-white min-h-screen ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Dashboard</h1>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border rounded-lg p-6 ${stat.color} hover:shadow-md transition`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-orange-500 mb-2">{stat.icon}</div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                {isLoadingStats ? (
                  <div className="h-10 w-16 animate-pulse bg-gray-200 rounded mt-1"></div>
                ) : (
                  <h2 className="text-4xl font-bold text-orange-500">
                    {stat.value}
                  </h2>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border border-orange-400 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-orange-600">
                Total Views
              </h3>
            </div>

            {isLoadingTraffic ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              </div>
            ) : trafficData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-500 mb-2">
                    Belum ada data pengunjung
                  </p>
                  <p className="text-xs text-gray-400">
                    Data akan muncul setelah ada yang mengunjungi landing page
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center rounded-lg p-4">
                  <p className="text-4xl font-bold text-orange-600 mb-1">
                    {totalViews.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Views{" "}
                    {trafficData.length > 0 && `(${trafficData.length} hari)`}
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="dayLabel"
                      stroke="#666"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#666"
                      style={{ fontSize: "12px" }}
                      allowDecimals={false}
                      domain={[0, "auto"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ea580c",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: any) => [value, "Views"]}
                      labelFormatter={(label) => `Hari: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#ea580c"
                      strokeWidth={3}
                      dot={{ fill: "#ea580c", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}

            <p className="text-sm text-gray-500 mt-4 text-center">
              {trafficData.length > 0
                ? `Tracking since ${new Date(
                    trafficData[0].date
                  ).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}`
                : "Jumlah pengunjung landing page per hari"}
            </p>
          </div>

          <div className="bg-white border border-orange-400 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {isLoadingActivity ? (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </>
              ) : recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Belum ada aktivitas terbaru.
                </p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${getActivityColor(
                        activity.type
                      )} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
                    >
                      {(activity.user || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{activity.user}</p>
                      <p className="font-medium text-gray-800">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(activity.at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
