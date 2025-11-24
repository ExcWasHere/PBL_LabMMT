import { Coba } from "../components/Project/contentProject";
import Navbar from "~/common/navbar";
import Header from "~/components/Project/heroProject"

export function meta() {
  return [
    { title: "MMT | Project" },
    { name: "Project", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Proyek() {
    return (
    <>
    <Navbar />
    <Header />
    <Coba />
    </>
  );
}