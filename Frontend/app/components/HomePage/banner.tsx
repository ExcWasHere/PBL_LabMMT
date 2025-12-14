import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000";
const PUBLIC_NEWS_ENDPOINT = `${API_BASE_URL}/news/public`;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export function LatestNewsSection() {
  const [latestNews, setLatestNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(PUBLIC_NEWS_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort dari yang paling baru berdasarkan createdAt
          const sorted = data.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setLatestNews(sorted[0]);
        }
      })
      .catch((err) => console.error("Error fetching latest news:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; 
  if (!latestNews) return null; 

  return (
    <section className="bg-white text-left py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-8 md:mb-10">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Latest Updates
            </h2>
            <p className="text-gray-500 mt-3 text-base md:text-lg">
              Stay updated with our latest activities, workshops, and news.
            </p>
          </div>
          
          <Link 
            to="/news" 
            className="hidden md:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            See all news <ArrowRight size={20} />
          </Link>
        </div>

        <div className="group relative rounded-2xl overflow-hidden bg-[#FAF5F0] border border-orange-100/50 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="grid md:grid-cols-2 h-full">
            
            <div className="relative h-64 md:h-auto overflow-hidden bg-gray-200">
              <img 
                src={latestNews.imageUrl || "/home/LabCondition.jpg"} 
                alt={latestNews.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden"></div>
            </div>

            <div className="p-6 md:p-12 lg:p-14 flex flex-col justify-center">
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium mb-4">
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-orange-600 shadow-sm border border-orange-100">
                  <Tag size={14} /> 
                  {latestNews.kategori || "News"}
                </span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <Calendar size={14} /> 
                  {formatDate(latestNews.createdAt)}
                </span>
              </div>

              <Link to={`/news/slug/${slugify(latestNews.title)}`}>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors cursor-pointer">
                  {latestNews.title}
                </h3>
              </Link>

              <p className="text-gray-600 mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed">
                {latestNews.content}
              </p>

              <div>
                <Link to={`/news/slug/${slugify(latestNews.title)}`}>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
                    Read Article
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
            <Link 
            to="/news" 
            className="inline-flex items-center justify-center gap-2 text-gray-600 font-medium hover:text-orange-600 transition-colors w-full p-2"
          >
            View all archives <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}