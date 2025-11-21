"use client";

import { Gamepad2, PenTool, Glasses } from "lucide-react";
import { useEffect, useState } from "react";

export default function IndexHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] md:h-screen w-full mx-auto overflow-hidden">
      <div className="absolute inset-0">
        {/* Banner */}
        <img
          src="/home/kondisiLab.jpg"
          className="absolute inset-0 object-cover w-full h-full"
          style={{ objectPosition: "center center", filter: "brightness(45%)" }}
          alt="bannerLab"
        />

        {/* Soft Gradient */}
        <div className="h-full w-full absolute inset-0 bg-gradient-to-t from-orange-500/30 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            {/* TAGS */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { label: "Game Dev", icon: <Gamepad2 size={14} /> },
                { label: "UI/UX", icon: <PenTool size={14} /> },
                { label: "AR/VR", icon: <Glasses size={14} /> },
              ].map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs md:text-sm rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium flex items-center gap-1 animate-floating"
                  style={{ animationDuration: `${3 + index * 0.5}s` }}
                >
                  {tag.icon}
                  {tag.label}
                </span>
              ))}
            </div>

            <h1 className="text-white text-4xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-md">
              Selamat Datang <br />
              di Lab <span className="text-orange-400">Multimedia Mobile Tech</span>
            </h1>

            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
              Tempat kolaborasi mahasiswa dan dosen dalam menciptakan karya multimedia inovatif yang mengubah dunia digital.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Animation */}
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
