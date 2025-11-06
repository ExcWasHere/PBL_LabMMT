import { useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {}

const Navbar: React.FC<HeaderProps> = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("Beranda");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const currentPage = useLocation();

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else if (scrollPosition === 0) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const path = currentPage.pathname;
    if (path === "/") {
      setActiveItem("Beranda");
    } else {
      const matchedItem = navItems.find(
        (item) => path === `/${item.toLowerCase().replace(/\s+/g, "-")}`
      );
      if (matchedItem) setActiveItem(matchedItem);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage.pathname]);

  const navItems = ["Beranda", "Proyek", "Berita", "Galeri", "Masuk"];

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <li key={item} className="relative group">
          <a
            href={`${
              item === "Beranda"
                ? "/"
                : `/${item.toLowerCase().replace(/\s+/g, "-")}`
            }`}
            className={`py-2 px-3 rounded-lg transition-all duration-300 block 
              ${
                activeItem === item
                  ? "text-orange-500 font-bold"
                  : "hover:text-orange-500"
              }`}
            onClick={() => {
              setActiveItem(item);
              setIsMobileMenuOpen(false);
            }}
          >
            {item}
          </a>
        </li>
      ))}
    </>
  );

  const MobileNavLinks = () => (
    <>
      {navItems.map((item) => (
        <li key={item} className="px-4">
          <a
            href={`${
              item === "Beranda"
                ? "/"
                : `/${item.toLowerCase().replace(/\s+/g, "-")}`
            }`}
            style={{
              backgroundColor: activeItem === item ? "#0ea5e9" : "transparent",
              color:
                activeItem === item
                  ? "white"
                  : isDarkMode
                    ? "#000000"
                    : "#1f2937",
            }}
            className="block py-3 px-4 rounded-lg transition-all duration-200 hover:bg-orange-100"
            onClick={() => {
              setActiveItem(item);
              setIsMobileMenuOpen(false);
            }}
          >
            {item}
          </a>
        </li>
      ))}
    </>
  );

  return (
    <>
      <div
        style={{
          backgroundColor:
            isScrolled || isMobileMenuOpen
              ? isDarkMode
                ? "#000000"
                : "#ffffff"
              : isDarkMode
                ? "rgba(0, 0, 0, 0.3)"
                : "rgba(255, 255, 255, 0.2)",
          color: isDarkMode
            ? "#ffffff"
            : isScrolled || isMobileMenuOpen
              ? "#1f2937"
              : "#ffffff",
        }}
        className="w-full top-0 left-0 z-50 fixed h-16 md:h-20 flex justify-between items-center shadow-xl px-4 md:px-10 transition-all duration-500"
      >
        <div className="flex items-center gap-3">
          <img
            src="/logo/jti.png"
            alt="Logo 1"
            className="w-10 h-10"
          />
          <img
            src="/logo/labMMT.png"
            alt="Logo 2"
            className="w-10 h-13"
          />

          {/* Brand Name */}
          <h1 className="text-xl md:text-2xl font-bold transition-transform duration-300 hover:scale-105">
            Laboratorium<span className="text-orange-400">MMT</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-4 font-semibold items-center">
            <NavLinks />
            {/* Dark Mode Button */}
            <li>
              <button
                onClick={toggleDarkMode}
                style={{
                  backgroundColor: isDarkMode ? "#000000" : "transparent",
                }}
                className="p-2 rounded-lg hover:bg-orange-100 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-orange-500" />
                ) : (
                  <Moon className="w-5 h-5 text-orange-500" />
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl p-2 rounded-full hover:bg-orange-100 transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="text-orange-500" />
          ) : (
            <Menu
              className={
                isScrolled
                  ? "text-orange-500"
                  : isDarkMode
                    ? "text-black"
                    : "text-white"
              }
            />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <button
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
        aria-label="Close menu overlay"
        tabIndex={isMobileMenuOpen ? 0 : -1}
      />

      {/* Mobile Menu */}
      <div
        style={{
          backgroundColor: isDarkMode ? "#000000" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#1f2937",
        }}
        className={`fixed right-0 top-0 w-64 h-full shadow-xl z-50 transform transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl`}
      >
        <div
          style={{
            borderBottom: isDarkMode
              ? "1px solid #374151"
              : "1px solid #f3f4f6",
          }}
          className="p-4 flex justify-between items-center"
        >
          <h1 className="text-xl font-bold">
            Laboratorium<span className="text-orange-500">MMT</span>
          </h1>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="text-orange-500" />
          </button>
        </div>
        <nav className="py-6">
          <ul className="flex flex-col gap-2 font-semibold">
            <MobileNavLinks />
            {/* Dark Mode Mobile Menu */}
            <li className="px-4">
              <button
                onClick={toggleDarkMode}
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "transparent",
                }}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-orange-100 hover:text-orange-500 transition-all duration-200"
              >
                <span>Dark Mode</span>
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;