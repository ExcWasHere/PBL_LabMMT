import { useEffect, useState } from "react";
import { Gamepad2, PenTool, Glasses } from "lucide-react";

export default function IndexHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[100dvh] md:min-h-screen w-full mx-auto overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/home/newsPage.jpg"
          className="absolute inset-0 object-cover w-full h-full"
          style={{
            objectPosition: "center center",
            filter: "brightness(40%)",
          }}
          alt="bannerLab"
        />

        <div className="h-full w-full absolute inset-0 bg-gradient-to-t from-orange-400 via-transparent to-transparent opacity-20" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8">

          <div className={`flex flex-wrap justify-center gap-3 mb-4 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}>
            {[
            ].map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs md:text-sm rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium flex items-center gap-1 animate-bounce"
                style={{
                  animationDuration: `${1 + index * 0.3}s`,
                }}
              >
               {tag}
              </span>
            ))}
          </div>

          <h1 
            className={`text-white text-3xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight transform transition-all duration-700 ease-out delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Featured <span className="text-orange-500">News</span>
          </h1>

          <p 
            className={`text-white text-sm sm:text-lg md:text-xl max-w-xs sm:max-w-2xl mx-auto transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Information on collaboration between students and lecturers in multimedia and digital innovation.
          </p>
        </div>
      </div>
    </div>
  );
}