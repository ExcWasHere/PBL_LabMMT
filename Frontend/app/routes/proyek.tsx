import type { Route } from "./+types/home";
import { Coba } from "../welcome/coba";

export function meta() {
  return [
    { title: "MMT | Proyek" },
    { name: "Proyek", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function coba() {
    return <Coba />;
}