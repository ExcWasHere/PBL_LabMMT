import type { Route } from "./+types/news";
import Navbar from "~/common/navbar";
import Roby from "~/components/News/contentNews";
import IndexHero from "~/components/News/heroNews";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | News" },
    { name: "Masuk", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Masuk() {
  return (
    <>
    <Navbar />
    <IndexHero />
    <Roby />
    </>
  );
}