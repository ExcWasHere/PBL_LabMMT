import type { Route } from "../dashboard-student/+types/news.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import NewsPage from "~/components/Dashboard/student/news.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-Student" },
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