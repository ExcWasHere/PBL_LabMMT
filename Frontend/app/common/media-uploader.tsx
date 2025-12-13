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

type PreviewItem = {
  url: string;
  type: "image" | "video" | "file";
  isBlob: boolean;
};

export default function MediaUploader({
  label = "Upload Media",
  initialMedia = [],
  description,
  onMediaChange,
  maxFiles = 5,
  accept = "image/*,video/*",
  allowMultiple = true,
}: MediaUploaderProps) {
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (newFiles.length === 0) {
      setExistingUrls(initialMedia);
    }
  }, [initialMedia, newFiles.length]);

  useEffect(() => {
    return () => {
      newPreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [newPreviewUrls]);

  const getFileType = (url: string, file?: File): "image" | "video" | "file" => {
    if (file) {
      if (file.type.startsWith("image/")) return "image";
      if (file.type.startsWith("video/")) return "video";
      return "file"; 
    }
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/)) return "video";
    if (lowerUrl.match(/\.(pdf|doc|docx|xls|xlsx|zip|rar)$/)) return "file";
    
    if (accept?.includes(".pdf") && !lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return "file";
    }
    return "image";
  };

  const buildPreviews = (): PreviewItem[] => {
    if (!allowMultiple && newPreviewUrls.length > 0) {
      return newPreviewUrls.map((url, idx) => ({
        url,
        type: getFileType(url, newFiles[idx]),
        isBlob: true,
      }));
    }

    const existing: PreviewItem[] = existingUrls.map((url) => ({
      url,
      type: getFileType(url),
      isBlob: url.startsWith("blob:"),
    }));

    const news: PreviewItem[] = newPreviewUrls.map((url, idx) => ({
      url,
      type: getFileType(url, newFiles[idx]),
      isBlob: true,
    }));

    return [...existing, ...news];
  };

  const previews = buildPreviews();

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const incoming = Array.from(fileList);
    const totalCurrent = existingUrls.length + newFiles.length;

    if (allowMultiple) {
      if (totalCurrent + incoming.length > maxFiles) {
        alert(`Maksimal ${maxFiles} file`);
        return;
      }
      const incomingUrls = incoming.map((file) => URL.createObjectURL(file));
      
      setNewFiles([...newFiles, ...incoming]);
      setNewPreviewUrls([...newPreviewUrls, ...incomingUrls]);
      onMediaChange([...newFiles, ...incoming]);
    } else {
      const incomingUrls = incoming.map((file) => URL.createObjectURL(file));
      
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));

      setExistingUrls([]);
      setNewFiles(incoming.slice(0, 1));
      setNewPreviewUrls(incomingUrls.slice(0, 1));
      onMediaChange(incoming.slice(0, 1));
    }
  };

  const handleRemove = (index: number) => {    
    let isRemovingExisting = false;
    
    if (!allowMultiple && newFiles.length > 0) {
        isRemovingExisting = false;
    } else {
        isRemovingExisting = index < existingUrls.length;
    }

    if (isRemovingExisting) {
      const newExisting = existingUrls.filter((_, i) => i !== index);
      setExistingUrls(newExisting);
      onMediaChange(newFiles); 
      return;
    }

    const relativeIndex = isRemovingExisting ? (index - existingUrls.length) : index;
    
    if (relativeIndex < 0 || relativeIndex >= newFiles.length) return;

    const urlToRemove = newPreviewUrls[relativeIndex];
    if (urlToRemove) URL.revokeObjectURL(urlToRemove);

    const updatedFiles = newFiles.filter((_, i) => i !== relativeIndex);
    const updatedUrls = newPreviewUrls.filter((_, i) => i !== relativeIndex);

    setNewFiles(updatedFiles);
    setNewPreviewUrls(updatedUrls);
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
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition relative overflow-hidden
          ${
            isDragging
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
      >
        <div className="flex flex-col items-center pt-5 pb-6">
          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center px-4">
            <span className="font-semibold">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {description || "Image, Video, or Document"}
          </p>
        </div>
      
        <input
          type="file"
          className="hidden"
          multiple={allowMultiple}
          accept={accept}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = ""; 
          }}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
          {previews.map((item, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : item.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <FileVideo className="absolute text-white w-8 h-8" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-white">
                  <FileText className="text-orange-500 w-8 h-8 mb-1" />
                  <span className="text-[10px] text-gray-500 leading-tight break-all px-1">
                    {item.url.split('/').pop()?.substring(0, 15) || "File"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}