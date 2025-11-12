interface CardProps {
  image: string;
  date: string;
  info: string;
  title: string;
  desc: string;
  tags: string[];
}

export default function Card({
  image,
  date,
  info,
  title,
  desc,
  tags,
}: CardProps) {
  return (
    <div
      className="group rounded-2xl overflow-hidden 
                 border border-gray-200 shadow-sm"
    >
      <div className="relative overflow-hidden">
        {/* gambar */}
        <img
          src={image}
          alt={title}
          className="w-full aspect-video object-cover transition-transform 
                     duration-500 group-hover:scale-110"
        />

        {/* overlay gelap */}
        <div
          className="absolute inset-0 bg-black/50 opacity-0 
                     group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* hover atas - date and location */}
        <div
          className="absolute top-4 left-4 z-10 opacity-0 -translate-y-4
                     group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-500
                     flex items-center gap-2">
          {/* date */}
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {date}
          </span>

          {/* location */}
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {info}
          </span>
        </div>
      </div>

      {/* bagian bawah */}
      <div className="bg-white p-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((t, i) => (
            <span
              key={i}
              className="bg-orange-500 text-white text-xs 
                         px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}