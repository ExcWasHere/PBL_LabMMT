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

  const navItems = ["Beranda", "Project", "News", "Gallery", "Masuk"];

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
            href={
              item === "Beranda"
                ? "/"
                : `/${item.toLowerCase().replace(/\s+/g, "-")}`
            }
            className={`block py-3 px-4 rounded-lg transition-all duration-200 
              ${
                activeItem === item
                  ? "bg-orange-500 text-white"
                  : isDarkMode
                    ? "text-gray-200 hover:bg-gray-700"
                    : "text-gray-800 hover:bg-orange-100"
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
        className="w-full top-0 left-0 z-50 fixed h-16 md:h-16 flex justify-between items-center shadow-xl px-4 md:px-10 transition-all duration-500"
      >
        <div className="flex items-center gap-3">
          <img src="/logo/jti.png" alt="Logo 1" className="w-100% h-8" />
          <img src="/logo/labMMT.png" alt="Logo 2" className="w-100% h-10" />

          {/* Brand MMT */}
          {!isMobileMenuOpen && (
            <h1 className="text-xl md:text-2xl font-bold transition-transform duration-300 hover:scale-105">
              Laboratorium<span className="text-orange-400">MMT</span>
            </h1>
          )}
        </div>

        {/* Desktop Ver. */}
        <nav className="hidden md:block">
          <ul className="flex gap-4 font-medium items-center">
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
          className="md:hidden text-2xl p-2 rounded-full hover:bg-orange-400 transition-colors duration-200"
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
                    ? "text-white"
                    : "text-gray-800"
              }
            />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <button
        className={`fixed inset-0 bg-transparent bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-label="Close menu overlay"
      />

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 w-64 h-full shadow-xl z-50 transform transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl ${
          isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
        }`}
      >
        <div
          className={`p-4 flex justify-between items-center border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
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
            <li className="px-4">
              <button
                onClick={toggleDarkMode}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "hover:bg-orange-100 text-gray-800"
                }`}
              >
                <span>Dark Mode</span>
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
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