import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { ImageCarousel } from "./components/imageCarousel";
import { ProjectInfo } from "./components/projectInfo";
import { TeamSection } from "./components/teamSection";
import { CommentSection } from "./components/commentSection";
import type { ProjectDetailItem } from "./types";

const API_BASE_URL = "http://localhost:3000";

const withBaseUrl = (url?: string) => {
  if (!url) return "/proyek/ar.jpg";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

/* ================= OTHER PROJECTS COMPONENT ================= */
function OtherProjects({ currentProjectId, category }: { currentProjectId: string; category: string }) {
  const [otherProjects, setOtherProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/project/public`)
      .then(res => res.json())
      .then((data) => {
        const filtered = (Array.isArray(data) ? data : [])
          .filter((p: any) => 
            p.id !== currentProjectId && 
            p.kategori?.toLowerCase() === category?.toLowerCase()
          )
          .slice(0, 3);
        
        setOtherProjects(filtered);
      })
      .catch(() => setOtherProjects([]))
      .finally(() => setLoading(false));
  }, [currentProjectId, category]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">Loading other projects...</div>
      </div>
    );
  }

  if (otherProjects.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Other {category} Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {otherProjects.map((p) => (
          <Link 
            key={p.id} 
            to={`/project/slug/${slugify(p.title)}`}
            className="group"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img
                  src={withBaseUrl(p.thumbnailUrl)}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.tech && p.tech.split(",").slice(0, 3).map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  // Load comments from localStorage
  useEffect(() => {
    if (!slug) return;
    
    const loadComments = () => {
      try {
        const storedComments = localStorage.getItem(`comments:${slug}`);
        if (storedComments) {
          const parsed = JSON.parse(storedComments);
          setComments(Array.isArray(parsed) ? parsed : []);
        }
      } catch (err) {
        console.log("No existing comments or error loading:", err);
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    console.log("Fetching project with slug:", slug);
    setLoading(true);
    setError("");

    fetch(`${API_BASE_URL}/project/slug/${slug}`)
      .then(res => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        
        let foundProject = null;
        
        // Handle if API returns array
        if (Array.isArray(data)) {
          foundProject = data.find((p: any) => slugify(p.title) === slug);
        } 
        // Handle if API returns single object
        else if (data && typeof data === 'object') {
          foundProject = data;
        }
        
        if (foundProject) {
          // Parse mediaUrls if they're JSON strings
          if (foundProject.mediaUrls && Array.isArray(foundProject.mediaUrls)) {
            foundProject.mediaUrls = foundProject.mediaUrls.map((item: any) => {
              if (typeof item === 'string') {
                try {
                  const parsed = JSON.parse(item);
                  return parsed.url || item;
                } catch {
                  return item;
                }
              }
              return item.url || item;
            });
          }
          
          console.log("Found project:", foundProject);
          setProject(foundProject);
        } else {
          console.log("Project not found");
          setError("Project not found");
          setProject(null);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setProject(null);
      })
      .finally(() => {
        console.log("Loading complete");
        setLoading(false);
      });
  }, [slug]);

  /* ================= COMMENT HANDLER (PERSISTENT WITH LOCALSTORAGE) ================= */
  const addComment = () => {
    if (!userName || !commentText || userRating === 0 || !slug) return;

    const newComment = {
      id: Date.now(),
      timestamp: Date.now(),
      user: userName,
      avatar: `https://i.pravatar.cc/150?u=${userName}`,
      time: "Just now",
      text: commentText,
      rating: userRating,
      likes: 0,
      replies: [],
    };

    try {
      const updatedComments = [newComment, ...comments];
      localStorage.setItem(`comments:${slug}`, JSON.stringify(updatedComments));
      setComments(updatedComments);
      setUserName("");
      setCommentText("");
      setUserRating(0);
    } catch (err) {
      console.error("Error saving comment:", err);
      alert("Failed to save comment. Please try again.");
    }
  };

  const addReply = (commentId: number, text: string) => {
    const reply = {
      id: Date.now(),
      user: "You",
      avatar: "https://i.pravatar.cc/100",
      time: "Just now",
      text,
    };

    const updatedComments = comments.map(c =>
      c.id === commentId
        ? {
            ...c,
            replies: [...c.replies, reply],
          }
        : c
    );

    setComments(updatedComments);

    // Update in localStorage
    try {
      localStorage.setItem(`comments:${slug}`, JSON.stringify(updatedComments));
    } catch (err) {
      console.error("Error saving reply:", err);
    }
  };

  const toggleLike = (commentId: number) => {
    const updatedComments = comments.map(c =>
      c.id === commentId
        ? { ...c, likes: c.likes + 1, isLiked: true }
        : c
    );

    setComments(updatedComments);

    // Update in localStorage
    try {
      localStorage.setItem(`comments:${slug}`, JSON.stringify(updatedComments));
    } catch (err) {
      console.error("Error saving like:", err);
    }
  };

  if (loading || loadingComments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400">Loading project...</div>
          <div className="text-sm text-gray-500 mt-2">Slug: {slug}</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Project not found</div>
          <div className="text-gray-500 mb-2">Slug: {slug}</div>
          {error && <div className="text-sm text-red-400 mb-4">Error: {error}</div>}
          <Link to="/project" className="text-blue-500 underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  /* ================= PROJECT DETAILS ================= */
  // Calculate average rating from comments
  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length).toFixed(1)
    : 0;

  const projectDetails: ProjectDetailItem[] = [
    { label: "Type", value: project.kategori },
    { label: "Date", value: project.year },
    { label: "Tech", value: project.tech },
    {
      label: "Link",
      value: [
        project.githubLink && { text: "GitHub", url: project.githubLink },
        project.demoLink && { text: "Demo", url: project.demoLink },
      ].filter(Boolean),
    },
    { label: "Rating", value: averageRating },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-800 pt-20">
      <div className="fixed top-0 left-0 right-0 h-20 z-40 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* BACK BUTTON */}
        <Link 
          to="/project"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6 group transition-colors"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Projects</span>
        </Link>
        {/* HERO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ImageCarousel
            images={[
              withBaseUrl(project.thumbnailUrl),
              ...(project.mediaUrls || []).map((url: string) => withBaseUrl(url)),
            ]}
          />

          <ProjectInfo
            title={project.title}
            description={project.description}
            details={projectDetails}
            reviewCount={comments.length}
          />
        </div>

        <hr className="my-12 border-gray-200" />

        {/* TEAM */}
        {project.teamMembers?.length > 0 && (
          <>
            <TeamSection
              members={project.teamMembers.map((m: any) => {
                let imageUrl = `https://i.pravatar.cc/300?u=${m.name}`;
                
                // Check if imageUrl is valid and not a blob
                if (m.imageUrl && 
                    !m.imageUrl.startsWith('blob:') && 
                    m.imageUrl !== '' &&
                    m.imageUrl !== 'null' &&
                    m.imageUrl !== 'undefined') {
                  imageUrl = withBaseUrl(m.imageUrl);
                }
                
                return {
                  name: m.name,
                  role: m.role,
                  img: imageUrl,
                };
              })}
            />
            <hr className="my-12 border-gray-200" />
          </>
        )}

        {/* OTHER PROJECTS */}
        <OtherProjects currentProjectId={project.id} category={project.kategori} />

        <hr className="my-12 border-gray-200" />

        {/* COMMENTS */}
        <CommentSection
          comments={comments}
          userName={userName}
          setUserName={setUserName}
          commentText={commentText}
          setCommentText={setCommentText}
          userRating={userRating}
          setUserRating={setUserRating}
          onSubmit={addComment}
          onReply={addReply}
          onLike={toggleLike}
          reviewCount={comments.length}
        />
      </main>
    </div>
  );
}