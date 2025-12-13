import { motion } from "framer-motion";

export default function ProfileSingkat() {
  return (
    <div className="bg-white text-left py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
        >
          <h2>Profile</h2>
        </motion.div>

        <div className="mt-3 sm:mt-4 mb-6 sm:mb-10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-lg p-5 sm:p-6 md:p-8"
          >
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3 md:mb-6">
              History
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              The Multimedia & Mobile Tech Laboratory is one of the leading
              laboratories in the Department of Information Technology, focusing
              on research, development, and implementation of mobile computing
              and interactive multimedia technologies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-lg p-5 sm:p-6 md:p-8"
          >
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3 md:mb-6">
              Vision
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Positioning the Multimedia & Mobile Tech Laboratory as a center of
              excellence that is responsive to the needs of industry and higher
              education.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-orange-50 rounded-lg p-5 sm:p-6 md:p-8"
        >
          <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3 md:mb-6">
            Mision
          </h3>
          <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
            <p>
              Providing quality practical education and research in the fields of
              immersive, mobile, multimedia, and interactive technology
              applications.
            </p>
            <p>
              Developing research and innovation based on mobile computing,
              multimedia, VR/AR, and interactive sensors to support the
              advancement of science and technology.
            </p>
            <p>
              Providing modern laboratory facilities that are relevant to
              industrial developments so that students can master applicable
              skills.
            </p>
            <p>
              Encouraging collaboration between students, lecturers, industry,
              and the community in developing solutions based on multimedia
              technology and mobile devices.
            </p>
            <p>
              Produce innovative works in the form of applications, products,
              and scientific publications that provide tangible benefits to
              society and support national progress.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}