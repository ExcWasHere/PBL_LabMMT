import { motion } from "framer-motion";
import Card from "../../common/card";
import { Link } from "react-router";


export function HomeBerita(){
  const news = [
    {
      image: "/galeri/eventA.jpg",
      date: "10 Nov 2024",
      title: "NEWS A",
      desc: "Kegiatan pelatihan AR/VR bersama anggota lab MMT.",
      tags: ["Foto", "Animasi"],
      info: "Malang"
    },
    {
      image: "/galeri/eventB.jpg",
      date: "10 Nov 2024",
      title: "NEWS B",
      desc: "Menampilkan hasil karya mahasiswa berbasis Unity.",
      tags: ["Foto", "Animasi"],
      info: "Darjo"
    },
    {
      image: "/galeri/eventC.jpg",
      date: "10 Nov 2024",
      title: "NEWS C",
      desc: "Kegiatan kunjungan industri ke perusahaan teknologi.",
      tags: ["Foto", "Animasi"],
      info: "Blitar"
    },
  ];

  return (
        <section className="bg-white py-25 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center mb-12">
                    News
                </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {news.map((news) => (
                        <motion.div
                            initial={{ rotateY: 90, opacity: 0 }}
                            whileInView={{ rotateY: 0, opacity: 1 }}
                            transition={{ duration: 0.8, }}
                            viewport={{ once: true }}
                            style={{
                                transformStyle: "preserve-3d",
                                perspective: "1000px",
                            }}
                        >
                        <Card
                            image={news.image}
                            date={news.date}
                            title={news.title}
                            desc={news.desc}
                            tags={news.tags}
                            info={news.info}
                        />
                        </motion.div>
                    ))}
                </div>
                
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                <div className="text-center ">
                    <a href="/Berita">

                    <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                        See All
                    </button>
                    </a>
                    
                </div>
            </motion.div>
                 </div>
        </section>
    );
}