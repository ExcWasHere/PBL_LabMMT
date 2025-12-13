import { ImageCarousel } from "~/components/Project/project-detail/components/imageCarousel";
import { ProjectInfo } from "~/components/Project/project-detail/components/projectInfo";
import { TeamSection } from "~/components/Project/project-detail/components/teamSection";

interface ProjectPreviewProps {
  title: string;
  description: string;
  type: string;
  date: string;
  tech: string;
  githubLink?: string;
  demoLink?: string;
  mediaUrls: string[];
  teamMembers: {
    name: string;
    role: string;
    imageUrl?: string;
  }[];
}

export default function ProjectPreview({
  title,
  description,
  type,
  date,
  tech,
  githubLink,
  demoLink,
  mediaUrls,
  teamMembers,
}: ProjectPreviewProps) {
  const details = [
    { label: "Type", value: type },
    { label: "Date", value: date },
    { label: "Tech", value: tech },
    {
      label: "Link",
      value: [
        githubLink && { text: "GitHub", url: githubLink },
        demoLink && { text: "Demo", url: demoLink },
      ].filter(Boolean) as { text: string; url: string }[],
    },
    { label: "Rating", value: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <ImageCarousel
          images={
            mediaUrls.length > 0
              ? mediaUrls
              : ["https://placehold.co/600x400?text=No+Media"]
          }
        />
        <ProjectInfo
          title={title}
          description={description}
          details={details}
          reviewCount={0}
        />
      </div>

      {teamMembers.length > 0 && (
        <>
          <hr className="my-12 border-gray-200" />
          <TeamSection
            members={teamMembers.map((m) => ({
              name: m.name,
              role: m.role,
              img: m.imageUrl || `https://i.pravatar.cc/150?u=${m.name}`,
            }))}
          />
        </>
      )}
    </div>
  );
}
