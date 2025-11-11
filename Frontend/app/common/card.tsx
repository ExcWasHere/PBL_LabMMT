interface CardProps {
  image: string;
  date: string;
  title: string;
  desc: string;
  tags: string[];
}

export default function Card({ image, date, title, desc, tags }: CardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl">
      {/* Gambar */}
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* hover atas - date only */}
      <div
        className="absolute top-4 left-4 z-10 opacity-0 -translate-y-4 
                   group-hover:opacity-100 group-hover:translate-y-0 
                   transition-all duration-500"
      >
        <span className="bg-black text-white text-xs px-2 py-1 rounded">
          {date}
        </span>
      </div>

      {/* hover bawah - title, desc, category */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4 z-10
                   opacity-0 translate-y-4 group-hover:opacity-100 
                   group-hover:translate-y-0 transition-all duration-500 text-white"
      >
        {/* Tanggal sudah dipindah ke atas */}
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-200 mb-2">{desc}</p>

        {/* Tag */}
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span
              key={i}
              className="bg-black text-white text-xs px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}