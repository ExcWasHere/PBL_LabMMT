import { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";

interface ProjectData {
  title: string;
  description: string;
  type: string;
  date: string;
  tech: string;
  teamMembers: string;
  githubLink: string;
  demoLink: string;
  photoUrl: string;
}

interface ProjectFormProps {
  onClose: () => void;
  onSubmit: (projectData: ProjectData) => void;
  initialData?: ProjectData;
}

export default function ProjectForm({ onClose, onSubmit, initialData }: ProjectFormProps) {
  
  const isEditMode = !!initialData;
  const formTitle = isEditMode ? "Edit Project" : "Add New Project";

  const defaultFormData: ProjectData = {
    title: "",
    description: "",
    type: "UI/UX",
    date: "",
    tech: "",
    teamMembers: "",
    githubLink: "",
    demoLink: "",
    photoUrl: "",
  };

  const [formData, setFormData] = useState<ProjectData>(
    initialData || defaultFormData
  );

  useEffect(() => {
      setFormData(initialData || defaultFormData);
  }, [initialData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      setFormData((prev) => ({
        ...prev,
        photoUrl: `[Placeholder URL for ${file.name}]`,
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.date || !formData.tech || !formData.teamMembers) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="w-full h-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-orange-600">{formTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Project Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter project title" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" placeholder="Enter project description" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-base font-medium text-gray-700 mb-2">Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-10">
                <option value="UI/UX">UI/UX</option>
                <option value="Game">Game</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="AR">AR</option>
                <option value="VR">VR</option>
                <option value="Mobile">Mobile</option>
                <option value="Desktop">Desktop</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Date *</label>
              <input type="text" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., 12 jun 2025" />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Tech Stack *</label>
            <input type="text" name="tech" value={formData.tech} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., React, TypeScript, Tailwind CSS" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Team Members *</label>
            <input type="text" name="teamMembers" value={formData.teamMembers} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., John Doe, Jane Smith, Alex Brown" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">GitHub Link</label>
            <input type="url" name="githubLink" value={formData.githubLink} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://github.com/username/repository" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Demo Link</label>
            <input type="url" name="demoLink" value={formData.demoLink} onChange={handleChange} className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://demo-link.com" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Project Image / Video</label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud size={32} className="text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, MOV, AVI (Max 50MB)</p>
                  {formData.photoUrl && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      File Selected: {formData.photoUrl.includes('[Placeholder URL for ') ? formData.photoUrl.replace('[Placeholder URL for ', '').replace(']', '') : "Existing File"}
                    </p>
                  )}
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="image/*,video/*" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex justify-end gap-4 mt-8 sticky bottom-0 bg-white py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 text-base bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            {isEditMode ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}