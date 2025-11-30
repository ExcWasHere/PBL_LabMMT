import Dashboard from "~/components/Dashboard/viewer/news";
import type { Route } from "./+types/dashboard-viewer";
import ProtectedRoute from "~/components/Auth/protected-route";

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
    <Dashboard />
    </ProtectedRoute>
    </>
  );
}