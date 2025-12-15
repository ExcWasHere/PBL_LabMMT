import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Ganti useNavigate dengan Link

const API_BASE_URL = "http://localhost:3000";

export default function BeritaDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(false);

    fetch(`${API_BASE_URL}/news/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setNews(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading news...
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-2xl font-semibold mb-2">
          Berita tidak ditemukan
        </h2>
        <p>Link mungkin salah atau berita sudah dihapus.</p>
        <Link to="/news" className="mt-4 text-orange-500 hover:underline">
          Kembali ke News
        </Link>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      
      {/* CONTAINER UTAMA */}
      <div className="py-10 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* BACK BUTTON (Style disamakan dengan ProjectDetail) */}
        <Link 
          to="/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6 group transition-colors"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to News</span>
        </Link>

        {/* HEADER IMAGE */}
        <img
          src={news.imageUrl || "/placeholder.png"}
          alt={news.title}
          className="w-full rounded-xl shadow-lg object-cover aspect-video"
        />

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-10">
          {news.title}
        </h1>

        {/* META */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Posted on{" "}
          {new Date(news.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          —{" "}
          <span className="font-semibold text-orange-600">
            {news.publisher || "Admin"}
          </span>
        </p>

        {/* CATEGORY */}
        {news.kategori && (
          <div className="flex justify-center mt-4">
            <span className="bg-orange-100 text-orange-600 text-sm px-4 py-1 rounded-full">
              {news.kategori}
            </span>
          </div>
        )}

        {/* CONTENT */}
        <article className="mt-12 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {news.content || "Tidak ada konten."}
        </article>

        {/* ACTION BUTTON */}
        {(news.docGuide || news.newsLink) && (
          <div className="flex justify-center flex-wrap gap-4 mt-14">
            {news.docGuide && (
              <a
                href={news.docGuide}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
              >
                Panduan
              </a>
            )}

            {news.newsLink && (
              <a
                href={news.newsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50 transition"
              >
                Link Project
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}