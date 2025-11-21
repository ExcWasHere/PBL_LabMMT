import type { Route } from "./+types/home";
import Navbar from "~/common/navbar";
import { Detail1 } from "~/components/Project/detail1"

export function meta() {
  return [
    { title: "MMT | Detail Proyek" },
    { name: "Detail-Proyek", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Proyek() {
    return (
    <>
    <Navbar />
    <Detail1 />
    </>
  );
}