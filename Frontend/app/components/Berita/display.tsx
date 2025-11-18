import React from "react";

export default function BeritaA() {
  return (
    <div className="font-sans bg-white text-gray-800 min-h-screen">

      {/* Tambahkan padding-top agar tidak tertutup navbar */}
      <div className="pt-28 px-20 max-w-6xl mx-auto">


        <h1 className="text-3xl font-bold text-orange-500">Berita A</h1>

        <div className="flex flex-wrap gap-3 mt-4">
          <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded">
            31 Agustus 2025
          </span>
          <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded">
            Nama Penulis
          </span>
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco.
        </p>

        <div className="flex justify-center my-8">
          <img
            src="/galeri/eventB.jpg"
            alt="Banner"
            className="w-full max-w-5xl rounded-lg shadow-lg object-cover aspect-video"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <a
            href="#"
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            <span>📄</span> Panduan
          </a>

          <a
            href="#"
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            <span>📝</span> Daftar Sekarang
          </a>
        </div>

      </div>
    </div>
  );
}
