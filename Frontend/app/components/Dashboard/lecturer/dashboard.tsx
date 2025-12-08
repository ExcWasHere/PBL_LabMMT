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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { project_dummy, news_dummy, gallery_dummy } from "./dataDummy";
import { io, Socket } from "socket.io-client";

type TrafficPoint = { date: string; dayLabel?: string; views: number };

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");

  const sumProperty = (data: any[], key: string) => {
    return data.reduce((acc, curr) => acc + (parseInt(curr[key]) || 0), 0);
  };

  const publishedProperty = (data: any[], key: string) => {
    return data
      .filter((item) => item.status === "Published")
      .reduce((acc, curr) => acc + (parseInt(curr[key]) || 0), 0);
  };

  const countPublishedOnly = (data: any[]) => {
    return data.filter((item) => item.status === "Published").length;
  };

  const stats = [
    {
      label: "Total Project",
      value: countPublishedOnly(project_dummy),
      icon: <FolderKanban size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total News",
      value: countPublishedOnly(news_dummy),
      icon: <Newspaper size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Video",
      value: publishedProperty(gallery_dummy, "video"),
      icon: <Video size={24} />,
      color: "border-orange-400",
    },
    {
      label: "Total Photo",
      value: publishedProperty(gallery_dummy, "photo"),
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

  const recentActivities = [
    {
      user: "resty",
      activity: "Workshop Mobile",
      time: "2 jam yang lalu",
      color: "bg-orange-500",
    },
    {
      user: "budi",
      activity: "Update Berita Q4",
      time: "5 jam yang lalu",
      color: "bg-blue-500",
    },
    {
      user: "citra",
      activity: "Upload Gallery Event",
      time: "1 hari yang lalu",
      color: "bg-green-500",
    },
  ];

  const totalViews = trafficData.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="flex relative min-h-screen bg-[#fef7f2]">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}

      <div
        className={`w-full p-4 md:p-8 transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-600">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border rounded-lg p-6 ${stat.color} hover:shadow-md transition`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-orange-500 mb-2">{stat.icon}</div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-orange-500">
                  {stat.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 bg-white border border-orange-400 rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-orange-600">
                Total Views
              </h3>
            </div>

            {isLoadingTraffic ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading data...</p>
                </div>
              </div>
            ) : trafficData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-500 mb-2">
                    Belum ada data pengunjung
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center rounded-lg p-4">
                  <p className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">
                    {totalViews.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Views{" "}
                    {trafficData.length > 0 && `(${trafficData.length} days)`}
                  </p>
                </div>

                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
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
                        labelFormatter={(label) => `Day: ${label}`}
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
                </div>
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
            <h3 className="text-lg md:text-xl font-semibold text-orange-600 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                  >
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 truncate">{activity.user}</p>
                    <p className="font-medium text-gray-800 break-words">
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