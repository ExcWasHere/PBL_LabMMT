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
      isLike: false,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setCommentText("");
    setUserName("");
    setUserRating(0);
  };

  const addReply = (commentId: number, text: string) => {
  setComments((prevComments) => 
    prevComments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: Date.now(), // ID unik sederhana
              user: userName || "Guest", // Menggunakan nama dari input utama
              avatar: "https://i.pravatar.cc/150?img=12", // Placeholder avatar
              time: "Just now",
              text: text,
              likes: 0,
            },
          ],
        };
      }
      return comment;
    })
  );
};

const toggleLike = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          // Cek status saat ini
          const currentlyLiked = comment.isLike || false; 

          return { 
            ...comment, 
            // Jika sudah like, kurangi 1. Jika belum, tambah 1.
            likes: currentlyLiked ? comment.likes - 1 : comment.likes + 1,
            // Balik status isLiked (true jadi false, false jadi true)
            isLike: !currentlyLiked 
          };
        }
        return comment;
      })
    );
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
    userReviewsCount,
    addReply,
    toggleLike
  };
}