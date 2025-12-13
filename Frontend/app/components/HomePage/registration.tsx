import { motion } from "framer-motion";
import { Link } from "react-router";

export function Register() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-6 sm:mb-8">
            Interested in  Being <br/> Part of Us?
          </h2>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Link to="/masuk">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                Register Now
              </button>
            </Link>
          </motion.div>
        </div>

        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[340px]">
          <img
            src="/regist/register1.jpg"
            className="w-40 sm:w-52 md:w-64 rounded-xl shadow-lg object-cover -rotate-4 absolute -top-4 sm:-top-6 left-4 sm:left-10"
          />
          <img
            src="/regist/register2.jpg"
            className="w-40 sm:w-52 md:w-64 rounded-xl shadow-lg object-cover rotate-3 absolute top-10 sm:top-14 left-24 sm:left-32"
          />
          <img
            src="/regist/register3.jpg"
            className="w-40 sm:w-52 md:w-64 rounded-xl shadow-lg object-cover -rotate-2 absolute bottom-0 left-10 sm:left-16 z-0"
          />
        </div>
      </div>
    </section>
  );
}