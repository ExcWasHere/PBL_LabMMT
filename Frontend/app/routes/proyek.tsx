import type { Route } from "./+types/home";
import { Coba } from "../components/Proyek/coba";
import Navbar from "~/common/navbar";
import Header from "~/components/Proyek/header"

export function meta() {
  return [
    { title: "MMT | Proyek" },
    { name: "Proyek", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function coba() {
    return (
    <>
    <Navbar />
    <Header />
    <Coba />
    </>
  );
}