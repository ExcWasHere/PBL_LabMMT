import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function MediaPartner() {
  const logos = [
    { src: "/logo/otsukah.svg", name: "LINE" },
    { src: "/logo/apple.svg", name: "Intel" },
    { src: "/logo/logitech.svg", name: "XL Axiata" },
    { src: "/logo/otsukah.svg", name: "LINE" },
    { src: "/logo/apple.svg", name: "Intel" },
    { src: "/logo/logitech.svg", name: "XL Axiata" },
  ]
  const items = [...logos, ...logos]
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  const safeIndex = index % logos.length

  return (
   <section className="bg-white text-left pt-5 pb-30 px-4 sm:px-10 lg:px-20">
       <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Media Partner</h2>
        </motion.div>
        <div className="mt-4 mb-20 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}  
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-orange-600"
          />
        </div>

      {/* CAROUSEL */}
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div
          className="flex gap-12 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${safeIndex * 20}%)`,
          }}
        >
          {items.map((logo, i) => (
            <div
              key={i}
              className="flex-[0_0_20%] md:flex-[0_0_16%] flex justify-center"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-14 md:h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}