export function DetailMember() {
  return (
    <section className="bg-white max-w-7xl mx-auto px-6 lg:px-12 py-14">

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-50 items-start">

        {/* LEFT TEXT */}
        <div className="col-span-2">
          <p className="py-4 text-gray-500 text-lg">Ketua Lab</p>

          <h1 className="text-4xl font-bold text-gray-900">
            Dimas Wahyu Wibowo, S.T., M.T.
          </h1>

          {/* TAGS */}
          <div className="flex flex-wrap gap-3 text-gray-600 mt-5">
            <span className="px-4 py-1 border rounded-full text-sm">AI</span>
            <span className="px-4 py-1 border rounded-full text-sm">Machine Learning</span>
            <span className="px-4 py-1 border rounded-full text-sm">Data Science</span>
          </div>

          {/* SOCIAL BUTTONS */}
          <div className="text-gray-600 flex flex-wrap gap-3 mt-4">
            <div className="px-4 py-1 rounded-full border text-sm">LinkedIn</div>
            <div className="px-4 py-1 rounded-full border text-sm">Email</div>
            <div className="px-4 py-1 rounded-full border text-sm">Google Scholar</div>
            <div className="px-4 py-1 rounded-full border text-sm">Sinta</div>
            <div className="px-4 py-1 rounded-full border text-sm">CV</div>
          </div>
        </div>

        {/* PHOTO PLACEHOLDER */}
        <div>
          <div className="w-full h-64 bg-gray-300 rounded-xl" />
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">

         <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
  {/* Kontainer Grid dengan 3 Kolom */}
  <div className="grid grid-cols-[max-content_max-content_1fr] text-sm">
    
    {/* Baris 1: NIP */}
    <span className="font-semibold pr-2">NIP</span> 
    <span className="font-semibold pr-4">:</span> 
    <span className="mb-2">1987654321</span>

    {/* Baris 2: NIDN */}
    <span className="font-semibold pr-2">NIDN</span>
    <span className="font-semibold pr-4">:</span>
    <span className="mb-2">1234567890</span>
    
    {/* Baris 3: Program Studi */}
    <span className="font-semibold pr-2">Program Studi</span>
    <span className="font-semibold pr-4">:</span>
    <span className="mb-2">Teknik Informatika</span>
    
    {/* Baris 4: Jabatan */}
    <span className="font-semibold pr-2">Jabatan</span>
    <span className="font-semibold pr-4">:</span>
    <span>Dosen Tetap</span>
    
  </div>
</div>

        {/* PENDIDIKAN */}
  <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
    <h3 className="font-semibold text-gray-700 mb-3">Pendidikan</h3>
    <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
      <li>S1 – Teknik Informatika, ITS</li>
      <li>S2 – Teknologi Informasi, UB</li>
      <li>S3 – (Dalam proses)</li>
    </ul>
  </div>

         {/* SERTIFIKASI */}
  <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
    <h3 className="font-semibold text-gray-700 mb-3">Sertifikasi</h3>
    <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
      <li>Oracle Java Certification</li>
      <li>Google Cloud Engineer</li>
      <li>Data Analyst Certification</li>
    </ul>
  </div>

</div>

      {/* MatKul */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

         {/* Ganjil */}
  <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
    <h3 className="font-semibold text-gray-700 mb-3">Semester Ganjil</h3>
    <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
      <li>Machine Learning</li>
      <li>Struktur Data</li>
      <li>Pemrograman Web</li>
    </ul>
  </div>
         {/* Genap */}
  <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
    <h3 className="font-semibold text-gray-700 mb-3">Semester Genap</h3>
    <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
      <li>AI Lanjut</li>
      <li>Pemrograman Mobile</li>
      <li>Jaringan Komputer</li>
    </ul>
  </div>

</div>
    </section>
  );
}
