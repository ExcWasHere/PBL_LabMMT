import type { Route } from "../dashboard-admin/+types/member.tsx";
import ProtectedRoute from "~/components/Auth/protected-route";
import MemberPage from "~/components/Dashboard/admin/member.js";

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
    <MemberPage />
    </ProtectedRoute>
    </>
  );
}