import { Gamepad2, PenTool, Glasses } from "lucide-react";
import { useEffect, useState } from "react";

export default function IndexHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    try {
      let sessionId = localStorage.getItem("pv_session");
      if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem("pv_session", sessionId);
      }
      const payload = JSON.stringify({ path: "/", sessionId });

      if (navigator.sendBeacon) {
        try {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon("http://localhost:3000/api/analytics/view", blob);
        } catch (err) {
          fetch("http://localhost:3000/api/analytics/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
          }).catch(console.error);
        }
      } else {
        fetch("http://localhost:3000/api/analytics/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        }).catch(console.error);
      }
    } catch (err) {
      console.error("analytics error", err);
    }
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full mx-auto overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/home/LabCondition.jpg"
          className="absolute inset-0 object-cover w-full h-full"
          style={{ objectPosition: "center center", filter: "brightness(45%)" }}
          alt="bannerLab"
        />

        <div className="h-full w-full absolute inset-0 bg-gradient-to-t from-orange-500/30 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-10">
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } max-w-4xl mx-auto`}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                { label: "Game Dev", icon: <Gamepad2 size={14} /> },
                { label: "UI/UX", icon: <PenTool size={14} /> },
                { label: "AR/VR", icon: <Glasses size={14} /> },
              ].map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs sm:text-sm rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium flex items-center gap-1 animate-floating"
                  style={{ animationDuration: `${3 + index * 0.5}s` }}
                >
                  {tag.icon}
                  {tag.label}
                </span>
              ))}
            </div>

            <h1 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-md">
              Welcome To Lab{" "}
              <span className="text-orange-500 block sm:inline">
                Multimedia Mobile Tech
              </span>
            </h1>

            <p className="text-white text-sm sm:text-base md:text-lg max-w-2xl mx-auto drop-shadow-sm px-2">
              A place for students and lecturers to collaborate in creating
              innovative multimedia works that change the digital world.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floating {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .animate-floating {
          animation: floating ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}