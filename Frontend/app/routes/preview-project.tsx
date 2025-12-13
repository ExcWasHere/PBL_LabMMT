import ProjectPreview from "~/common/project-preview";


export function meta() {
  return [
    { title: "MMT | Preview-Project" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function PreviewProjectPage() {
  return (
    <>
    <ProjectPreview />
    </>
  );
}

