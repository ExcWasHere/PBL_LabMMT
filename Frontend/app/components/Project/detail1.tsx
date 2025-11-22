import { useState } from "react";
import { ArrowBigLeft } from "lucide-react";
import { ArrowBigRight } from "lucide-react";
import { projects } from "~/components/Project/dataProjects";
import Card from "../../common/card";
import { Link } from "react-router-dom";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Image as ImageIcon,
  Smile,
  AtSign,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  BadgeCheck,
} from "lucide-react";
import { Star } from "lucide-react";

export function Detail1() {
  // --- Bagian Team ---
  const team = [
    { name: "Roby", role: "Designer", img: "/proyek/12.avif" },
    { name: "Rudi", role: "Developer", img: "/proyek/12.avif" },
    { name: "Redi", role: "Consumption", img: "/proyek/12.avif" },
  ];

  // --- Data & State Baru untuk Carousel Gambar ---
  const projectImages = [
    "/proyek/images.jpg",
    "/proyek/test2.jpg",
    "/proyek/images.png",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + projectImages.length) % projectImages.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projectImages.length);
  };

  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Mas Ganteng",
      avatar: "/proyek/12.avif",
      time: "58 minutes ago",
      text: "wow keren",
      rating: 5, // User ini memberi rating 5
      likes: 25,
      replies: [
        {
          id: 2,
          user: "Mbak atmin", // Admin membalas (tidak ada rating)
          avatar: "/proyek/images.png",
          time: "8 minutes ago",
          text: "makasih mas",
          likes: 2,
        },
      ],
    },
    {
      id: 3,
      user: "abc",
      avatar: "/proyek/12.avif",
      time: "2 hours ago",
      text: "Lumayan lah.",
      rating: 4, // User ini memberi rating 4
      likes: 2,
      replies: [],
    },
  ]);

  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0); // Rating yang dipilih user saat mau komen
  const [hoverRating, setHoverRating] = useState(0); // Efek hover bintang di input

  // -- Logic Rating --
  const totalRating = comments.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating =
    comments.length > 0
      ? (totalRating / comments.length).toFixed(1) // Ambil 1 desimal (cth: 4.5)
      : 0;

  // --- Data Baru dari Gambar ---
  const projectDetails = [
    { label: "Type", value: "Game" },
    { label: "Date", value: "23 November 2025" },
    { label: "Tech", value: "Unity, Blender" },
    { label: "Rating", value: averageRating },
  ];

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const recommendations = projects
    .filter((p) => p.title !== "Project A")
    .slice(0, 3);

  // --- FUNGSI SUBMIT KOMENTAR ---
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    // Validasi: User harus kasih rating kalau mau review (opsional, bisa dihapus kalau rating ga wajib)
    if (userRating === 0) {
      alert("Please give a rating!");
      return;
    }

    const newComment = {
      id: Date.now(), // ID unik sederhana
      user: "Guest User", // Ceritanya user yang sedang login
      avatar: "/proyek/12.avif", // Default avatar
      time: "Just now",
      text: commentText,
      rating: userRating, // Rating dari input user
      likes: 0,
      replies: [],
    };

    setComments([newComment, ...comments]); // Tambah ke paling atas
    setCommentText(""); // Reset text
    setUserRating(0); // Reset rating input
  };

  // --- HELPER: Render Bintang (Read Only) ---
  // Digunakan untuk menampilkan bintang di detail project & list komentar
  const renderStars = (ratingVal: any) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= Math.round(Number(ratingVal))
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 pt-20">
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* --- Layout Baru (Grid 2 Kolom) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Kolom Kiri: Image Carousel */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden group">
            <img
              src={projectImages[currentIndex]}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
              alt="Project preview"
            />
            {/* Tombol Panah (Hanya muncul jika gambar > 1) */}
            {projectImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowBigLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowBigRight size={24} />
                </button>
              </>
            )}

            {/* Indikator Titik (Dots) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {projectImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    i === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentIndex(i)}
                ></div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Detail Proyek */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Project A</h1>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco. Sed ut
              perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>

            {/* Detail List */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Project Details
              </h3>
              <div className="space-y-3">
                {projectDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex flex-col sm:flex-row sm:justify-between"
                  >
                    <span className="font-semibold text-gray-800">
                      {detail.label}
                    </span>
                    <span className="text-gray-600 text-left sm:text-right flex items-center gap-2 sm:justify-end">
                      {detail.label === "Rating" ? (
                        // --- TAMPILAN RATA-RATA RATING ---
                        <>
                          <span className="font-bold text-yellow-500 text-lg">
                            {detail.value}
                          </span>
                          <div className="flex pb-1">
                            {/* Menampilkan bintang berdasarkan rata-rata */}
                            {renderStars(detail.value)}
                          </div>
                          <span className="text-xs text-gray-400">
                            ({comments.length} reviews)
                          </span>
                        </>
                      ) : (
                        detail.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Garis Pemisah --- */}
        <hr className="my-12 border-gray-200" />

        {/* --- Bagian Team Member --- */}
        <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
        <div className="flex flex-wrap gap-2">
          {team.map((t, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden shadow-md group w-[225px]"
            >
              {/* Foto */}
              <img
                src={t.img}
                alt={t.name}
                className="w-56 h-70 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay gelap + text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-sm text-gray-200">{t.role}</p>
                <div className="mt-2 flex gap-3 text-white text-lg">
                  <i className="ri-mail-line cursor-pointer hover:text-orange-400"></i>
                  <i className="ri-linkedin-box-line cursor-pointer hover:text-orange-400"></i>
                  <i className="ri-github-line cursor-pointer hover:text-orange-400"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- 3. SECTION REKOMENDASI BARU --- */}
        <hr className="my-12 border-gray-200" />

        <section id="recommendations">
          <h2 className="text-2xl font-semibold mb-6">Other Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recommendations.map((project, i) =>
              // Kita gunakan logic Link yang sama dari coba.tsx
              // (Meskipun "Project A" sudah difilter, ini untuk konsistensi)
              project.title === "Project A" ? (
                <Link to="/detail-project" key={i}>
                  <Card {...project} />
                </Link>
              ) : (
                // Proyek lain (B, C, D, dst.) akan ditampilkan sebagai Card biasa
                <Card key={i} {...project} />
              )
            )}
          </div>
        </section>

        <hr className="my-12 border-gray-200" />

        {/* --- SECTION REVIEWS & COMMENTS --- */}
        <section id="comments" className="max-w-4xl">
          {/* INPUT BOX DENGAN RATING */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-10 shadow-sm">
            {/* Area Pilih Rating */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">
                Your Rating:
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110 px-0.5"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= (hoverRating || userRating)
                          ? "fill-orange-400 text-orange-400"
                          : "fill-transparent text-gray-300"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-orange-500 font-medium ml-2">
                {userRating > 0 ? `${userRating}.0` : ""}
              </span>
            </div>

            <textarea
              value={commentText}
              rows={2}
              placeholder="Write a review..."
              className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 text-gray-700 placeholder-gray-400 outline-none resize-none overflow-hidden transition-all"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
                setCommentText(target.value);
              }}
            />

            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-4 text-gray-400">
                <LinkIcon
                  size={20}
                  className="cursor-pointer hover:text-gray-600"
                />
                <ImageIcon
                  size={20}
                  className="cursor-pointer hover:text-gray-600"
                />
              </div>
              <button
                onClick={handleSubmitComment}
                className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Header Jumlah Reviews */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Reviews
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            </h3>
          </div>

          {/* LIST COMMENTS */}
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id}>
                {/* Parent Comment (Reviewer) */}
                <div className="flex gap-4">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-lg">
                          {comment.user}
                        </span>

                        {/* --- TAMPILKAN RATING DI SAMPING NAMA --- */}
                        {/* Hanya tampilkan jika user ini memberikan rating (bukan admin/reply) */}
                        {comment.rating && (
                          <div className="flex items-center bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                            <span className="text-xs font-bold text-orange-600 mr-1">
                              {comment.rating}.0
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={10}
                                  className={
                                    s <= comment.rating
                                      ? "fill-orange-400 text-orange-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <span className="text-xs text-gray-400">
                        {comment.time}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed text-[15px] break-all">
                      {comment.text}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-6 text-gray-400 text-sm font-medium">
                      <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                        <ThumbsUp size={16} />({comment.likes})
                      </button>
                      {/* Tombol Reply (Hanya visual di sini, logic reply admin beda lagi) */}
                      {/* <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                        <MessageSquare size={16} /> Reply
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* Replies (Admin Response) - Tanpa Rating */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-4 flex flex-col gap-4 relative">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex gap-4 ml-10 relative bg-gray-50 p-4 rounded-xl border border-gray-100"
                      >
                        {/* Garis Konektor */}
                        <div className="absolute -left-6 -top-6 w-6 h-12 border-l-2 border-b-2 border-gray-200 rounded-bl-2xl"></div>

                        <div className="relative z-10 flex-shrink-0">
                          <img
                            src={reply.avatar}
                            alt={reply.user}
                            className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900 flex items-center gap-1 text-sm">
                              {reply.user}
                              {/* Badge Admin/Owner */}
                              <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">
                                Owner
                              </span>
                            </span>
                            <span className="text-xs text-gray-400">
                              {reply.time}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {reply.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bagian buttons di bawah team telah dihapus agar sesuai gambar */}
      </main>
    </div>
  );
}
