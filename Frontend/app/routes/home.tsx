import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MMT | Home" },
    { name: "Home", content: "Welcome to Lab MMT JTI!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
