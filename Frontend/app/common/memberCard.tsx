interface ProfileCardProps {
  image: string;
  name: string;
  role: string;
  tags: string[];
  socials?: {
    linkedin?: string;
    email?: string;
  };
  onClick?: () => void;

  isLeader?: boolean;
}

export default function ProfileCard({
  image,
  name,
  role,
  tags,
  socials,
  onClick,
}: ProfileCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative w-full max-w-xs rounded-[32px] overflow-hidden shadow-lg bg-white cursor-pointer"
    >
      {/* Foto */}
      <img
        src={image}
        alt={name}
        className="w-full h-[390px] object-cover"
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 
                      bg-gradient-to-t from-black/65 via-black/20 to-transparent">
        
        {/* Nama */}
        <h3 className="text-white text-lg font-semibold leading-tight drop-shadow">
          {name}
        </h3>

        {/* Role */}
        <p className="text-white/90 text-sm mt-1 drop-shadow">
          {role}
        </p>

        {/* Tags + Socials Container */}
        <div className="flex items-center justify-between mt-4">
          
          {/* Tags kiri */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-black/80 text-white px-3 py-1 rounded-lg backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Social kanan */}
          <div className="flex items-center gap-3">
            {socials?.linkedin && (
              <a href={socials.linkedin} target="_blank">
                <div className="p-2 rounded-full bg-black/80 hover:bg-black/60 text-white">
                  <svg width="18" height="18" fill="currentColor">
                    <path d="M4 3a2 2 0 11-.001 3.999A2 2 0 014 3zM3 7h2v8H3V7zm4 0h2v1.1a3 3 0 015 2.9V15h-2v-3.5a1.5 1.5 0 10-3 0V15H7V7z" />
                  </svg>
                </div>
              </a>
            )}

            {socials?.email && (
              <a href={`mailto:${socials.email}`}>
                <div className="p-2 rounded-full bg-black/80 hover:bg-black/60 text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v1l-10 7L2 7V6c0-1.1.9-2 2-2z"/>
                    <path d="M2 8l10 7 10-7v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8z"/>
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
