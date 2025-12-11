import { DetailMember } from "~/components/HomePage/detail";
import type { Route } from "./+types/detailteam-member";


export function meta() {
  return [
    { title: "MMT | Detail Member" },
    {
      name: "description",
      content: "Halaman detail anggota laboratorium",
    },
  ];
}
export default function MemberDetailRoute() {
  return <DetailMember />;
}
