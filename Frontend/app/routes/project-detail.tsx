import Navbar from "~/common/navbar";
import ProjectDetail from "~/components/Project/project-detail/project-detail";

export function meta() {
  return [
    { title: "MMT | Detail Proyek" },
    { name: "Detail-Proyek", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Proyek() {
    return (
    <>
    <Navbar />
    <ProjectDetail />
    </>
  );
}