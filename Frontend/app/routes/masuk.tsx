import type { Route } from "./+types/masuk";
import LoginPage from "~/components/Auth/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Beranda" },
    { name: "Beranda", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Home() {
  return (
    <>
    <LoginPage />
    </>
  );
}