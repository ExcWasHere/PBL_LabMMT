import { useState, useEffect } from "react";
import { X, UploadCloud, Check } from "lucide-react";

const MEDIA_TYPES = ["Photo", "Video", "Animation"];

interface GalleryData {
  title: string;
  description: string;
  location: string;
  date: string;
  mediaTypes: string[]; 
  mediaFiles: string[]; 
}

interface GalleryFormProps {
  onClose: () => void;
  onSubmit: (galleryData: GalleryData) => void;
  initialData?: GalleryData;
}

export default function GalleryForm({ onClose, onSubmit, initialData }: GalleryFormProps) {
  
  const isEditMode = !!initialData;
  const formTitle = isEditMode ? "Edit Gallery" : "Add New Gallery";
  const submitButtonLabel = isEditMode ? "Save Changes" : "Add";

  const defaultFormData: GalleryData = {
    title: "",
    description: "",
    location: "",
    date: "",
    mediaTypes: [], 
    mediaFiles: [], 
  };

  const [formData, setFormData] = useState<GalleryData>(
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
  
  const handleMediaTypeChange = (type: string) => {
    setFormData((prev) => {
      if (prev.mediaTypes.includes(type)) {
        return {
          ...prev,
          mediaTypes: prev.mediaTypes.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          mediaTypes: [...prev.mediaTypes, type],
        };
      }
    });
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map(file => `[Uploaded: ${file.name}]`);
      
      setFormData((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...newFiles],
      }));
      e.target.value = ''; 
    }
  };

  const handleDeleteMedia = (fileToDelete: string) => {
    setFormData((prev) => ({
        ...prev,
        mediaFiles: prev.mediaFiles.filter(file => file !== fileToDelete)
    }));
  };


  const handleSubmit = () => {
    if (
      !formData.title || 
      !formData.description || 
      !formData.location || 
      !formData.date ||
      formData.mediaTypes.length === 0
    ) {
      alert("Please fill in all required fields (marked with *) and select at least one Media Type.");
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
            <label className="block text-base font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder="Enter gallery title" 
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="e.g., Online, Malang, Sipil Building" 
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input 
                type="text" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="e.g., 25 Dec 2025" 
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Media Type * (Select one or more)
            </label>
            <div className="flex flex-wrap gap-4">
              {MEDIA_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleMediaTypeChange(type)}
                  className={`flex items-center px-4 py-2 rounded-lg border transition duration-150 ${
                    formData.mediaTypes.includes(type)
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {formData.mediaTypes.includes(type) && <Check size={16} className="mr-2" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Upload Media (Photo/Video/Animation)
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="media-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud size={24} className="text-gray-400 mb-1" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> (Multi-select)
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG, GIF, MP4, MOV, dll.</p>
                </div>
                <input 
                    id="media-file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*,video/*" 
                    multiple 
                    onChange={handleMediaUpload} 
                />
              </label>
            </div>
          </div>
          
          {formData.mediaFiles.length > 0 && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {formData.mediaFiles.length} File Uploaded:
                  </h3>
                  <ul className="space-y-1">
                      {formData.mediaFiles.map((file, index) => (
                          <li key={index} className="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded-md border">
                              <span className="truncate">{file.replace('[Uploaded: ', '').replace(']', '')}</span>
                              <button 
                                  type="button" 
                                  onClick={() => handleDeleteMedia(file)}
                                  className="ml-4 text-red-500 hover:text-red-700 transition"
                              >
                                  <X size={16} />
                              </button>
                          </li>
                      ))}
                  </ul>
              </div>
          )}
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
            {submitButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}