import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-gray-100 group">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full h-full">
            <img
              src={src}
              className="w-full h-full object-cover"
              alt={`Preview ${i}`}
            />
          </div>
        ))}
      </div>

      {/* Navigation Areas */}
      <div
        onClick={prevSlide}
        className="absolute top-0 left-0 w-1/2 h-full z-10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
      >
        <div className="w-full h-full bg-gradient-to-r from-black/10 to-transparent"></div>
      </div>
      <div
        onClick={nextSlide}
        className="absolute top-0 right-0 w-1/2 h-full z-10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
      >
        <div className="w-full h-full bg-gradient-to-l from-black/10 to-transparent"></div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
              i === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
