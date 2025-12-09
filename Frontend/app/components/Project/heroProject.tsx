import { useEffect, useState } from "react";

export default function header() {
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
          style={{
            objectPosition: "center center",
            filter: "brightness(40%)",
          }}
          alt="bannerLab"
        />

        {/* Gradient */}
        <div className="h-full w-full absolute inset-0 bg-gradient-to-t from-orange-400 via-transparent to-transparent opacity-20" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8">
          <h1
            className={`text-white text-4xl md:text-7xl font-bold mb-6 leading-tight transform transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Featured <span className="text-orange-500">Projects</span>
          </h1>

          <p
            className={`text-white text-lg md:text-xl max-w-2xl mx-auto transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            A showcase of projects created by the MMT Lab team.
          </p>
        </div>
      </div>
    </div>
  );
}
