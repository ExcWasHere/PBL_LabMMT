import { useState, useEffect, useMemo } from "react"; 
import { X, Check, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import MediaUploader from "./media-uploader";
import ThumbnailUploader from "./thumbnail-uploader";

const MEDIA_TYPES = ["Photo", "Video", "Animation"];

interface GalleryData {
  title: string;
  description: string;
  location: string;
  date: string;
  mediaTypes: string[];
  mediaFiles: string[];
  mediaFilesRaw?: File[];
  thumbnailUrl: string;
  thumbnailFile?: File;
}

interface GalleryFormProps {
  onClose: () => void;
  onSubmit: (galleryData: GalleryData) => void;
  initialData?: GalleryData;
}

export default function GalleryForm({
  onClose,
  onSubmit,
  initialData,
}: GalleryFormProps) {
  const isEditMode = !!initialData;
  const formTitle = isEditMode ? "Edit Gallery" : "Add New Gallery";
  const submitButtonLabel = isEditMode ? "Save Changes" : "Publish";

  const defaultFormData: GalleryData = {
    title: "",
    description: "",
    location: "",
    date: "",
    mediaTypes: [],
    mediaFiles: [],
    thumbnailUrl: "",
  };

  const [formData, setFormData] = useState<GalleryData>(
    initialData || defaultFormData
  );

  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const hasChanges = useMemo(() => {
    if (!isEditMode || !initialData) return true;

    if (formData.title !== initialData.title) return true;
    if (formData.description !== initialData.description) return true;
    if (formData.location !== initialData.location) return true;
    if (formData.date !== initialData.date) return true;

    const currentTypes = [...formData.mediaTypes].sort().join(",");
    const initialTypes = [...initialData.mediaTypes].sort().join(",");
    if (currentTypes !== initialTypes) return true;

    if (formData.thumbnailFile) return true; 
    if (formData.mediaFilesRaw && formData.mediaFilesRaw.length > 0) return true; 

    const currentUrls = [...formData.mediaFiles].sort().join(",");
    const initialUrls = [...initialData.mediaFiles].sort().join(",");
    if (currentUrls !== initialUrls) return true;

    return false;
  }, [formData, initialData, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
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

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.date ||
      formData.mediaTypes.length === 0
    ) {
      alert(
        "Please fill in all required fields (marked with *) and select at least one Media Type."
      );
      return;
    }

    if (isEditMode) {
        const confirmSave = window.confirm(
            "Perubahan ini akan mengubah status postingan menjadi 'Review' untuk diperiksa ulang oleh admin. Lanjutkan?"
        );
        if (!confirmSave) return; 
    }

    onSubmit(formData);
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

  const openPreview = () => {
    if (formData.mediaFiles.length === 0) {
      alert("Please upload media first to preview.");
      return;
    }
    setShowPreviewPopup(true);
    setCurrentPreviewIndex(0);
  };

  const closePreview = () => {
    setShowPreviewPopup(false);
  };

  const goToNext = () => {
    setCurrentPreviewIndex((prev) =>
      prev === formData.mediaFiles.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setCurrentPreviewIndex((prev) =>
      prev === 0 ? formData.mediaFiles.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="w-full h-full p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-orange-600">{formTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        {/* --- FORM AREA --- */}
        <div className="max-w-6xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-sm pb-24">
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
                type="date"
                name="date"
                min={minDate}
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mt-4 mb-6">
            <ThumbnailUploader
              url={formData.thumbnailUrl}
              date={formData.date}
              type="Gallery"
              onUpload={(file) =>
                setFormData((prev) => ({
                  ...prev,
                  thumbnailUrl: URL.createObjectURL(file),
                  thumbnailFile: file,
                }))
              }
              onRemove={() =>
                setFormData((prev) => ({
                  ...prev,
                  thumbnailUrl: "",
                  thumbnailFile: undefined,
                }))
              }
            />
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
                  {formData.mediaTypes.includes(type) && (
                    <Check size={16} className="mr-2" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* --- UPLOAD AREA --- */}
          <div>
            <MediaUploader
              label="Upload Media (Photo/Video/Animation)"
              description="Photo (JPG/PNG), Video (MP4), Animation (GIF)"
              accept="image/*,video/*"
              maxFiles={20}
              initialMedia={formData.mediaFiles}
              onMediaChange={(newFiles) => {
                const newPreviewUrls = newFiles.map((file) =>
                  URL.createObjectURL(file)
                );

                setFormData((prev) => ({
                  ...prev,
                  mediaFiles: [...prev.mediaFiles, ...newPreviewUrls],
                  mediaFilesRaw: [...(prev.mediaFilesRaw || []), ...newFiles],
                }));
              }}

              onRemove={(itemRemoved) => {
                setFormData((prev) => {
                  const updatedMediaFiles = prev.mediaFiles.filter(
                    (url) => url !== itemRemoved
                  );
                  return {
                    ...prev,
                    mediaFiles: updatedMediaFiles,
                  };
                });
              }}
            />
          </div>
        </div>

        {/* --- FOOTER BUTTONS --- */}
        <div className="max-w-6xl mx-auto flex justify-end gap-4 mt-8 sticky bottom-0 bg-white py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={openPreview}
            disabled={formData.mediaFiles.length === 0}
            className={`px-6 py-3 bg-gray-800 text-white rounded-lg font-medium transition flex items-center gap-2 ${formData.mediaFiles.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"}`}
          >
            <Eye size={18} /> Preview
          </button>

          {/* BUTTON SAVE CHANGES YANG DIMODIFIKASI */}
          <button
            onClick={handleSubmit}
            disabled={isEditMode && !hasChanges} 
            className={`px-8 py-3 text-base rounded-lg transition ${
              isEditMode && !hasChanges
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-orange-600 text-white hover:bg-orange-700" 
            }`}
          >
            {submitButtonLabel}
          </button>
        </div>

        {/* --- PREVIEW POPUP --- */}
        {showPreviewPopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={closePreview}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] p-4 z-10 flex flex-col">
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 text-black hover:bg-gray-200 rounded-full p-2 transition z-50"
              >
                <X size={28} />
              </button>

              <div className="relative flex items-center justify-center flex-1 overflow-hidden bg-gray-100 rounded-xl mt-10">
                <img
                  src={formData.mediaFiles[currentPreviewIndex]}
                  alt="preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {formData.mediaFiles.length > 0 && (
                <div className="flex justify-center items-center gap-6 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="p-3 rounded-full hover:bg-orange-100 text-black hover:text-orange-600 transition"
                  >
                    <ChevronLeft size={32} />
                  </button>

                  <div className="text-xl font-semibold text-gray-700 min-w-[80px] text-center">
                    {currentPreviewIndex + 1} / {formData.mediaFiles.length}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="p-3 rounded-full hover:bg-orange-100 text-black hover:text-orange-600 transition"
                  >
                    <ChevronRight size={32} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}