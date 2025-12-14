import { UploadCloud } from "lucide-react";

interface ThumbnailUploaderProps {
  url: string;
  date?: string;
  type?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function ThumbnailUploader({
  url,
  date,
  type,
  onUpload,
  onRemove,
}: ThumbnailUploaderProps) {
  return (
    <div>
      <label className="block text-base font-medium text-gray-700 mb-2">
        Thumbnail (Card Cover)
      </label>
      <div className="flex justify-center md:justify-start">
        <div className="relative group w-full md:w-96 aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden hover:border-orange-500 transition-colors">
          {url ? (
            <>
              <img
                src={url}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                <label className="cursor-pointer px-4 py-2 bg-white/90 text-gray-800 rounded-lg text-sm font-medium hover:bg-white transition shadow-sm">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUpload(file);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                  className="px-4 py-2 bg-red-500/90 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition shadow-sm"
                >
                  Remove
                </button>
              </div>
              <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded shadow-sm">
                  {date || "Date"}
                </span>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded shadow-sm">
                  {type || "Type"}
                </span>
              </div>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Upload Thumbnail
              </span>
              <span className="text-xs text-gray-400 mt-1">
                rec. size 1280x720
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file);
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
