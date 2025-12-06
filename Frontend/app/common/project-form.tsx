import { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import MediaUploader from "~/common/media-uploader";
import TeamMemberInput, { type TeamMember } from "./team-member-input";
import ThumbnailUploader from "./thumbnail-uploader";

import { ImageCarousel } from "~/components/Project/project-detail/components/imageCarousel";
import { ProjectInfo } from "~/components/Project/project-detail/components/projectInfo";
import { TeamSection } from "~/components/Project/project-detail/components/teamSection";

interface ProjectData {
  title: string;
  description: string;
  type: string;
  date: string;
  tech: string;
  thumbnailUrl: string;
  thumbnailFile?: File;
  teamMembers: TeamMember[];
  githubLink: string;
  demoLink: string;
  photoUrls: string[];
  photoFiles?: File[];
}

interface ProjectFormProps {
  onClose: () => void;
  onSubmit: (projectData: ProjectData) => void;
  initialData?: any;
}

export default function ProjectForm({ onClose, onSubmit, initialData }: ProjectFormProps) {
  const isEditMode = !!initialData;
  const [showPreview, setShowPreview] = useState(false);
  const formTitle = isEditMode ? "Edit Project" : "Add New Project";

  const defaultFormData: ProjectData = {
    title: "",
    description: "",
    type: "UI/UX",
    date: "",
    tech: "",
    thumbnailUrl: "",
    teamMembers: [],
    githubLink: "",
    demoLink: "",
    photoUrls: [],
  };

  const [formData, setFormData] = useState<ProjectData>(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        teamMembers: Array.isArray(initialData.teamMembers) ? initialData.teamMembers : [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.date || !formData.tech) {
      alert("Please fill in required fields (Title, Description, Date, Tech)");
      return;
    }
    const invalidMember = formData.teamMembers.find((m) => !m.name);
    if (invalidMember) {
      alert("Please fill in names for all team members");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // --- PREVIEW DATA HELPER ---
  const getPreviewProps = () => ({
    details: [
      { label: "Type", value: formData.type },
      { label: "Date", value: formatDate(formData.date) },
      { label: "Tech", value: formData.tech },
      { label: "Link", value: [{ text: "GitHub", url: formData.githubLink || "#" }, { text: "Demo", url: formData.demoLink || "#" }].filter(l => l.url !== "#") },
      { label: "Rating", value: 0 },
    ],
    members: formData.teamMembers.map((m) => ({
      name: m.name,
      role: m.role,
      img: m.imageUrl || `https://i.pravatar.cc/150?u=${m.name}`,
    })),
    images: formData.photoUrls.length > 0 ? formData.photoUrls : ["https://placehold.co/600x400?text=No+Image+Uploaded"],
  });

  const previewData = getPreviewProps();

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto font-sans">
      <div className="w-full h-full p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-orange-600">{formTitle}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition"><X size={28} className="text-gray-600" /></button>
        </div>

        <div className="max-w-6xl mx-auto space-y-6 pb-24">
          {showPreview ? (
            /* PREVIEW MODE */
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg mb-8 flex items-center gap-2 text-sm">
                <Eye size={16} /> <span>This is a preview mode.</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div><ImageCarousel images={previewData.images} /></div>
                <div>
                  <ProjectInfo 
                    title={formData.title || "Untitled Project"} 
                    description={formData.description} 
                    details={previewData.details} 
                    reviewCount={0} 
                  />
                </div>
              </div>
              {previewData.members.length > 0 && (
                <>
                  <hr className="my-12 border-gray-200" />
                  <TeamSection members={previewData.members} />
                </>
              )}
            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
              
              {/* Basic Info */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Project Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter project title" />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" placeholder="Enter project description" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Type *</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer">
                    {["UI/UX", "Game", "Web", "AR", "VR", "Mobile"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Tech Stack *</label>
                <input type="text" name="tech" value={formData.tech} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., React, TypeScript, Tailwind CSS" />
              </div>

              <ThumbnailUploader 
                url={formData.thumbnailUrl}
                date={formData.date}
                type={formData.type}
                onUpload={(file) => setFormData(prev => ({ ...prev, thumbnailUrl: URL.createObjectURL(file), thumbnailFile: file }))}
                onRemove={() => setFormData(prev => ({ ...prev, thumbnailUrl: "", thumbnailFile: undefined }))}
              />

              <TeamMemberInput 
                members={formData.teamMembers}
                projectType={formData.type}
                onChange={(updatedMembers) => setFormData(prev => ({ ...prev, teamMembers: updatedMembers }))}
              />

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">GitHub Link</label>
                  <input type="url" name="githubLink" value={formData.githubLink} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Demo Link</label>
                  <input type="url" name="demoLink" value={formData.demoLink} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://..." />
                </div>
              </div>

              {/* Gallery Uploader */}
              <div className="mt-4">
                <MediaUploader
                  label="Project Gallery (Photo & Video)"
                  maxFiles={10}
                  accept="image/*,video/*"
                  initialMedia={formData.photoUrls}
                  onMediaChange={(files) => {
                    const previewUrls = files.map(file => URL.createObjectURL(file));
                    setFormData(prev => ({ ...prev, photoFiles: files, photoUrls: previewUrls }));
                  }}
                />
              </div>

            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="max-w-6xl mx-auto flex justify-end gap-4 mt-8 sticky bottom-0 bg-white py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-8 py-3 text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${showPreview ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-gray-800 text-white hover:bg-gray-900"}`}
          >
            {showPreview ? "Back to Edit" : <><Eye size={18} /> Preview</>}
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition shadow-sm">
            {isEditMode ? "Save Changes" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}