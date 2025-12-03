import { ContentProject } from "../components/Project/contentProject";
import Navbar from "~/common/navbar";
import ProjectForm from "~/components/project-form";

export function meta() {
  return [
    { title: "MMT | Project" },
    { name: "Project", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Proyek() {
  const handleClose = () => {
    console.log("Form closed");
  };

  const handleSubmit = (projectData: any) => {
    console.log("Project submitted:", projectData);
  };

  return (
    <>
      <Navbar />
      <ProjectForm onClose={handleClose} onSubmit={handleSubmit} />
      <ContentProject />
    </>
  );
}