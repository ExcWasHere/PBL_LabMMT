import Dashboard from "~/components/News/detailPageNews";
import type { Route } from "./+types/news-detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | News-Detail" },
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