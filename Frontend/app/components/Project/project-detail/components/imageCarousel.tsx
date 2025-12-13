import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // FILTER: Remove empty/invalid URLs and add fallback
  const validImages = images.filter((img) => img && img.trim() !== "");
  const safeImages = validImages.length > 0 
    ? validImages 
    : ["https://placehold.co/800x600?text=No+Media+Available"];

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  const handleImageError = (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Image load error at index ${index}:`, safeImages[index]);
    setFailedImages(prev => new Set(prev).add(index));
    e.currentTarget.src = `https://placehold.co/800x600?text=Image+${index + 1}+Error`;
  };

  const isVideo = (url: string) => {
    return url.includes(".mp4") || url.includes(".webm") || url.includes(".mov");
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
        {safeImages.map((src, i) => (
          <div key={i} className="min-w-full h-full flex items-center justify-center bg-gray-50">
            {isVideo(src) ? (
              <video
                src={src}
                controls
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error(`Video load error at index ${i}:`, src);
                  setFailedImages(prev => new Set(prev).add(i));
                }}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <img
                src={src}
                className="w-full h-full object-cover"
                alt={`Preview ${i + 1}`}
                onError={(e) => handleImageError(i, e)}
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Areas - Only show if more than 1 media */}
      {safeImages.length > 1 && (
        <>
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
        </>
      )}

      {/* Dots - Only show if more than 1 media */}
      {safeImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {safeImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                i === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter Badge */}
      {safeImages.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
          {currentIndex + 1} / {safeImages.length}
        </div>
      )}
    </div>
  );
}