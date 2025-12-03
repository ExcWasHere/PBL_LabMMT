import { Link as LinkIcon, Image as ImageIcon, ThumbsUp } from "lucide-react";
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
  reviewCount,
}: CommentSectionProps) {
  const [hoverRating, setHoverRating] = useState(0);

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

        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-4 text-gray-400">
            <LinkIcon
              size={20}
              className="cursor-pointer hover:text-gray-600"
            />
            <ImageIcon
              size={20}
              className="cursor-pointer hover:text-gray-600"
            />
          </div>
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
            {/* ... Render User Info, Avatar, Rating ... */}
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
                <button className="flex items-center gap-1 text-gray-400 hover:text-orange-500 text-sm">
                  <ThumbsUp size={16} />({comment.likes})
                </button>
              </div>
            </div>
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
