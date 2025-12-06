import { Link as LinkIcon, Image as ImageIcon, ThumbsUp, MessageCircle, X } from "lucide-react";
import { StarRating } from "./starRating";
import type { Comment } from "../types";
import { useState } from "react";

interface CommentSectionProps {
  comments: Comment[];
  userName: string;
  setUserName: (val: string) => void;
  commentText: string;
  setCommentText: (val: string) => void;
  userRating: number;
  setUserRating: (val: number) => void;
  onSubmit: () => void;
  onReply: (commentId: number, text: string) => void;
  onLike: (commentId: number) => void;
  reviewCount: number;
}

export function CommentSection({
  comments,
  userName,
  setUserName,
  commentText,
  setCommentText,
  userRating,
  setUserRating,
  onSubmit,
  onReply,
  onLike,
  reviewCount,
}: CommentSectionProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyTextContent, setReplyTextContent] = useState("");

  const handleReplySubmit = (commentId: number) => {
    if (!replyTextContent.trim()) return;
    onReply(commentId, replyTextContent);
    setActiveReplyId(null);
    setReplyTextContent("");
  };

  return (
    <section id="comments" className="max-w-6xl mx-auto px-[1px]">
      <div className="bg-gray-50 py-6 px-4 rounded-xl border border-gray-200 mb-10 shadow-sm">
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />

        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500">
            Your Rating:
          </span>
          <StarRating
            rating={userRating}
            interactive={true}
            hoverRating={hoverRating}
            onRate={setUserRating}
            onHover={setHoverRating}
            size={24}
          />
          <span className="text-sm text-orange-500 font-medium ml-2">
            {userRating > 0 ? `${userRating}.0` : ""}
          </span>
        </div>

        <textarea
          value={commentText}
          rows={4}
          placeholder="Write a review..."
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />

        <div className="flex justify-end items-center mt-3">
          <button
            onClick={onSubmit}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md"
          >
            Submit
          </button>
        </div>
      </div>

      {/* List Comments */}
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
        Reviews{" "}
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
          {reviewCount}
        </span>
      </h3>

      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex gap-4">
              <img
                src={comment.avatar}
                alt={comment.user}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{comment.user}</span>
                  {comment.rating && (
                    <div className="flex items-center bg-orange-50 px-2 rounded border border-orange-100">
                      <span className="text-xs font-bold text-orange-600 mr-1">
                        {comment.rating}.0
                      </span>
                      <StarRating rating={comment.rating} size={10} />
                    </div>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    {comment.time}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{comment.text}</p>
                
                {/* --- ACTION BUTTONS (LIKE & REPLY) --- */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onLike(comment.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      comment.isLike 
                        ? "text-orange-500 font-bold"   // Style jika SUDAH like
                        : "text-gray-400 hover:text-orange-500" // Style jika BELUM like
                    }`}
                  >
                    {/* Opsional: Tambahkan fill={comment.isLiked ? "currentColor" : "none"} agar ikonnya penuh warna */}
                    <ThumbsUp 
                        size={16} 
                        fill={comment.isLike ? "currentColor" : "none"} 
                    />
                    ({comment.likes})
                  </button>
                  
                  <button 
                    onClick={() => {
                        // Toggle Reply Form
                        if (activeReplyId === comment.id) {
                            setActiveReplyId(null);
                        } else {
                            setActiveReplyId(comment.id);
                            setReplyTextContent(""); // Reset text saat buka baru
                        }
                    }}
                    className={`flex items-center gap-1 text-sm transition-colors ${activeReplyId === comment.id ? "text-orange-500 font-medium" : "text-gray-400 hover:text-orange-500"}`}
                  >
                    <MessageCircle size={16} /> Reply
                  </button>
                </div>

                {/* --- FORM REPLY INPUT (Muncul jika tombol reply diklik) --- */}
                {activeReplyId === comment.id && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                                You
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={replyTextContent}
                                    onChange={(e) => setReplyTextContent(e.target.value)}
                                    placeholder={`Reply to ${comment.user}...`}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none min-h-[80px]"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button 
                                        onClick={() => setActiveReplyId(null)}
                                        className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1.5"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => handleReplySubmit(comment.id)}
                                        className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-orange-600 transition"
                                    >
                                        Send Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* --- LIST REPLIES (Recursive / Nested) --- */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-4 flex flex-col gap-4 relative">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex gap-4 ml-10 relative bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div className="absolute -left-6 -top-6 w-6 h-12 border-l-2 border-b-2 border-gray-200 rounded-bl-2xl"></div>

                    <div className="relative z-10 flex-shrink-0">
                      <img
                        src={reply.avatar}
                        alt={reply.user}
                        className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900 flex items-center gap-1 text-sm">
                          {reply.user}
                          {reply.user.toLowerCase().includes("atmin") && (
                            <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">
                              Owner
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {reply.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {reply.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
