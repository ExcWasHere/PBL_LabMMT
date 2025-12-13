import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ImageCarousel } from "~/components/Project/project-detail/components/imageCarousel";
import { ProjectInfo } from "~/components/Project/project-detail/components/projectInfo";
import { TeamSection } from "~/components/Project/project-detail/components/teamSection";

const API_BASE_URL = "http://localhost:3000";
const PROJECT_ENDPOINT = `${API_BASE_URL}/project`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const normalizeUrl = (val: any): string => {
  if (!val) return "";
  if (typeof val === "object") {
    return val.url || val.path || "";
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return parsed.url || parsed.path || val;
    } catch {
      return val.replace(/["{}]/g, "").trim();
    }
  }
  return "";
};

const withBaseUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
};

export default function PreviewProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${PROJECT_ENDPOINT}/${id}`, {
          headers: getAuthHeaders(),
        });
        
        if (!res.ok) throw new Error("Failed to fetch project");
        
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Project not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const rawMediaUrls = Array.isArray(project.mediaUrls) 
    ? project.mediaUrls 
    : project.mediaUrls 
      ? [project.mediaUrls] 
      : [];

  const images = rawMediaUrls.length > 0
    ? rawMediaUrls
        .map((url: any) => {
          const normalized = normalizeUrl(url);
          return normalized ? withBaseUrl(normalized) : null;
        })
        .filter(Boolean)
    : project.thumbnailUrl
      ? [withBaseUrl(normalizeUrl(project.thumbnailUrl))]
      : ["https://placehold.co/600x400?text=No+Media"];

  console.log("Raw mediaUrls:", project.mediaUrls);
  console.log("Processed images:", images);

  const details = [
    { label: "Type", value: project.kategori || project.category || project.type || "-" },
    { label: "Date", value: formatDateForDisplay(project.year || project.date) },
    { label: "Tech", value: project.tech || "-" },
    {
      label: "Link",
      value: [
        project.githubLink && { text: "GitHub", url: project.githubLink },
        project.demoLink && { text: "Demo", url: project.demoLink },
      ].filter(Boolean) as { text: string; url: string }[],
    },
    { label: "Rating", value: project.stars || 0 },
  ];

  const members = (project.teamMembers || []).map((m: any) => ({
    name: m.name,
    role: m.role,
    img: m.imageUrl || `https://i.pravatar.cc/150?u=${m.name}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Project Preview */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <ImageCarousel images={images} />
            </div>
            <div>
              <ProjectInfo
                title={project.title || "Untitled Project"}
                description={project.description || ""}
                details={details}
                reviewCount={0}
              />
            </div>
          </div>

          {members.length > 0 && (
            <>
              <hr className="my-12 border-gray-200" />
              <TeamSection members={members} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}