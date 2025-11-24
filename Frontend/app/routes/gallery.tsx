import Navbar from "~/common/navbar";
import Header from "~/components/Gallery/heroGallery";
import { Coba } from "~/components/Gallery/contentGallery";

export function meta() {
  return [
    { title: "MMT | Gallery" },
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
