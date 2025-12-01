import Dashboard from "~/components/Dashboard/student/dashboard";
import type { Route } from "../dashboard-student/+types/dashboard.tsx";
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