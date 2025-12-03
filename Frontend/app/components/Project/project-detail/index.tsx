import { Link } from "react-router-dom";
import Card from "~/common/card"; 
import { projects } from "~/components/Project/dataProjects"; 

import { ImageCarousel } from "./components/imageCarousel";
import { ProjectInfo } from "./components/projectInfo";
import { TeamSection } from "./components/teamSection"; 
import { CommentSection } from "./components/commentSection";
import { useCommentSystem } from "./hooks/useCommentSystem";
import { dummy_images, dummy_team_member } from "./data/mockData";

export function Detail1() {
  const { 
    comments, userName, setUserName, commentText, setCommentText, 
    userRating, setUserRating, addComment, averageRating, userReviewsCount 
  } = useCommentSystem();

  const projectDetails = [
    { label: "Type", value: "Game" },
    { label: "Date", value: "23 November 2025" },
    { label: "Tech", value: "Unity, Blender" },
    { label: "Repository", value: "https://github.com/username/project-a" },
    { label: "Rating", value: averageRating },
  ];

  const recommendations = projects.filter((p) => p.title !== "Project A").slice(0, 3);

  return (
    <div className="bg-white min-h-screen text-gray-800 pt-20">
      <div className="fixed top-0 left-0 right-0 h-20 z-40 bg-gradient-to-b from-black/70 to-transparent pointer-events-none"></div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ImageCarousel images={dummy_images} />

          <ProjectInfo details={projectDetails} reviewCount={userReviewsCount} />
        </div>

        {/* TEAM */}
        <hr className="my-12 border-gray-200" />
        <TeamSection members={dummy_team_member} />

        {/* RECOMMENDATIONS */}
        <hr className="my-12 border-gray-200" />
        <section>
          <h2 className="text-2xl font-semibold mb-6">Other Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recommendations.map((project, i) => (
              <div key={i}>
                 <Card {...project} />
              </div>
            ))}
          </div>
        </section>

        {/* COMMENTS */}
        <hr className="my-12 border-gray-200" />
        <CommentSection
          comments={comments}
          userName={userName} setUserName={setUserName}
          commentText={commentText} setCommentText={setCommentText}
          userRating={userRating} setUserRating={setUserRating}
          onSubmit={addComment}
          reviewCount={userReviewsCount}
        />
      </main>
    </div>
  );
}