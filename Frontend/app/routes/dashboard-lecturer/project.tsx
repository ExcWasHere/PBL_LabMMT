import type { Route } from "../dashboard-lecturer/+types/project.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import ProjectPage from "~/components/Dashboard/lecturer/project.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-Lecturer" },
    { name: "Project", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Viewer() {
  return (
    <>
    <ProtectedRoute>
    <ProjectPage />
    </ProtectedRoute>
    </>
  );
}