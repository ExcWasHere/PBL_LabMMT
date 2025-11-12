import { motion } from "framer-motion";

export default function ProfileSingkat() {

  return (
    <div className="bg-white text-center md py-13 px-4 sm:px-6 lg:py-16 lg:px-8">
      <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}>
      <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-6">
        Profile Singkat
      </h2>
      </motion.div>

      <div className="max-w-7xl py-3 mx-auto md text-left ">
        <div className="rounded text-left mb-5">
          {/* SEJARAH */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="rounded-2xl md:p-7 text-left bg-orange-50 shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-orange-500 mb-4 border-b-1 border-gray-200 pb-2 mb-4">
              SEJARAH
            </h3>
            <p className="text-black md:text-lg">
              Laboratorium Multimedia dan Perangkat Bergerak merupakan salah satu
              laboratorium unggulan di Jurusan Teknologi Informasi yang berfokus
              pada riset, pengembangan, serta implementasi teknologi mobile
              computing dan multimedia interaktif.
            </p>
          </motion.div>
        </div>


        <div className="rounded py-3 text-left mb-5">
          {/* VISI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl md:p-7 text-left bg-orange-50 shadow-md">
            <h4 className="text-lg md:text-xl font-semibold text-orange-500 border-b-1 border-gray-300 pb-2 mb-4">
              VISI
            </h4>
            <p className="text-black md:text-lg ">
              Memposisikan Lab Multimedia & Game sebagai pusat keunggulan yang
              responsif terhadap kebutuhan industri dan pendidikan tinggi.
            </p>
          </motion.div>
        </div>

        <div className="rounded text-left mb-5">
          {/* MISI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl md:p-7 text-left bg-orange-50 shadow-md">
            <h4 className="text-lg md:text-xl font-semibold text-orange-500 border-b-1 border-gray-300 pb-2 mb-4">
              MISI
            </h4>
            <p className="text-black md:text-lg ">
              Menyelenggarakan pendidikan praktikum dan penelitian yang
              berkualitas di bidang aplikasi teknologi Immersive, mobile,
              multimedia, serta teknologi interaktif. <br></br>
              <br></br>
              Mengembangkan riset dan inovasi berbasis mobile computing,
              multimedia, VR/AR, dan sensor interaktif untuk mendukung kemajuan
              ilmu pengetahuan dan teknologi<br></br>
              <br></br>
              Menyediakan fasilitas laboratorium yang modern dan relevan dengan
              perkembangan industri agar mahasiswa dapat menguasai keterampilan
              yang aplikatif<br></br>
              <br></br>
              Mendorong kolaborasi antara mahasiswa, dosen, industri, dan
              masyarakat dalam pengembangan solusi berbasis teknologi multimedia
              dan perangkat bergerak.<br></br>
              <br></br>
              Menghasilkan karya inovatif berupa aplikasi, produk, maupun
              publikasi ilmiah yang memberi manfaat nyata bagi masyarakat dan
              mendukung kemajuan bangsa.<br></br>
              <br></br>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
