import { useParams } from "react-router-dom"; // Import useParams
import { members } from "./datadummyMember";

export function DetailMember() {
  const { id } = useParams(); 
  const memberId = id ? parseInt(id) : 1; 
  
  const member = members.find(m => m.id === memberId);
  
  // Handle jika member tidak ditemukan
  if (!member) {
    return (
      <section className="bg-white max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <h1 className="text-2xl font-bold text-red-600">Member tidak ditemukan</h1>
        <p className="text-gray-600 mt-2">ID: {id}</p>
      </section>
    );
  }

  return (
    <section className="bg-white max-w-7xl mx-auto px-6 lg:px-12 py-14">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-50 items-start">
        {/* LEFT TEXT */}
        <div className="md:col-span-2">
          <p className="py-4 text-gray-500 text-lg">{member.jabatan}</p>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {member.nama}
          </h1>

          {/* TAGS */}
          <div className="flex flex-wrap gap-3 text-gray-600 mt-5">
            {member.tags.map((tag, index) => (
              <span key={index} className="px-4 py-1 border rounded-full text-sm">
                {tag}
              </span>
            ))}
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
        <div className="mt-6 md:mt-0">
          <div className="w-full max-w-xs mx-auto md:max-w-none md:w-full h-64 bg-gray-300 rounded-xl" />
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
        <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
          <div className="grid grid-cols-[max-content_max-content_1fr] text-sm">
            <span className="font-semibold pr-2">NIP</span>
            <span className="font-semibold pr-4">:</span>
            <span className="mb-2">{member.nip}</span>

            <span className="font-semibold pr-2">NIDN</span>
            <span className="font-semibold pr-4">:</span>
            <span className="mb-2">{member.nidn}</span>

            <span className="font-semibold pr-2">Program Studi</span>
            <span className="font-semibold pr-4">:</span>
            <span className="mb-2">{member.prodi}</span>

            <span className="font-semibold pr-2">Jabatan</span>
            <span className="font-semibold pr-4">:</span>
            <span>{member.jabatanAkademik}</span>
          </div>
        </div>

        {/* PENDIDIKAN */}
        <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
          <h3 className="font-semibold text-gray-700 mb-3">Pendidikan</h3>
          <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
            {member.pendidikan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* SERTIFIKASI */}
        <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
          <h3 className="font-semibold text-gray-700 mb-3">Sertifikasi</h3>
          <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
            {member.sertifikasi.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* MatKul */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
          <h3 className="font-semibold text-gray-700 mb-3">Semester Ganjil</h3>
          <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
            {member.matkulGanjil.map((matkul, index) => (
              <li key={index}>{matkul}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-6 text-gray-700">
          <h3 className="font-semibold text-gray-700 mb-3">Semester Genap</h3>
          <ul className="list-disc ml-5 text-sm space-y-1 font-normal">
            {member.matkulGenap.map((matkul, index) => (
              <li key={index}>{matkul}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}