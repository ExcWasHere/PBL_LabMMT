import { useEffect, useState } from "react";
import type { FC, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  FolderKanban,
  Newspaper,
  Image as ImageIcon,
  Users2,
  Home,
  LogOut,
  User,
  X, // Tambahkan import X
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: ReactNode;
  danger?: boolean;
  route?: string;
}

// Tambahkan Interface Props
interface SidebarProps {
  onClose?: () => void;
}

// Update definisi component menerima props
const Sidebar: FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState<string>("Dashboard");
  const [profile, setProfile] = useState<{
    name?: string;
    email?: string;
    bio?: string;
    photo?: string;
  } | null>(null);

  const menuTop: MenuItem[] = [
    {
      name: "Dashboard",
      route: "/dashboard-student",
      icon: <LayoutGrid size={18} />,
    },
    {
      name: "Project",
      route: "/dashboard-student-project",
      icon: <FolderKanban size={18} />,
    },
    {
      name: "News",
      route: "/dashboard-student-news",
      icon: <Newspaper size={18} />,
    },
    {
      name: "Gallery",
      route: "/dashboard-student-gallery",
      icon: <ImageIcon size={18} />,
    },
    {
      name: "Members",
      route: "/dashboard-student-member",
      icon: <Users2 size={18} />,
    },
  ];

  const menuBottom: MenuItem[] = [
    { name: "Home", route: "/", icon: <Home size={18} /> },
    {
      name: "Logout",
      route: "/sign-in",
      icon: <LogOut size={18} />,
      danger: true,
    },
  ];

  const getPhotoUrl = (raw?: string) => {
    if (!raw) return "../member/person1.jpg";
    if (raw.startsWith("/uploads")) {
      return `http://localhost:3000${raw}`;
    }
    return raw;
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const activeTopMenu = menuTop.find((m) => m.route === currentPath);
    if (activeTopMenu) {
      setActive(activeTopMenu.name);
      return;
    }
    const activeBottomMenu = menuBottom.find((m) => m.route === currentPath);
    if (activeBottomMenu) {
      setActive(activeBottomMenu.name);
      return;
    }
    setActive("Dashboard");
  }, [location.pathname]);

  useEffect(() => {
    loadProfile();
    const handleStorageChange = () => {
      loadProfile();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.name ?? data.fullname ?? data.username ?? "KetuaLab",
          email: data.email ?? "user@gmail.com",
          bio: data.bio ?? data.status ?? "Belum ada bio",
          photo: data.photo ?? "",
        });
      } else {
        loadFromLocalStorage();
      }
    } catch (e) {
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile({
          name: parsed.name ?? parsed.fullname ?? parsed.username ?? "KetuaLab",
          email: parsed.email ?? "user@gmail.com",
          bio: parsed.bio ?? parsed.status ?? "Belum ada bio",
          photo: parsed.photo ?? "",
        });
      } else {
        setProfile({
          name: "KetuaLab",
          email: "user@gmail.com",
          bio: "Belum ada bio",
          photo: "",
        });
      }
    } catch {
      setProfile({
        name: "KetuaLab",
        email: "user@gmail.com",
        bio: "Belum ada bio",
        photo: "",
      });
    }
  };

  const handleNavigation = (menuItem: MenuItem) => {
    if (menuItem.route) {
      navigate(menuItem.route);
    }
    // Update logic navigasi untuk menutup sidebar di mobile
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    // Update className agar support responsive mobile (z-index, shadow, overflow)
    <div className="w-64 h-screen bg-[#f6ece4] border-r border-gray-300 p-5 flex flex-col justify-between fixed left-0 top-0 z-50 overflow-y-auto shadow-lg lg:shadow-none">
      {/* profile section */}
      <div>
        {/* Tambahkan Tombol Close (X) hanya untuk mobile */}
        <div className="lg:hidden flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Bio Cloud */}
        {profile?.bio && (
          <div className="mb-4 relative">
            <div className="bg-white rounded-2xl p-3 shadow-md border-2 border-orange-200 relative">
              <div className="absolute -top-5 -left-3 text-3xl">☁️</div>
              <div className="absolute -top-5 -right-4 text-3xl rotate-12">
                ☁️
              </div>
              <p className="text-xs text-gray-700 italic text-center leading-relaxed">
                "{profile.bio}"
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <img
            src={getPhotoUrl(profile?.photo)}
            className="w-12 h-12 rounded-full object-cover"
            alt="profile"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              {profile?.name ?? "KetuaLab"}
            </h3>
            <p className="text-xs text-gray-600">
              {profile?.email ?? "user@gmail.com"}
            </p>
          </div>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => navigate("/profil")}
          className="bg-white px-4 py-2 rounded text-sm flex items-center gap-1 w-full text-center justify-center
                           text-gray-700 hover:bg-gray-100 transition mb-6"
        >
          <User size={14} /> Profil
        </button>

        {/* Top Menu */}
        <div className="space-y-1">
          {menuTop.map((m) => (
            <button
              key={m.name}
              onClick={() => handleNavigation(m)}
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
      <div className="space-y-1 mt-6">
        <hr className="my-3 border-gray-300" />
        {menuBottom.map((m) => (
          <button
            key={m.name}
            onClick={() => handleNavigation(m)}
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