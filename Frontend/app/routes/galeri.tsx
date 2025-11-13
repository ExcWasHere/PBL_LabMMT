import type { Route } from "./+types/home";
import Navbar from "~/common/navbar";
import Header from "~/components/Galeri/headerGaleri";
import { Coba } from "~/components/Galeri/isi";

export function meta() {
  return [
    { title: "MMT | Galeri" },
    { name: "Galeri", content: "Galeri kegiatan Lab MMT JTI" },
  ];
}

export default function Galeri() {
  return (
    <>
      <Navbar />
      <Header />
      <Coba />
    </>
  );
}
