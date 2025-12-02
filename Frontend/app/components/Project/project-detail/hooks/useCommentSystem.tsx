import { useState, useMemo } from "react";
import type { Comment } from "../types";
import { dummy_comment } from "../data/mockData";

export function useCommentSystem() {
  const [comments, setComments] = useState<Comment[]>(dummy_comment);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);

  // Derived State (Calculations)
  const userReviewsCount = useMemo(() => comments.filter((c) => c.rating).length, [comments]);
  
  const averageRating = useMemo(() => {
    const total = comments.filter((c) => c.rating).reduce((acc, curr) => acc + curr.rating, 0);
    return userReviewsCount > 0 ? (total / userReviewsCount).toFixed(1) : "0";
  }, [comments, userReviewsCount]);

  const addComment = () => {
    if (!userName.trim() || !commentText.trim() || userRating === 0) {
      alert("Please fill all fields (Name, Review, Rating)!");
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      user: userName.trim(),
      avatar: "/proyek/12.avif",
      time: "Just now",
      rating: userRating,
      text: commentText,
      likes: 0,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setCommentText("");
    setUserName("");
    setUserRating(0);
  };

  return {
    comments,
    userName,
    setUserName,
    commentText,
    setCommentText,
    userRating,
    setUserRating,
    addComment,
    averageRating,
    userReviewsCount
  };
}