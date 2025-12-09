import { useState, useEffect } from "react";
import { UploadCloud, X, FileVideo, FileText } from "lucide-react";

interface MediaUploaderProps {
  label?: string;
  initialMedia?: string[];
  description?: string;
  onMediaChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  allowMultiple?: boolean;
}

type PreviewItem = { url: string; type: string };

export default function MediaUploader({
  label = "Upload Media",
  initialMedia = [],
  description,
  onMediaChange,
  maxFiles = 5,
  accept = "image/*,video/*",
  allowMultiple = true,
}: MediaUploaderProps) {
  // URL yang sudah ada dari backend (string, non-blob)
  const [existingUrls, setExistingUrls] = useState<string[]>([]);

  // File baru yang dipilih user
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  // 💡 kalau initialMedia berubah, ambil HANYA yang bukan blob:
  // supaya blob URL yang dibuat parent nggak bikin duplikat preview
  useEffect(() => {
    const nonBlob = initialMedia.filter((url) => !url.startsWith("blob:"));
    setExistingUrls(nonBlob);
  }, [initialMedia]);

  // cleanup blob URL untuk file baru
  useEffect(() => {
    return () => {
      newPreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [newPreviewUrls]);

  const buildPreviews = (): PreviewItem[] => {
    const existing: PreviewItem[] = existingUrls.map((url) => {
      const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
      return {
        url,
        type: isVideo ? "video/mp4" : "image/jpeg",
      };
    });

    const news: PreviewItem[] = newPreviewUrls.map((url, idx) => ({
      url,
      type: newFiles[idx]?.type || "image/jpeg",
    }));

    return [...existing, ...news];
  };

  const previews = buildPreviews();

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const incoming = Array.from(fileList);

    // total = existing (dari backend) + new + incoming
    const currentCount = existingUrls.length + newFiles.length;
    if (currentCount + incoming.length > maxFiles) {
      alert(`Maksimal ${maxFiles} file`);
      return;
    }

    const incomingUrls = incoming.map((file) => URL.createObjectURL(file));

    let updatedFiles: File[];
    let updatedPreviewUrls: string[];

    if (allowMultiple) {
      updatedFiles = [...newFiles, ...incoming];
      updatedPreviewUrls = [...newPreviewUrls, ...incomingUrls];
    } else {
      // kalau cuma boleh 1: replace semuanya (existing + new)
      newPreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });

      updatedFiles = incoming.slice(0, 1);
      updatedPreviewUrls = incomingUrls.slice(0, 1);
      setExistingUrls([]); // gak pake lagi existing kalau single
    }

    setNewFiles(updatedFiles);
    setNewPreviewUrls(updatedPreviewUrls);
    onMediaChange(updatedFiles); // cuma kirim file baru ke parent
  };

  const handleRemove = (index: number) => {
    // kalau index masih di dalam existingUrls → hapus dari existing saja
    if (index < existingUrls.length) {
      const newExisting = existingUrls.filter((_, i) => i !== index);
      setExistingUrls(newExisting);
      // newFiles tidak berubah; onMediaChange tetap newFiles sekarang
      onMediaChange(newFiles);
      return;
    }

    // kalau yang dihapus adalah file baru
    const newIndex = index - existingUrls.length;
    const urlToRemove = newPreviewUrls[newIndex];

    if (urlToRemove && urlToRemove.startsWith("blob:")) {
      URL.revokeObjectURL(urlToRemove);
    }

    const updatedPreviewUrls = newPreviewUrls.filter((_, i) => i !== newIndex);
    const updatedFiles = newFiles.filter((_, i) => i !== newIndex);

    setNewPreviewUrls(updatedPreviewUrls);
    setNewFiles(updatedFiles);
    onMediaChange(updatedFiles);
  };

  return (
    <div className="w-full">
      <label className="block text-base font-medium text-gray-700 mb-2">
        {label}
      </label>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition relative overflow-hidden
          ${
            isDragging
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
      >
        <div className="flex flex-col items-center pt-5 pb-6">
          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center px-4">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {description || "Image, Video (Max 50MB)"}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          multiple={allowMultiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {previews.map((item, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
            >
              {item.type.startsWith("image") ? (
                <img
                  src={item.url}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : item.type.startsWith("video") ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <FileVideo className="absolute text-white w-8 h-8" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                  <FileText className="text-gray-500 w-8 h-8 mb-1" />
                  <span className="text-xs text-gray-500 break-all">
                    File {idx + 1}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}