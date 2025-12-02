import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  hoverRating?: number;
  onRate?: (val: number) => void;
  onHover?: (val: number) => void;
  size?: number;
}

export function StarRating({
  rating,
  interactive = false,
  hoverRating = 0,
  onRate,
  onHover,
  size = 14,
}: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && onHover?.(star)}
          onMouseLeave={() => interactive && onHover?.(0)}
          className={
            interactive
              ? "cursor-pointer transition-transform hover:scale-110 px-0.5"
              : ""
          }
        >
          <Star
            size={size}
            className={`${
              star <= (hoverRating || Math.round(rating))
                ? "fill-yellow-400 text-yellow-400"
                : interactive
                  ? "fill-transparent text-gray-300"
                  : "fill-gray-200 text-gray-200"
            } transition-colors duration-200`}
          />
        </div>
      ))}
    </div>
  );
}
