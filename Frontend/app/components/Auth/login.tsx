import { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserCircle,
} from "lucide-react";

type Role = "admin" | "dosen" | "mahasiswa" | "viewer";

export default function AuthPages() {
  const [currentPage, setCurrentPage] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Laboratorium MMT";
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerRole, setRegisterRole] = useState<Role>("mahasiswa");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [validationField, setValidationField] = useState("");
  const slides = [
    { src: "/images/photo-1.jpg", alt: "Foto 1" },
    { src: "/images/photo-2.jpg", alt: "Foto 2" },
    { src: "/images/photo-3.jpg", alt: "Foto 3" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef<number | null>(null);
  const AUTO_PLAY_MS = 3500;

  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      if (idx <= fullText.length) {
        setDisplayText(fullText.slice(0, idx));
        idx++;
      } else {
        clearInterval(t);
        setTimeout(() => setIsAnimating(false), 400);
      }
    }, 120);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, AUTO_PLAY_MS);
  };
  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };
  const goTo = (i: number) => {
    stopAutoPlay();
    setActiveIndex(i);
    setTimeout(() => startAutoPlay(), 2500);
  };

  const handleLoginSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Email atau password salah");
      setIsLoading(false);
      return;
    }
    const token = data.access_token ?? data.token ?? null;
    const user = data.data ?? data.user ?? { name: "", role: "" };
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role ?? "");
    }
    if (user.role === "admin") window.location.href = "/dashboard-admin";
    else if (user.role === "dosen") window.location.href = "/dashboard-dosen";
    else window.location.href = "/dashboard-viewer";

  } catch (err) {
    alert("Gagal terhubung ke server!");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
const handleRegisterSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  if (registerPassword !== registerConfirmPassword) {
    alert("Password dan konfirmasi password tidak cocok!");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        role: registerRole,
        password: registerPassword,
        validationField,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registrasi gagal");
      setIsLoading(false);
      return;
    }
    const token = data.access_token ?? data.token ?? null;
    const user = data.data ?? data.user ?? { name: registerName, role: registerRole };
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role ?? registerRole);
    }

    alert("Registrasi berhasil!");
    if (user.role === "admin") window.location.href = "/dashboard-admin";
    else if (user.role === "dosen") window.location.href = "/dashboard-dosen";
    else window.location.href = "/dashboard-viewer";

  } catch (err) {
    console.error(err);
    alert("Gagal terhubung ke server.");
  } finally {
    setIsLoading(false);
  }
};
  const getValidationLabel = () => {
    switch (registerRole) {
      case "mahasiswa":
        return "NIM";
      case "dosen":
        return "NIP";
      case "admin":
        return "ID Admin";
      case "viewer":
        return "ID Viewer";
      default:
        return "ID";
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/latar-belakang.svg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor-blink { animation: blink 1s infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}}
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Typewriter */}
      {isAnimating && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-center">
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {displayText}
            </span>
            <span className="cursor-blink ml-1 text-orange-500">|</span>
          </h1>
        </div>
      )}

      {/* Main form */}
      <div
        className={`w-full max-w-6xl transition-all duration-700 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      >
        <div className="bg-white/95 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="grid md:grid-cols-2 gap-0">
            {/* LEFT */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center gap-2 text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg mb-6 w-fit transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Kembali
              </button>

              {/* Greetings */}
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                    Laboratorium MMT
                  </span>
                </h1>
                <p className="text-gray-600 text-sm md:text-base mt-2">
                  Hai biar ga asing, langsung masuk aja ya king. <br /> Selamat datang di LabMMT! 👋
                </p>
              </div>

              {/* Pilihan masuk */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setCurrentPage("login")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${currentPage === "login" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage("register")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${currentPage === "register" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Register
                </button>
              </div>

              {/* FORM AREA */}
              <div className="w-full max-w-xl">
                {/* LOGIN */}
                {currentPage === "login" && (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="Masukkan email anda"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="Masukkan sandi anda"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                        )}
                      </button>
                    </div>

                    {/* LOGIN button */}
                    <button
                      onClick={handleLoginSubmit}
                      disabled={isLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        "Masuk"
                      )}
                    </button>

                    {/* Atau */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">
                          atau
                        </span>
                      </div>
                    </div>

                    {/* Google */}
                    <div className="grid grid-cols-1 gap-4">
                      <button
                        onClick={() =>
                          alert("Login with Google - integrate real OAuth flow")
                        }
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                          Masuk dengan Google
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* REGISTER */}
                {currentPage === "register" && (
                  <div className="space-y-4">
                    {/* name, email, role, validation, password, confirm, submit */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="Masukkan nama anda"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="Masukkan email anda"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={registerRole}
                        onChange={(e) => {
                          setRegisterRole(e.target.value as Role);
                          setValidationField("");
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="dosen">Dosen</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={validationField}
                        onChange={(e) => setValidationField(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder={`Masukkan ${getValidationLabel()} anda`}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="Masukkan sandi anda"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerConfirmPassword}
                        onChange={(e) =>
                          setRegisterConfirmPassword(e.target.value)
                        }
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="Konfirmasi sandi anda"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handleRegisterSubmit}
                      disabled={isLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        "Daftar"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex items-center justify-center p-8 bg-transparent relative">
              <div className="relative w-[420px] h-[360px]">
                {/* Slides */}
                {slides.map((s, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={s.src}
                      className={`absolute inset-0 rounded-2xl overflow-hidden shadow-xl transition-all duration-700 transform ${
                        isActive
                          ? "opacity-100 translate-y-0 scale-100 z-20"
                          : "opacity-0 translate-y-6 scale-95 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={s.src}
                        alt={s.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}

                {/* Dots */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-5 flex items-center gap-3">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? "bg-orange-500 shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110"
                          : "bg-gray-400 hover:bg-gray-500 scale-95"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
