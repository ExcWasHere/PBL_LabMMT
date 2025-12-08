import { Eye, EyeOff, Pencil, Trash } from "lucide-react";

interface TableActionsProps {
  status: string;
  onToggleMute: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TableActions({
  status,
  onToggleMute,
  onEdit,
  onDelete,
}: TableActionsProps) {
  const isReview = status === "Review";
  const isMuted = status === "Muted";
  const isWaiting = status === "Waiting";
  const isDenied = status === "Denied"; 

  const isMuteDisabled = isReview || isWaiting || isDenied;

  const isEditDeleteDisabled = isReview;

  const disabledStyle = "text-gray-300 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className={`transition-colors ${
          isMuteDisabled ? disabledStyle : "text-gray-600 hover:text-blue-600"
        }`}
        onClick={() => !isMuteDisabled && onToggleMute()}
        disabled={isMuteDisabled}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      <button
        className={`transition-colors ${
          isEditDeleteDisabled ? disabledStyle : "text-gray-600 hover:text-green-500"
        }`}
        onClick={() => !isEditDeleteDisabled && onEdit()}
        disabled={isEditDeleteDisabled}
        title="Edit"
      >
        <Pencil size={18} />
      </button>

      <button
        className={`transition-colors ${
          isEditDeleteDisabled ? disabledStyle : "text-gray-600 hover:text-red-600"
        }`}
        onClick={() => !isEditDeleteDisabled && onDelete()}
        disabled={isEditDeleteDisabled}
        title="Delete"
      >
        <Trash size={18} />
      </button>
    </div>
  );
}