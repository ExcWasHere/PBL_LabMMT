"use client";
import { motion } from "framer-motion";
import { Link } from "react-router";

export function Register() {
    return (
        <section className="bg-white py-40 px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 items-center">
                <div>
                    <h2 className="md:text-5xl font-bold text-gray-800 mb-8">
                        Tertarik Bergabung <br /> Dengan Kami?
                    </h2>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <a href="/masuk">
                            <button className="bg-orange-500 text-white px-42 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                                Register Now
                            </button>
                        </a>
                    </motion.div>

                </div>
                {/* RIGHT IMAGES */}
                <div className="relative w-full h-[260px] md:h-[398px]">

                    {/* Gambar 1 */}
                    <img
                        src="/galeri/eventB.jpg"
                        className=" md:w-70 rounded-xl shadow-lg object-cover -rotate-4 absolute -top-19 left-20 "
                    />

                    {/* Gambar 2 */}
                    <img
                        src="/galeri/eventA.jpg"
                        className=" md:w-70 rounded-xl shadow-lg object-cover rotate-3 absolute top-20 left-50"
                    />

                    {/* Gambar 3 */}
                    <img
                        src="/galeri/eventC.jpg"
                        className=" md:w-70 rounded-xl shadow-lg object-cover -rotate-2 absolute bottom-6 left-20 z-0"
                    />
                </div>

            </div>
        </section>
    );
}

