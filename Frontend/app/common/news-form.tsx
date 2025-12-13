import { useState, useEffect, useMemo } from "react";
import { X, Eye, Download, ExternalLink } from "lucide-react";
import MediaUploader from "./media-uploader";

interface NewsData {
  title: string;
  category: string;
  date: string;
  publisher: string;
  location: string;
  content: string;
  docGuide: string;
  newsLink: string;
  coverUrl: string;
  coverFile?: File;
  docFile?: File;
}

interface NewsFormProps {
  onClose: () => void;
  onSubmit: (newsData: NewsData) => void | Promise<void>;
  initialData?: NewsData;
  readOnly?: boolean;
}

const normalizeDateInput = (value: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const getPublisherName = () => {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "KetuaLab";
    const parsed = JSON.parse(raw);
    return (
      parsed.name ??
      parsed.fullname ??
      parsed.username ??
      "KetuaLab"
    );
  } catch {
    return "KetuaLab";
  }
};

export default function NewsForm({
  onClose,
  onSubmit,
  initialData,
  readOnly = false,
}: NewsFormProps) {
  const isEditMode = !!initialData;
  const [showPreview, setShowPreview] = useState(readOnly);
  const formTitle = readOnly
    ? "Review Submission"
    : isEditMode
    ? "Edit Post"
    : "Add New Post";

  const defaultFormData: NewsData = {
    title: "",
    category: "News",
    date: "",
    publisher: "",
    location: "",
    content: "",
    docGuide: "",
    newsLink: "",
    coverUrl: "",
  };

  const [formData, setFormData] = useState<NewsData>(
    initialData || defaultFormData
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        date: normalizeDateInput(initialData.date),
      });
    } else {
      setFormData((prev) => ({
        ...defaultFormData,
        ...prev,
        publisher: prev.publisher || getPublisherName(),
      }));
    }
  }, [initialData]);

  const hasChanges = useMemo(() => {
    if (!isEditMode || !initialData) return true;

    if (formData.coverFile || formData.docFile) return true;

    if (formData.title !== (initialData.title || "")) return true;
    if (formData.category !== (initialData.category || "News")) return true;
    if (normalizeDateInput(formData.date) !== normalizeDateInput(initialData.date)) return true;
    if (formData.publisher !== (initialData.publisher || "")) return true;
    if (formData.location !== (initialData.location || "")) return true;
    if (formData.content !== (initialData.content || "")) return true;
    if (formData.newsLink !== (initialData.newsLink || "")) return true;
    
    if (formData.coverUrl !== (initialData.coverUrl || "")) return true;
    if (formData.docGuide !== (initialData.docGuide || "")) return true;

    return false;
  }, [formData, initialData, isEditMode]);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.category ||
      !formData.date ||
      !formData.content
    ) {
      alert("Please fill in required fields");
      return;
    }

    if (isEditMode) {
      const confirmSave = window.confirm(
        "This change will return the post status to ‘Review’ for re-examination. Are you sure you want to proceed?"
      );
      if (!confirmSave) return; 
    }

    await onSubmit(formData);
    onClose();
  };

  const getTodayString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const minDate = getTodayString();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto font-sans">
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

        <div className="max-w-6xl mx-auto space-y-6 pb-24">
          {showPreview ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              {!readOnly && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg mb-8 flex items-center gap-2 text-sm">
                  <Eye size={16} />
                  <span>
                    You are viewing a preview. Links and downloads are disabled in
                    this mode.
                  </span>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="relative">
                  <img
                    src={
                      formData.coverUrl ||
                      "https://placehold.co/1200x600?text=No+Cover+Image"
                    }
                    alt="Header"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="p-8 md:p-12 max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
                        {formData.category}
                      </span>
                      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-4 break-words">
                        {formData.title || (
                          <span className="text-gray-300 italic">
                            Untitled Post
                          </span>
                        )}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        {formatDate(formData.date) || "Unknown Date"} •{" "}
                        <span className="font-semibold text-gray-900">
                          {formData.publisher}
                        </span>
                        {formData.location && ` • ${formData.location}`}
                      </p>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {formData.content || (
                        <span className="text-gray-300 italic">
                          No content written yet...
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mt-12 border-t border-gray-100 pt-8">
                      {formData.docGuide ? (
                        <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition shadow-sm opacity-80 cursor-not-allowed">
                          <Download size={20} /> Download Guide
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 italic px-4 py-2 border border-dashed border-gray-300 rounded-lg">
                          No Document Attached
                        </span>
                      )}

                      {formData.newsLink && (
                        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition shadow-sm opacity-80 cursor-not-allowed">
                          <ExternalLink size={20} /> Visit Link
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
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
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-10 cursor-pointer"
                  >
                    <option value="News">News</option>
                    <option value="Training">Training</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Articles">Articles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={minDate}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    placeholder="Malang, Polinema"
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
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none leading-relaxed"
                  placeholder="Enter your description here"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  External Link (Optional)
                </label>
                <input
                  type="url"
                  name="newsLink"
                  value={formData.newsLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <MediaUploader
                    label="Cover Image (Header)"
                    accept="image/*"
                    maxFiles={1}
                    allowMultiple={false}
                    initialMedia={formData.coverUrl ? [formData.coverUrl] : []}
                    onMediaChange={(files) => {
                      if (files.length > 0) {
                        const url = URL.createObjectURL(files[0]);
                        setFormData((prev) => ({
                          ...prev,
                          coverUrl: url,
                          coverFile: files[0],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          coverUrl: "",
                          coverFile: undefined,
                        }));
                      }
                    }}
                  />
                </div>

                <div>
                  <MediaUploader
                    label="Reference Document"
                    accept=".pdf,.doc,.docx"
                    maxFiles={1}
                    allowMultiple={false}
                    initialMedia={
                      formData.docGuide &&
                      !formData.docGuide.startsWith("[Mock")
                        ? [formData.docGuide]
                        : []
                    }
                    onMediaChange={(files) => {
                      if (files.length > 0) {
                        setFormData((prev) => ({
                          ...prev,
                          docGuide: files[0].name,
                          docFile: files[0],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          docGuide: "",
                          docFile: undefined,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto flex justify-end gap-4 mt-8 sticky bottom-0 bg-white py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            {readOnly ? "Close Preview" : "Cancel"}
          </button>

          {!readOnly && !showPreview && (
            <button
              onClick={() => setShowPreview(true)}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium transition flex items-center gap-2"
            >
              <Eye size={18} /> Preview
            </button>
          )}

          {!readOnly && showPreview && (
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition flex items-center gap-2"
            >
              Back to Edit
            </button>
          )}

          {!readOnly && (
            <button
              onClick={handleSubmit}
              disabled={isEditMode && !hasChanges}
              className={`px-8 py-2.5 rounded-lg font-medium transition shadow-sm ${
                isEditMode && !hasChanges
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {isEditMode ? "Save Changes" : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}