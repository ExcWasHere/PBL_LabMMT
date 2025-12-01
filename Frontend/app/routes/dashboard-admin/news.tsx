import type { Route } from "../dashboard-admin/+types/news.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import NewsPage from "~/components/Dashboard/admin/news.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-News" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Viewer() {
  return (
    <>
    <ProtectedRoute>
    <NewsPage />
    </ProtectedRoute>
    </>
  );
}