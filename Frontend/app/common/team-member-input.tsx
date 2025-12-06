import { Plus, Trash2, User } from "lucide-react";

const PROJECT_ROLES: Record<string, string[]> = {
  "UI/UX": ["UI Designer", "UX Researcher", "Interaction Designer"],
  Game: ["Game Designer", "Game Programmer", "3D Artist", "Sound Engineer"],
  Web: ["Frontend Dev", "Backend Dev", "Fullstack Dev", "QA Engineer"],
  AR: ["AR Developer", "3D Modeler", "Technical Artist"],
  VR: ["VR Developer", "Environment Artist", "Unity/Unreal Dev"],
  Mobile: ["Android Dev", "iOS Dev", "Flutter/React Native Dev"],
};

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  imageFile?: File;
}

interface TeamMemberInputProps {
  members: TeamMember[];
  projectType: string;
  onChange: (updatedMembers: TeamMember[]) => void;
}

export default function TeamMemberInput({ members, projectType, onChange }: TeamMemberInputProps) {
  const currentRoles = PROJECT_ROLES[projectType] || ["Member"];

  const handleAdd = () => {
    onChange([
      ...members,
      { name: "", role: currentRoles[0] || "Member", imageUrl: "" },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handlePhotoUpload = (index: number, file: File) => {
    const updated = [...members];
    updated[index] = {
      ...updated[index],
      imageUrl: URL.createObjectURL(file),
      imageFile: file,
    };
    onChange(updated);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-base font-medium text-gray-700">Team Members</label>
        <button
          onClick={handleAdd}
          type="button"
          className="text-sm flex items-center gap-1 text-orange-600 font-semibold hover:text-orange-700 transition"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="space-y-4">
        {members.length === 0 && (
          <div className="text-center py-6 text-gray-400 italic text-sm border-2 border-gray-200 rounded-lg">
            No team members added yet.
          </div>
        )}

        {members.map((member, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            
            {/* Photo Input */}
            <div className="shrink-0">
              <label className="relative block w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-orange-500 cursor-pointer group bg-gray-50 transition-colors">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 group-hover:text-orange-500">
                    <User size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={20} className="text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(index, e.target.files[0])}
                />
              </label>
            </div>

            {/* Details Input */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Member Name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
              />
              <select
                value={member.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer"
              >
                {currentRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleRemove(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end md:self-center"
              title="Remove Member"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}