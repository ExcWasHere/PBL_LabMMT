import IndexHero from "~/components/HomePage/section1";
import type { Route } from "./+types/home";
import Navbar from "~/common/navbar";
import ProfileSingkat from "~/components/HomePage/section2";
import { HomeProject } from "~/components/HomePage/section3";

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
      <IndexHero />
      <ProfileSingkat />
      <HomeProject/>
    </>
  );
}
