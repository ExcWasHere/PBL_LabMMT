import { useState, useEffect } from "react";
import { UploadCloud, X, FileVideo, Image as ImageIcon, FileText } from "lucide-react";

interface MediaUploaderProps {
  label?: string;
  initialMedia?: string[]; 
  description?: string;
  onMediaChange: (files: File[]) => void; 
  maxFiles?: number;
  accept?: string; 
  allowMultiple?: boolean;
}

export default function MediaUploader({ 
  label = "Upload Media", 
  initialMedia = [], 
  description,
  onMediaChange, 
  maxFiles = 5,
  accept = "image/*,video/*", 
  allowMultiple = true
}: MediaUploaderProps) {
  
  const [previews, setPreviews] = useState<{url: string, type: string}[]>(
    initialMedia.map(url => {
      const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i); 
      return { url, type: isVideo ? 'video/mp4' : 'image/jpeg' };
  })
  );
  
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
      });
    };
  }, [previews]);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const fileArray = Array.from(newFiles);
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maksimal ${maxFiles} file`);
      return;
    }

    const newPreviews = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type
    }));
    
    const updatedFiles = allowMultiple ? [...files, ...fileArray] : fileArray;
    const updatedPreviews = allowMultiple ? [...previews, ...newPreviews] : newPreviews;

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    
    onMediaChange(updatedFiles);
  };

  const handleRemove = (index: number) => {
    const urlToRemove = previews[index].url;
    if (urlToRemove.startsWith('blob:')) URL.revokeObjectURL(urlToRemove);

    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    
    setPreviews(newPreviews);
    setFiles(newFiles);
    onMediaChange(newFiles);
  };

  return (
    <div className="w-full">
      <label className="block text-base font-medium text-gray-700 mb-2">{label}</label>
      
      <label 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { 
          e.preventDefault(); 
          setIsDragging(false); 
          handleFiles(e.dataTransfer.files); 
        }}
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition relative overflow-hidden
          ${isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
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
            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              
              {item.type.startsWith('image') ? (
                <img src={item.url} alt="preview" className="w-full h-full object-cover" />
              ) : item.type.startsWith('video') ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                   <video src={item.url} className="w-full h-full object-cover opacity-80" />
                   <FileVideo className="absolute text-white w-8 h-8" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                  <FileText className="text-gray-500 w-8 h-8 mb-1" />
                  <span className="text-xs text-gray-500 break-all">File {idx + 1}</span>
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