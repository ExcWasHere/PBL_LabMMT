import { motion } from "framer-motion";

export function Register() {
    return (
        <section className="bg-white py-16 px-4">
            <div className="max-w-2xl mx-auto text-left">
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    Tertarik Bergabung<br />
                    Dengan Kami?
                </h2>

                <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">
                    Register Now
                </button>

            </div>
        </section>
    );
}