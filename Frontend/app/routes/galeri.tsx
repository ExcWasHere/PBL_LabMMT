import Card from "../common/card";
import Navbar from "../common/navbar";

export default function App() {
  
  const events = [
    {
      image: "/home/eventA.jpg",
      date: "10 Nov 2025",
      title: "Event A",
      desc: "Lorem ipsum dolor sit amet elit, sed do eiusmod tempor.",
      tags: ["Foto", "Video"],
      location: "sfddsfsf"
    },
    {
      image: "/home/eventB.jpg",
      date: "11 Nov 2025",
      title: "Event B",
      desc: "Lorem ipsum dolor sit amet elit, sed do eiusmod tempor.",
      tags: ["Foto", "Animasi"],
      location: "sfddsfsf"
    },
    {
      image: "/home/eventC.jpg",
      date: "12 Nov 2025",
      title: "Event C",
      desc: "Lorem ipsum dolor sit amet elit, sed do eiusmod tempor.",
      tags: ["Foto", "Video"],
      location: "sfddsfsf"
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-6 py-10">
      <div className="grid md:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <Card key={i} {...e} />
        ))}
      </div>
    </div>
    </>
  );
}
