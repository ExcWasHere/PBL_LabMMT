import type { Route } from "./+types/home";
import { Coba } from "../components/Proyek/coba";
import Navbar from "~/common/navbar";
import Header from "~/components/Proyek/header"
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