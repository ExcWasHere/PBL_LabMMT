import React from "react";

export default function BeritaA() {
  return (
    <div className="font-sans bg-white text-gray-800 min-h-screen">

      {/* Tambahkan padding-top agar tidak tertutup navbar */}
      <div className="pt-28 px-20 max-w-6xl mx-auto">

        {/* Judul */}
        <h1 className="text-3xl font-bold text-orange-500">Berita A</h1>

        {/* Tanggal & Penulis */}
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded">
            31 Agustus 2025
          </span>
          <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded">
            Nama Penulis
          </span>
        </div>

        {/* Tag */}
        <div className="mt-4 flex gap-2">
          <span className="px-3 py-1 bg-gray-200 text-xs rounded">Event</span>
          <span className="px-3 py-1 bg-gray-200 text-xs rounded">Komunitas</span>
          <span className="px-3 py-1 bg-gray-200 text-xs rounded">Edukasi</span>
        </div>

        {/* Paragraf awal */}
        <p className="mt-4 text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco.
        </p>

        {/* Gambar utama */}
        <div className="flex justify-center my-8">
          <img
            src="/galeri/eventB.jpg"
            alt="Banner"
            className="w-full max-w-5xl rounded-lg shadow-lg object-cover aspect-video"
          />
        </div>

        {/* Isi Berita Lengkap */}
        <h2 className="text-xl font-semibold mt-10 mb-3">Isi Berita Lengkap</h2>
        <p className="text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui
          mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero
          tortor, tincidunt et, tincidunt eget, placerat nec, nibh. Sed lectus.
        </p>

        {/* Tombol panduan & daftar */}
        <div className="flex flex-wrap gap-4 mt-6">
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

        {/* Tombol Share */}
        <div className="mt-8 flex gap-4">
          <button className="bg-gray-900 text-white px-4 py-2 rounded">
            Share
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded">
            Copy Link
          </button>
        </div>

        {/* Profil Penulis */}
        <div className="mt-16 flex items-center gap-4 p-5 border rounded-xl shadow-sm">
          <img
            src="/galeri/eventA.jpg"
            alt="Penulis"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              Nama Penulis
            </h3>
            <p className="text-sm text-gray-600">
              Penulis dan kontributor tetap di portal MMT News.
            </p>
          </div>
        </div>

        {/* Berita Terkait */}
        <div className="mt-20">
          <h2 className="text-xl font-semibold mb-4">Berita Terkait</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="shadow rounded-lg overflow-hidden border">
              <img
                src="/galeri/eventA.jpg"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  Judul Terkait 1
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  summary of the news
                </p>
              </div>
            </div>

            <div className="shadow rounded-lg overflow-hidden border">
              <img
                src="/galeri/eventB.jpg"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  Judul Terkait 2
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  summary of the news
                </p>
              </div>
            </div>

            <div className="shadow rounded-lg overflow-hidden border">
              <img
                src="/galeri/eventA.jpg"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  Judul Terkait 3
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Summary of the news
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
