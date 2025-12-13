import { motion } from "framer-motion";
import { Link } from "react-router-dom"; 

export function Register() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 items-center">
        
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-8 sm:mb-8 leading-tight">
            Interested in <br className="hidden sm:block" /> Being Part of Us?
          </h2>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="w-full md:w-auto"
          >
            <Link to="/sign-in" className="block w-full md:w-auto">
              <button className="w-full md:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105 shadow-md font-medium">
                Register Now
              </button>
            </Link>
          </motion.div>
        </div>

        <div className="hidden md:block relative w-full h-[340px]">
          <img
            src="/regist/register1.jpg"
            className="absolute rounded-xl shadow-lg object-cover -rotate-4 w-64 -top-6 left-10 hover:z-10 hover:scale-105 duration-300 transition-all"
            alt="Register 1"
          />
          <img
            src="/regist/register2.jpg"
            className="absolute rounded-xl shadow-lg object-cover rotate-3 w-64 top-14 left-32 hover:z-10 hover:scale-105 duration-300 transition-all"
            alt="Register 2"
          />
          <img
            src="/regist/register3.jpg"
            className="absolute rounded-xl shadow-lg object-cover -rotate-2 w-64 bottom-0 left-16 z-0 hover:z-10 hover:scale-105 duration-300 transition-all"
            alt="Register 3"
          />
        </div>

      </div>
    </section>
  );
}