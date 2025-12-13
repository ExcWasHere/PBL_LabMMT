import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectPreview from "~/common/project-preview";

const API_BASE_URL = "http://localhost:3000";

export default function PreviewProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/project/${id}`)
      .then((res) => res.json())
      .then(setProject)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8">Loading preview...</p>;
  if (!project) return <p className="p-8">Project not found</p>;

  return (
    <div className="min-h-screen bg-white p-8">
      <ProjectPreview
        title={project.title}
        description={project.description}
        type={project.kategori}
        date={project.year}
        tech={project.tech}
        githubLink={project.githubLink}
        demoLink={project.demoLink}
        mediaUrls={project.mediaUrls || []}
        teamMembers={project.teamMembers || []}
      />
    </div>
  );
}
