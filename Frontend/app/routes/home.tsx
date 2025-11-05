import type { Route } from "./+types/home";
import Navbar from "~/common/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Beranda" },
    { name: "Beranda", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Home() {
  return (
    <>
      <Navbar />
    </>
  );
}
