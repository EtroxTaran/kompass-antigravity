import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0-5
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  onRatingChange,
  readOnly = false,
  size = "md",
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(null);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={`flex items-center space-x-0.5 ${className}`}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((starValue) => {
        const isFilled =
          (hoverRating !== null ? hoverRating : rating) >= starValue;

        return (
          <button
            key={starValue}
            type="button"
            className={`${readOnly ? "cursor-default" : "cursor-pointer"} focus:outline-none`}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
            disabled={readOnly}
          >
            <Star
              className={`${starSize} ${
                isFilled ? "text-yellow-400 fill-current" : "text-gray-300"
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
    </div>
  );
}
