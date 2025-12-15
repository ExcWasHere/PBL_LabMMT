interface CardProps {
  image: string;
  date: string;
  kategori?: string; // Ubah jadi optional (pakai tanda tanya)
  title: string;
  desc: string;
  tags: string[];
  location?: string;
}

export default function Card({
  image,
  date,
  kategori,
  title,
  desc,
  tags,
  location,
}: CardProps) {
  return (
    <div
      className="
        group rounded-2xl overflow-hidden
        border border-gray-200 shadow-sm
        hover:shadow-md transition
        cursor-pointer
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full aspect-video object-cover
                      transition-transform duration-700
                      group-hover:scale-105"
        />

        <div
          className="absolute inset-0 bg-black/50 opacity-0
                      group-hover:opacity-100 transition-opacity duration-500"
        />

        <div
          className="absolute top-4 left-4 z-10
                      opacity-0 -translate-y-4
                      group-hover:opacity-100
                      group-hover:translate-y-0
                      transition-all duration-500
                      flex items-center gap-2"
        >
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {date}
          </span>

          {/* HANYA RENDER KALO KATEGORI ADA ISINYA */}
          {kategori && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              {kategori}
            </span>
          )}

          {location && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              {location}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white p-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((t, i) => (
            <span
              key={i}
              className="bg-orange-500 text-white text-xs px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}