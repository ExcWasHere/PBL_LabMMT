import { useState, useRef, useLayoutEffect } from "react";
import { StarRating } from "./starRating";
import type { ProjectDetailItem, LinkItem } from "../types";

interface ProjectInfoProps {
  title?: string;       
  description?: string; 
  details: ProjectDetailItem[];
  reviewCount: number;
}

const ExpandableDescription = ({ text } : {text: string}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > 300);
    }
  }, [text]);

  return (
    <div className="flex flex-col items-start">
      <div ref={textRef} className={`text-gray-600 leading-relaxed text-base whitespace-pre-line transition-all duration-500 ease-in-out ${!isExpanded ? "max-h-[300px] overflow-hidden relative" : "max-h-full"}`}>
        {text || "No Description Provided."}

        {!isExpanded && isOverflowing && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        )}
      </div>
      {isOverflowing && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full mt-2 text-sm font-semibold text-orange-600 text-center hover:text-orange-700 transition-colors focus:outline-none">
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  )
} 

export function ProjectInfo({ title = "Project A", description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.", details, reviewCount }: ProjectInfoProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight break-words">{title}</h1>

      <ExpandableDescription text={description} />

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 leading-relaxed break-words">
          Project Details
        </h3>
        <div className="space-y-3">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-col sm:flex-row sm:justify-between"
            >
              <span className="font-semibold text-gray-800">
                {detail.label}
              </span>
              <span className="text-gray-600 text-left sm:text-right flex items-center gap-2 sm:justify-end">
                {detail.label === "Rating" ? (
                  <>
                    <span className="font-bold text-yellow-500 text-lg">
                      {detail.value as number}
                    </span>
                    <div className="flex pb-1">
                      <StarRating rating={detail.value as number} />
                    </div>
                    <span className="text-xs text-gray-400">
                      ({reviewCount} reviews)
                    </span>
                  </>
                ) : detail.label === "Tech" ? (
                  <div className="flex flex-wrap gap-2 justify-end">
                    {typeof detail.value === "string" &&
                      detail.value.split(",").map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-orange-500 text-white text-xs px-2 py-1 rounded"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                  </div>
                ) : detail.label === "Link" ? (
                  <div className="flex flex-wrap gap-3 justify-end">
                    {Array.isArray(detail.value) ? (
                      (detail.value as LinkItem[]).map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-500 hover:underline font-medium hover:text-orange-600 transition-colors"
                        >
                          {link.text}
                        </a>
                      ))
                    ) : (
                      <a
                        href={detail.value as string}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-500 hover:underline"
                      >
                        Visit Link
                      </a>
                    )}
                  </div>
                ) : (
                  <>{detail.value as string}</>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
