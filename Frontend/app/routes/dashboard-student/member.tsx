import type { Route } from "../dashboard-student/+types/member.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import MemberPage from "~/components/Dashboard/student/member.js";

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
    <MemberPage />
    </ProtectedRoute>
    </>
  );
}