import type { Route } from "../dashboard-admin/+types/project.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import ProjectPage from "~/components/Dashboard/admin/project.js";

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