import type { Route } from "../dashboard-lecturer/+types/member.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import MemberPage from "~/components/Dashboard/lecturer/member.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-Lecturer" },
    { name: "Member", content: "Welcome to Lab MMT JTI!" },
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