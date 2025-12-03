import { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";

interface NewsData {
  title: string;
  category: string;
  date: string;
  publisher: string;
  location: string; 
  content: string;
  docGuide: string;
  newsLink: string;
}

interface NewsFormProps {
  onClose: () => void;
  onSubmit: (newsData: NewsData) => void;
  initialData?: NewsData;
}

export default function NewsForm({ onClose, onSubmit, initialData }: NewsFormProps) {

  const isEditMode = !!initialData;
  const formTitle = isEditMode ? "Edit Post" : "Add New Post";
  const submitButtonLabel = isEditMode ? "Save Changes" : "Add";

  const defaultFormData: NewsData = {
    title: "",
    category: "News", 
    date: "",
    publisher: "",
    location: "", 
    content: "",
    docGuide: "",
    newsLink: "",
  };

  const [formData, setFormData] = useState<NewsData>(
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
  
  const handleDocGuideUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      setFormData((prev) => ({
        ...prev,
        docGuide: `[Placeholder URL for ${file.name}]`,
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.date || !formData.publisher || !formData.location || !formData.content) {
      alert("Please fill in all required fields (marked with *)");
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
              placeholder="Enter post title" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="relative">
              <label className="block text-base font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-10"
              >
                <option value="News">News</option>
                <option value="Workshop">Workshop</option>
                <option value="Article">Article</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
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
                placeholder="e.g., 12 Jun 2025" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Publisher *
              </label>
              <input 
                type="text" 
                name="publisher" 
                value={formData.publisher} 
                onChange={handleChange} 
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="e.g., Aulia Resty Azizah" 
              />
            </div>

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
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Enter the full post content here..."
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Link
            </label>
            <input
              type="url"
              name="newsLink"
              value={formData.newsLink}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://link-eksternal.com"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Reference Document
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="docguide-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud size={24} className="text-gray-400 mb-1" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX, or TXT (Max 10MB)</p>
                  {formData.docGuide && (
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      File Selected: {formData.docGuide.includes('[Placeholder URL for ') ? formData.docGuide.replace('[Placeholder URL for ', '').replace(']', '') : "Existing Document"}
                    </p>
                  )}
                </div>
                <input id="docguide-file" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleDocGuideUpload} />
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
            {submitButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}