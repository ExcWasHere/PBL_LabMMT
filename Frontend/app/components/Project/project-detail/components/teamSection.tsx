import type { TeamMember } from "../types";

interface TeamSectionProps {
  members: TeamMember[];
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
      <div className="flex flex-wrap gap-4">
        {members.map((t, i) => (
          <div
            key={i}
            className="relative rounded-xl overflow-hidden shadow-md group w-[225px] h-[300px]"
          >
            <img
              src={t.img}
              alt={t.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error(`Failed to load image for ${t.name}:`, t.img);
                e.currentTarget.src = `https://i.pravatar.cc/300?u=${encodeURIComponent(t.name)}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <p className="text-sm text-gray-200">{t.role}</p>
              <div className="mt-2 flex gap-3 text-white text-lg">
                <i className="ri-mail-line cursor-pointer hover:text-orange-400 transition"></i>
                <i className="ri-linkedin-box-line cursor-pointer hover:text-orange-400 transition"></i>
                <i className="ri-github-line cursor-pointer hover:text-orange-400 transition"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}