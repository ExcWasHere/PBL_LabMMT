import type { Route } from "./+types/home";
import { Coba } from "../components/Project/contentProject";
import Navbar from "~/common/navbar";
import Header from "~/components/Project/heroProject"
import Footer from "~/common/footer";

export function meta() {
  return [
    { title: "MMT | Proyek" },
    { name: "Proyek", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Proyek() {
    return (
    <>
    <Navbar />
    <Header />
    <Coba />
    <Footer />
    </>
  );
}