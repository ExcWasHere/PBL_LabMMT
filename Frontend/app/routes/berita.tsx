import Footer from "~/common/footer";
import type { Route } from "./+types/berita";
import Navbar from "~/common/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Berita" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Masuk() {
  return (
    <>
    <Navbar />
    <Footer />
    </>
  );
}