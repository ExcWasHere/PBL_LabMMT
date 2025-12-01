import Sidebar from "~/components/Dashboard/viewer/sidebar";
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

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");

  const stats = [
    {
      label: "Total Project",
      value: 40,
      icon: <FolderKanban size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total News",
      value: 40,
      icon: <Newspaper size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Video",
      value: 40,
      icon: <Video size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Photo",
      value: 40,
      icon: <Image size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Members",
      value: 40,
      icon: <Users2 size={24} />,
      color: "border-orange-400",
    },
  ];

  const recentActivities = [
    {
      user: "resty",
      activity: "Workshop Mobile",
      time: "2 jam yang lalu",
      color: "bg-orange-500",
    },
    {
      user: "budi speed",
      activity: "Update Berita A1",
      time: "5 jam yang lalu",
      color: "bg-blue-500",
    },
    {
      user: "ariel tatum",
      activity: "Upload Gallery Event",
      time: "1 hari yang lalu",
      color: "bg-green-500",
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

  const totalViews = trafficData.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div
        className={`w-full p-8 transition-all duration-300 ease-in-out bg-white min-h-screen ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border rounded-lg p-6 ${stat.color} hover:shadow-md transition`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-orange-500 mb-2">{stat.icon}</div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <h2 className="text-4xl font-bold text-orange-500">
                  {stat.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic & Recent Activity */}
        <div className="grid grid-cols-3 gap-6">
          {/* Total Views */}
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
                {/* Total Views Summary */}
                <div className="mb-6 text-center rounded-lg p-4">
                  <p className="text-4xl font-bold text-orange-600 mb-1">
                    {totalViews.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Views{" "}
                    {trafficData.length > 0 && `(${trafficData.length} hari)`}
                  </p>
                </div>

                {/* Chart */}
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
                ? `Tracking sejak ${new Date(trafficData[0].date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
                : "Jumlah pengunjung landing page per hari"}
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-orange-400 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
                  >
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{activity.user}</p>
                    <p className="font-medium text-gray-800">
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}