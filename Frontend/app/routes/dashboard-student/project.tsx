import type { Route } from "../dashboard-student/+types/project.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import ProjectPage from "~/components/Dashboard/student/project.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-Viewer" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
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