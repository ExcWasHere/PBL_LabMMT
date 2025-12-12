import MemberDetailPage from "~/components/HomePage/detail";


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
  return <MemberDetailPage />;
}
