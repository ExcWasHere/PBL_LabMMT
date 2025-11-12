import { Gamepad2, PenTool, Glasses } from "lucide-react";

export default function IndexHero() {
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

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8">
          {/* INI TAG */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {[
           
            ].map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs md:text-sm rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium flex items-center gap-1 animate-bounce"
                style={{
                  animationDuration: `${1 + index * 0.3}s`,
                }}
              >
             
              </span>
            ))}
          </div>

          <h1 className="text-white text-4xl md:text-7xl font-bold mb-6 leading-tight">
            Featured 
            <span className="text-orange-500">News</span>
          </h1>

          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
           Jendela informasi yang menampilkan hasil kolaborasi mahasiswa dan dosen dalam menciptakan inovasi multimedia yang berdampak pada dunia digital
          </p>
        </div>
      </div>
    </div>
  );
}