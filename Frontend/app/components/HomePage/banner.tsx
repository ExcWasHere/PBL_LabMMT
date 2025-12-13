import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom"; 

export function LatestNewsSection() {
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
                src="/home/LabCondition.jpg" 
                alt="Highlight News" 
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden"></div>
            </div>

            
            <div className="p-6 md:p-12 lg:p-14 flex flex-col justify-center">
              
           
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium mb-4">
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-orange-600 shadow-sm border border-orange-100">
                  <Tag size={14} /> 
                  Workshop
                </span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <Calendar size={14} /> 
                  12 Dec 2025
                </span>
              </div>

             
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors cursor-pointer">
                Judul Berita atau Event Terbaru Ada Disini
              </h3>

             
              <p className="text-gray-600 mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed">
                Ini adalah contoh deskripsi singkat berita. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>

              <div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
                  Read Article
                  <ArrowRight size={18} />
                </button>
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