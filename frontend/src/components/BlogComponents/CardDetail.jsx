import { useEffect, useState, memo, useCallback } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import useBlogStore from "../../store/useBlogStore";
import useAuthStore from "../../store/useAuthStore";
import useCommentStore from "../../store/useCommentStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import {
  faHeart,
  faComment,
  faShareSquare,
} from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet-async";
import SkeletonDetail from "./SkeletonDetail";

const API = import.meta.env.VITE_BASE_API_URI;

// ─── Reading Time Utility ───
function calcReadingTime(content) {
  if (!content || !Array.isArray(content)) return "1 min read";
  const text = content
    .filter((item) => item.type === "text")
    .map((item) => item.content || "")
    .join(" ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

// ─── Isolated ActionBar (memo'd to prevent prose re-render) ───
const ActionBar = memo(function ActionBar({
  blogId,
  likes,
  commentsCount,
  userId,
}) {
  const toggleLike = useBlogStore((s) => s.toggleLike);
  const [animating, setAnimating] = useState(false);

  const isLiked = userId && likes?.includes(userId);

  const handleLike = useCallback(() => {
    if (!userId) return;
    setAnimating(true);
    toggleLike(blogId);
    // Reset animation after transition completes
    setTimeout(() => setAnimating(false), 300);
  }, [blogId, userId, toggleLike]);

  return (
    <div className="flex items-center justify-between border-y border-gray-100 py-3.5 text-gray-500">
      <div className="flex items-center gap-8">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-2 group transition-colors hover:text-gray-900"
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{
              transform: animating ? "scale(1.35)" : "scale(1)",
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <FontAwesomeIcon
              icon={isLiked ? faHeartSolid : faHeart}
              className={`text-[18px] ${
                isLiked
                  ? "text-red-500"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
              style={{
                transition: "color 0.2s ease",
              }}
            />
          </span>
          <span className="text-sm font-sans tabular-nums">
            {likes?.length || 0}
          </span>
        </button>

        {/* Comment Count */}
        <button className="flex items-center gap-2 transition-colors hover:text-gray-900">
          <FontAwesomeIcon
            icon={faComment}
            className="text-[18px] text-gray-400"
          />
          <span className="text-sm font-sans tabular-nums">
            {commentsCount || 0}
          </span>
        </button>
      </div>

      {/* Share */}
      <div className="flex items-center">
        <button className="p-1.5 rounded-full transition-colors hover:text-gray-900 hover:bg-gray-50">
          <FontAwesomeIcon
            icon={faShareSquare}
            className="text-[18px] text-gray-400"
          />
        </button>
      </div>
    </div>
  );
});

// ─── Main CardDetail Component ───
export default function CardDetail({ id }) {
  const {
    currentBlog,
    fetchBlogById,
    relatedBlogs,
    fetchRelatedBlogs,
    isLoading,
  } = useBlogStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    comments,
    fetchComments,
    addComment,
    isLoading: isCommentLoading,
  } = useCommentStore();

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) {
      fetchBlogById(id);
      fetchComments(id);
      fetchRelatedBlogs(id);
    }
  }, [id]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const res = await addComment(id, commentText);
    if (res.success) {
      setCommentText("");
    }
  };

  if (isLoading || !currentBlog) {
    return <SkeletonDetail />;
  }

  const commentsCount = comments?.length || currentBlog.comments?.length || 0;

  return (
    <>
      <Helmet>
        <title>Inkly - {currentBlog.title}</title>
        <meta name="description" content={currentBlog.description} />
        <meta
          name="keywords"
          content={currentBlog.tag.map((tag) => tag.tagname)}
        />
      </Helmet>
      <article className="max-w-[720px] mx-auto px-6 py-12 font-serif text-gray-800">
        {/* Author Meta Block */}
        <div className="flex items-center gap-4 mb-8">
          <img
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
            src={
              currentBlog.author?.image
                ? `${API}/${currentBlog.author.image}`
                : "https://api.dicebear.com/7.x/initials/svg?seed=" +
                  (currentBlog.author?.name || "U")
            }
            alt={currentBlog.author?.name}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium font-sans text-gray-900">
                {currentBlog.author?.name}
              </span>
              <button className="text-green-600 font-sans text-[13px] font-medium hover:text-green-700">
                Follow
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-sans">
              <span>{calcReadingTime(currentBlog.content)}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>
                {currentBlog.createdAt
                  ? format(new Date(currentBlog.createdAt), "MMM d, yyyy")
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-[42px] font-bold leading-tight mb-8 text-gray-900 tracking-tight">
          {currentBlog.title}
        </h1>

        {/* Main Content — Prose (heavy, won't re-render on like) */}
        <div className="prose prose-lg prose-gray max-w-none font-serif text-[20px] leading-relaxed tracking-normal text-gray-800">
          {currentBlog.content?.map((item, index) => {
            if (item.type === "text" && index > 0) {
              return (
                <p key={index} className="mb-8 font-serif">
                  {item.content}
                </p>
              );
            }
            return null;
          })}

          {/* Render Images */}
          {currentBlog.blog_image?.map((img, index) => (
            <figure key={index} className="my-12">
              <img
                src={`${API}/${img.image_path}`}
                alt="Blog Illustration"
                className="w-full h-auto rounded-sm"
              />
              <figcaption className="text-center text-sm text-gray-500 mt-3 font-sans">
                Image source or caption
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Tags */}
        {currentBlog.tag?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-12 mb-8 font-sans">
            {currentBlog.tag.map((t, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
              >
                {t.tagname}
              </span>
            ))}
          </div>
        )}

        {/* Action Bar (Bottom) — Same isolated component, minimalist spacing */}
        <div className="mt-10 mb-6">
          <ActionBar
            blogId={id}
            likes={currentBlog.likes}
            commentsCount={commentsCount}
            userId={user?.authid}
          />
        </div>

        {/* Comment Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold font-sans mb-6">
            Responses ({comments?.length || 0})
          </h3>

          {/* Comment Input */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      user.image
                        ? `${API}/${user.image}`
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name || "User"}`
                    }
                    className="w-8 h-8 rounded-full"
                    alt="User avatar"
                  />
                  <span className="font-sans font-medium text-sm">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full resize-none outline-none font-sans text-gray-800 min-h-[80px]"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handlePostComment}
                    disabled={isCommentLoading || !commentText.trim()}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-full font-sans text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isCommentLoading ? "Posting..." : "Respond"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="font-sans text-gray-600 mb-2">
                  What are your thoughts?
                </p>
                <p className="font-sans text-sm text-gray-500">
                  Sign in to leave a comment.
                </p>
              </div>
            )}
          </div>

          {/* Comment List */}
          <div className="flex flex-col gap-6">
            {comments && comments.length > 0 ? (
              comments.map((comment, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userid}`}
                      className="w-10 h-10 rounded-full"
                      alt="User avatar"
                    />
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-sm">
                        User {comment.userid.substring(0, 6)}{" "}
                      </span>
                      <span className="font-sans text-xs text-gray-500">
                        {comment.createdAt
                          ? format(new Date(comment.createdAt), "MMM d, yyyy")
                          : ""}
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-gray-800 whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="font-sans text-gray-500 text-center py-8">
                No responses yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>

        {/* ─── Related Stories ─── */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h3 className="text-2xl font-bold font-sans mb-8">
              Related Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedBlogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => navigate(`/blog/detail/${blog._id}`)}
                  className="group cursor-pointer rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    {blog.blog_image?.[0]?.image_path ? (
                      <img
                        src={`${API}/${blog.blog_image[0].image_path}`}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <span className="text-gray-300 text-3xl font-serif">
                          ✦
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h4 className="font-serif font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-black mb-2">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                      <span>{blog.author?.name || "Unknown"}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{calcReadingTime(blog.content)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
