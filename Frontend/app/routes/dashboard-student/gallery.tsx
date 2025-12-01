import type { Route } from "../dashboard-student/+types/gallery.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import GalleryPage from "~/components/Dashboard/student/gallery.js";

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
    <GalleryPage />
    </ProtectedRoute>
    </>
  );
}