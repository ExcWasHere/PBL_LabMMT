import type { Route } from "../dashboard-lecturer/+types/gallery.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import GalleryPage from "~/components/Dashboard/lecturer/gallery.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-Lecturer" },
    { name: "Gallery", content: "Welcome to Lab MMT JTI!" },
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