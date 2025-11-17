import Dashboard from "~/components/Dashboard/viewer";
import type { Route } from "./+types/dashboard-viewer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Dashboard-Viewer" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Viewer() {
  return (
    <>
    <Dashboard />
    </>
  );
}