import type { Route } from "../dashboard-admin/+types/gallery.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import GalleryPage from "~/components/Dashboard/admin/gallery.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-Admin" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Admin() {
  return (
    <>
    <ProtectedRoute>
    <GalleryPage />
    </ProtectedRoute>
    </>
  );
}