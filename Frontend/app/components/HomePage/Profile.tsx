"use client"

import { motion } from "framer-motion"

export default function ProfileSingkat() {
  return (
    <div className="bg-white text-left py-16 md:py-20 px-10 sm:px-10 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mb-16 md:mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Profile Singkat</h2>
        <div className="w-12 h-1 bg-orange-600 mt-4"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* SEJARAH */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-lg p-8 "
          >
            <h3 className="text-sm md:text-base font-semibold text-gray-900 uppercase tracking-widest mb-6">Sejarah</h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Laboratorium Multimedia dan Perangkat Bergerak merupakan salah satu laboratorium unggulan di Jurusan
              Teknologi Informasi yang berfokus pada riset, pengembangan, serta implementasi teknologi mobile computing
              dan multimedia interaktif.
            </p>
          </motion.div>

          {/* VISI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-lg p-8"
          >
            <h3 className="text-sm md:text-base font-semibold text-gray-900 uppercase tracking-widest mb-6">Visi</h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Memposisikan Lab Multimedia & Game sebagai pusat keunggulan yang responsif terhadap kebutuhan industri dan
              pendidikan tinggi.
            </p>
          </motion.div>
        </div>

        {/* MISI */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-orange-50 rounded-lg p-8 "
        >
          <h3 className="text-sm md:text-base font-semibold text-gray-900 uppercase tracking-widest mb-6">Misi</h3>
          <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
            <p>
              Menyelenggarakan pendidikan praktikum dan penelitian yang berkualitas di bidang aplikasi teknologi
              Immersive, mobile, multimedia, serta teknologi interaktif.
            </p>
            <p>
              Mengembangkan riset dan inovasi berbasis mobile computing, multimedia, VR/AR, dan sensor interaktif untuk
              mendukung kemajuan ilmu pengetahuan dan teknologi.
            </p>
            <p>
              Menyediakan fasilitas laboratorium yang modern dan relevan dengan perkembangan industri agar mahasiswa
              dapat menguasai keterampilan yang aplikatif.
            </p>
            <p>
              Mendorong kolaborasi antara mahasiswa, dosen, industri, dan masyarakat dalam pengembangan solusi berbasis
              teknologi multimedia dan perangkat bergerak.
            </p>
            <p>
              Menghasilkan karya inovatif berupa aplikasi, produk, maupun publikasi ilmiah yang memberi manfaat nyata
              bagi masyarakat dan mendukung kemajuan bangsa.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
