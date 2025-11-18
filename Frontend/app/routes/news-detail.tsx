import Dashboard from "~/components/Berita/display";
import type { Route } from "./+types/dashboard-viewer";
import Navbar from "~/common/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | News-Detail" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Viewer() {
  return (
    <>
    <Navbar />
    <Dashboard />
    </>
  );
}