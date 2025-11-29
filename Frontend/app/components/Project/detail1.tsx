import { useState, useRef, useEffect } from "react";
import { projects } from "~/components/Project/dataProjects";
import Card from "../../common/card";
import { Link } from "react-router-dom";
import {
  Link as LinkIcon,
  Image as ImageIcon,
  ThumbsUp,
  Star,
} from "lucide-react";

type CarouselElement = HTMLDivElement | null;

export function Detail1() {
  // TEAM
  const team = [
    { name: "Roby", role: "Designer", img: "/proyek/12.avif" },
    { name: "Rudi", role: "Developer", img: "/proyek/12.avif" },
    { name: "Redi", role: "Consumption", img: "/proyek/12.avif" },
  ];

  // CAROUSEL GAMBAR
  const projectImages = [
    "/proyek/images.jpg",
    "/proyek/test2.jpg",
    "/proyek/images.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === projectImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide(); 
    }
    if (touchStart - touchEnd < -75) {
      prevSlide(); 
    }
  };

  // KOMEN
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Mas Ganteng",
      avatar: "/proyek/12.avif",
      time: "58 minutes ago",
      text: "wow keren",
      rating: 5,
      likes: 25,
      replies: [
        {
          id: 2,
          user: "Mbak atmin",
          avatar: "/proyek/images.png",
          time: "8 minutes ago",
          text: "makasih mas",
          likes: 2,
        },
      ],
    },
    {
      id: 3,
      user: "abc",
      avatar: "/proyek/12.avif",
      time: "2 hours ago",
      text: "Lumayan lah.",
      rating: 4,
      likes: 2,
      replies: [],
    },
  ]);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const totalRating = comments
    .filter((c) => c.rating)
    .reduce((acc, curr) => acc + curr.rating, 0);
  const userReviewsCount = comments.filter((c) => c.rating).length;
  const averageRating =
    userReviewsCount > 0 ? (totalRating / userReviewsCount).toFixed(1) : 0;

  const projectDetails = [
    { label: "Type", value: "Game" },
    { label: "Date", value: "23 November 2025" },
    { label: "Tech", value: "Unity, Blender" },
    { label: "Rating", value: averageRating },
  ];

  const recommendations = projects
    .filter((p) => p.title !== "Project A")
    .slice(0, 3);

  const handleSubmitComment = () => {
    if (!userName.trim()) {
      alert("Please enter your name!");
      return;
    }
    if (!commentText.trim()) {
      alert("Please write a review!");
      return;
    }

    if (userRating === 0) {
      alert("Please give a rating!");
      return;
    }

    const newComment = {
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

  const renderStars = (ratingVal: number | string) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= Math.round(Number(ratingVal))
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 pt-20">
      <div
        className="fixed top-0 left-0 right-0 h-20 z-40 
          bg-gradient-to-b from-black/70 to-transparent pointer-events-none"
      ></div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-gray-100 group">
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {projectImages.map((src, i) => (
                <div key={i} className="min-w-full h-full">
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt={`Project preview ${i + 1}`}
                  />
                </div>
              ))}
            </div>

            <div
              onClick={prevSlide}
              className="absolute top-0 left-0 w-1/2 h-full z-10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Previous Image"
            >
              <div className="w-full h-full bg-gradient-to-r from-black/10 to-transparent"></div>
            </div>

            <div
              onClick={nextSlide}
              className="absolute top-0 right-0 w-1/2 h-full z-10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Next Image"
            >
              <div className="w-full h-full bg-gradient-to-l from-black/10 to-transparent"></div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {projectImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    goToImage(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                    i === currentIndex
                      ? "bg-white w-6" 
                      : "bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Project A</h1>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco. Sed ut
              perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Project Details
              </h3>
              <div className="space-y-3">
                {projectDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex flex-col sm:flex-row sm:justify-between"
                  >
                    <span className="font-semibold text-gray-800">
                      {detail.label}
                    </span>
                    <span className="text-gray-600 text-left sm:text-right flex items-center gap-2 sm:justify-end">
                      {detail.label === "Rating" ? (
                        <>
                          <span className="font-bold text-yellow-500 text-lg">
                            {detail.value}
                          </span>
                          <div className="flex pb-1">
                            {renderStars(detail.value)}
                          </div>
                          <span className="text-xs text-gray-400">
                            ({userReviewsCount} reviews)
                          </span>
                        </>
                      ) : (
                        detail.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TEAM */}
        <hr className="my-12 border-gray-200" />

        <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
        <div className="flex flex-wrap gap-2">
          {team.map((t, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden shadow-md group w-[225px]"
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-56 h-70 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-sm text-gray-200">{t.role}</p>
                <div className="mt-2 flex gap-3 text-white text-lg">
                  <i className="ri-mail-line cursor-pointer hover:text-orange-400"></i>
                  <i className="ri-linkedin-box-line cursor-pointer hover:text-orange-400"></i>
                  <i className="ri-github-line cursor-pointer hover:text-orange-400"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-12 border-gray-200" />

        <section id="recommendations">
          <h2 className="text-2xl font-semibold mb-6">Other Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recommendations.map((project, i) =>
              project.title === "Project A" ? (
                <Link to="/detail-project" key={i}>
                  <Card {...project} />
                </Link>
              ) : (
                <Card key={i} {...project} />
              )
            )}
          </div>
        </section>

        <hr className="my-12 border-gray-200" />

        <section id="comments" className="max-w-6xl mx-auto px-[1px]">
          <div className="bg-gray-50 py-6 px-4 rounded-xl border border-gray-200 mb-10 shadow-sm">
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              aria-label="Your Name for Review"
            />
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">
                Your Rating:
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110 px-0.5"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= (hoverRating || userRating)
                          ? "fill-orange-400 text-orange-400"
                          : "fill-transparent text-gray-300"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-orange-500 font-medium ml-2">
                {userRating > 0 ? `${userRating}.0` : ""}
              </span>
            </div>

            <textarea
              value={commentText}
              rows={4}
              placeholder="Write a review..."
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              onInput={(e) => {
                const target = e.target;
                if (target instanceof HTMLTextAreaElement) {
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                  setCommentText(target.value);
                }
              }}
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
                onClick={handleSubmitComment}
                className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Reviews
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {userReviewsCount}
              </span>
            </h3>
          </div>

          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex gap-4">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-lg">
                          {comment.user}
                        </span>

                        {comment.rating && (
                          <div className="flex items-center bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                            <span className="text-xs font-bold text-orange-600 mr-1">
                              {comment.rating}.0
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={10}
                                  className={
                                    s <= comment.rating
                                      ? "fill-orange-400 text-orange-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <span className="text-xs text-gray-400">
                        {comment.time}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed text-[15px] break-all">
                      {comment.text}
                    </p>

                    <div className="flex items-center gap-6 text-gray-400 text-sm font-medium">
                      <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                        <ThumbsUp size={16} />({comment.likes})
                      </button>
                    </div>
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
                              <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">
                                Owner
                              </span>
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
      </main>
    </div>
  );
}
