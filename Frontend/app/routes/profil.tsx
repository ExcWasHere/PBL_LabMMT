import ProfilPage from "~/common/profil";
import type { Route } from "./+types/profil";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Profil" },
    { name: "Profil", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Masuk() {
  return (
    <>
    <ProfilPage />
    </>
  );
}