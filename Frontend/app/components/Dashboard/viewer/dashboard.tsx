import Sidebar from "app/common/sidebar";
import { useState } from "react";
import { Menu, FolderKanban, Newspaper, Image, Users2, Video } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = [
    { label: "Total Project", value: 40, icon: <FolderKanban size={24} />, color: "border-orange-400" },
    { label: "Total News", value: 40, icon: <Newspaper size={24} />, color: "border-orange-400" },
    { label: "Total Video", value: 40, icon: <Video size={24} />, color: "border-orange-400" },
    { label: "Total Photo", value: 40, icon: <Image size={24} />, color: "border-orange-400" },
    { label: "Total Members", value: 40, icon: <Users2 size={24} />, color: "border-orange-400" },
  ];

  const trafficData = [
    { day: "Mon", views: 120 },
    { day: "Tue", views: 180 },
    { day: "Wed", views: 150 },
    { day: "Thu", views: 220 },
    { day: "Fri", views: 280 },
    { day: "Sat", views: 200 },
    { day: "Sun", views: 160 },
  ];

  const recentActivities = [
    { user: "resty", activity: "Workshop Mobile", time: "2 jam yang lalu", color: "bg-orange-500" },
    { user: "budi", activity: "Update Berita Q4", time: "5 jam yang lalu", color: "bg-blue-500" },
    { user: "citra", activity: "Upload Gallery Event", time: "1 hari yang lalu", color: "bg-green-500" },
  ];

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar />}

      <div 
        className={`w-full p-8 transition-all duration-300 ease-in-out bg-[#fef7f2] min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 text-gray-700 hover:text-orange-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Dasbor</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border-2 rounded-lg p-6 ${stat.color} hover:shadow-md transition`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-orange-500 mb-2">{stat.icon}</div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <h2 className="text-4xl font-bold text-orange-500">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic & Recent Activity */}
        <div className="grid grid-cols-3 gap-6">
          {/* Total Traffic */}
          <div className="col-span-2 bg-white border-2 border-orange-400 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">Total Traffic</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #ea580c',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#ea580c" 
                  strokeWidth={3}
                  dot={{ fill: '#ea580c', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Jumlah pengunjung landing page per hari minggu ini
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border-2 border-orange-400 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{activity.user}</p>
                    <p className="font-medium text-gray-800">{activity.activity}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
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