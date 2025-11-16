interface ProfileCardProps {
  image: string;
  name: string;
  role: string;
  tags: string[];
  socials?: {
    linkedin?: string;
    email?: string;
    website?: string;
  };
  onClick?: () => void;
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
      className="relative w-full max-w-xs rounded-3xl overflow-hidden 
                 shadow-md border bg-white cursor-pointer"
    >
      {/* foto */}
      <img
        src={image}
        alt={name}
        className="w-full h-[390px] object-cover"
      />

      {/* transparant bg */}
      <div
        className="absolute bottom-0 left-0 right-0 
                   bg-white/40
                   p-4 rounded-t-2xl"
      >
        {/* name */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {name}
        </h3>

        {/* role */}
        <p className="text-sm text-gray-700 mt-1">{role}</p>

        {/* tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-[#292929] text-white px-3 py-1 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* contact */}
        <div className="flex items-center gap-3 mt-4">
          {socials?.linkedin && (
            <a href={socials.linkedin} target="_blank">
              <div className="p-2 rounded-full bg-[#292929] hover:bg-gray-300">
                <svg width="18" height="18" fill="currentColor">
                  <path d="M4 3a2 2 0 11-.001 3.999A2 2 0 014 3zM3 7h2v8H3V7zm4 0h2v1.1a3 3 0 015 2.9V15h-2v-3.5a1.5 1.5 0 10-3 0V15H7V7z" />
                </svg>
              </div>
            </a>
          )}

          {socials?.email && (
            <a href={`mailto:${socials.email}`}>
              <div className="p-2 rounded-full bg-[#292929] hover:bg-gray-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v1l-10 7L2 7V6c0-1.1.9-2 2-2z"/>
                    <path d="M2 8l10 7 10-7v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8z"/>
                </svg>
              </div>
            </a>
          )}

          {socials?.website && (
            <a href={socials.website} target="_blank">
              <div className="p-2 rounded-full bg-[#292929] hover:bg-gray-300">
                <svg width="18" height="18" fill="currentColor">
                  <path d="M9 1L1 7h2v8h4V11h4v4h4V7h2L9 1z" />
                </svg>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
