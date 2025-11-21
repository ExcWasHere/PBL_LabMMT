import React from "react";

export default function BeritaDetail() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">

      {/* WRAPPER SAMA PERSIS PROFILE SINGKAT */}
      <div className="py-16 md:py-20 px-10 sm:px-10 lg:px-20">

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto">

          {/* HEADER IMAGE – DIMULAI DI BAWAH NAVBAR */}
          <img
            src="/galeri/eventC.jpg"
            alt="Header"
            className="w-full rounded-xl shadow-lg"
          />

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-10 leading-tight text-gray-900">
            Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem
          </h1>

          {/* META */}
          <p className="text-center text-gray-600 mt-3 text-sm">
            Posted in April 17, 2025 —{" "}
            <span className="font-semibold">Aulia Resty Azizah</span>
          </p>

          {/* CONTENT */}
          <p className="mt-10 text-gray-700 leading-relaxed text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">

          {/* Tombol Panduan */}
          <a
            href="#"
            className="flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            {/* Icon Dokumen (putih) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 3.5L19.5 9H14V3.5z" />
            </svg>
            Panduan
          </a>

          {/* Tombol Link */}
          <a
            href="#"
            className="flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            {/* Icon External Link (simple & clean) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M14 7h2a5 5 0 010 10h-2v-2h2a3 3 0 000-6h-2V7zm-4 10H8a5 5 0 010-10h2v2H8a3 3 0 000 6h2v2zm-3-6h10v2H7v-2z"/>
</svg>

            Link
          </a>

        </div>

        </div>
      </div>
    </div>
  );
}
