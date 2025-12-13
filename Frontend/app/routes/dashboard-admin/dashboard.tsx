import Dashboard from "~/components/Dashboard/admin/dashboard";
import type { Route } from "../dashboard-admin/+types/dashboard.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";

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
    <Dashboard />
    </ProtectedRoute>
    </>
  );
}