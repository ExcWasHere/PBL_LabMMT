import { useState } from "react";
import type { FC, ReactNode } from "react";
import {
  LayoutGrid,
  FolderKanban,
  Newspaper,
  Image as ImageIcon,
  Users2,
  Home,
  LogOut,
  User,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: ReactNode;
  danger?: boolean;
}

const Sidebar: FC = () => {
  const [active, setActive] = useState<string>("Dasbor");

  const menuTop: MenuItem[] = [
    { name: "Dashboard", icon: <LayoutGrid size={18} /> },
    { name: "Project", icon: <FolderKanban size={18} /> },
    { name: "News", icon: <Newspaper size={18} /> },
    { name: "Gallery", icon: <ImageIcon size={18} /> },
    { name: "Members", icon: <Users2 size={18} /> },
  ];

  const menuBottom: MenuItem[] = [
    { name: "Beranda", icon: <Home size={18} /> },
    { name: "Keluar", icon: <LogOut size={18} />, danger: true },
  ];

  return (
    <div className="w-64 h-screen bg-[#f6ece4] border-r border-gray-300 p-5 flex flex-col justify-between fixed">
      {/* profile section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img
            src="../member/person1.jpg"
            className="w-12 h-12 rounded-full"
            alt="profile"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-base">KetuaLab</h3>{" "}
            {/* Ukuran teks lebih besar */}
            <p className="text-xs text-gray-600">user@gmail.com</p>
          </div>
        </div>

        {/* Profile Button */}
        <button
          className="bg-white px-4 py-2 rounded text-sm flex items-center gap-1 w-full text-center justify-center
                           text-gray-700 hover:bg-gray-100 transition mb-6"
        >
          {" "}
          {/* Padding dan hover */}
          <User size={14} /> Profil
        </button>

        {/* Top Menu */}
        <div className="space-y-1">
          {" "}
          {menuTop.map((m) => (
            <button
              key={m.name}
              onClick={() => setActive(m.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition
              ${
                active === m.name
                  ? "bg-orange-500 text-white"
                  : "text-gray-800 hover:bg-orange-200/60"
              }`}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="space-y-1">
        <hr className="my-3 border-gray-300" />
        {menuBottom.map((m) => (
          <button
            key={m.name}
            onClick={() => setActive(m.name)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition
            ${
              m.danger
                ? "text-red-600 hover:bg-red-100"
                : "text-gray-800 hover:bg-orange-200/60"
            }`}
          >
            {m.icon} {m.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
