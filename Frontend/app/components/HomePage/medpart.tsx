"use client"

import { useEffect, useState } from "react"

export function MediaPartner() {
  const logos = [
    { src: "/logo/otsukah.svg", name: "LINE" },
    { src: "/logo/apple.svg", name: "Intel" },
    { src: "/logo/logitech.svg", name: "XL Axiata" },
    { src: "/logo/otsukah.svg", name: "LINE" },
    { src: "/logo/apple.svg", name: "Intel" },
    { src: "/logo/logitech.svg", name: "XL Axiata" },
  ]

  // gandakan biar infinite
  const items = [...logos, ...logos]

  const [index, setIndex] = useState(0)

  // AUTOPLAY STEP BY STEP
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // kalau index terlalu besar, reset agar tidak overflow (tanpa terlihat oleh user)
  const safeIndex = index % logos.length

  return (
    <section className="bg-white md:py-20 px-10 sm:px-10 lg:px-20">
      {/* TITLE */}
      <div className="max-w-7xl mx-auto md:mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Media Partner
        </h2>
        <div className="w-12 h-1 bg-orange-600 mt-4"></div>
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
    </section>
  )
}
