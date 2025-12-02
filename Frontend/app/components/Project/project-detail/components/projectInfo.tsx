import { StarRating } from "./starRating";
import type { ProjectDetailItem } from "../types";

interface ProjectInfoProps {
  details: ProjectDetailItem[];
  reviewCount: number;
}

export function ProjectInfo({ details, reviewCount }: ProjectInfoProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Project A</h1>
      <p className="text-gray-600 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco. Sed ut perspiciatis unde
        omnis iste natus error sit voluptatem accusantium doloremque laudantium,
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo.
      </p>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
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
                      {detail.value}
                    </span>
                    <div className="flex pb-1">
                      <StarRating rating={Number(detail.value)} />
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
                ) : detail.label === "Repository" ? (
                  <a
                    href={detail.value as string}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    Github
                  </a>
                ) : (
                  detail.value
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
