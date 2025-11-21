"use client";

import IndexHero from "~/components/HomePage/hero";
import type { Route } from "./+types/home";
import Navbar from "~/common/navbar";
import ProfileSingkat from "~/components/HomePage/Profile";
import { HomeProject } from "~/components/HomePage/Projects";
import { HomeBerita } from "~/components/HomePage/news";
import { HomeMember} from "~/components/HomePage/members";
import { Register } from "~/components/HomePage/registration";
import { MediaPartner} from "~/components/HomePage/medpart";
import Footer from "~/common/footer";

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
      <HomeProject />
      <HomeBerita />
      <HomeMember />
      <Register />
      <MediaPartner />
      <Footer />
    </>
  );
}
