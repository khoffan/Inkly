import { useState, useEffect, useMemo } from "react";
import Blog from "./Blog.jsx";
import Sidebar from "../Sidebar.jsx";
import Tagbar from "../Tagbar.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import { useNavigate } from "react-router-dom";
import useBlogStore from "../../store/useBlogStore.js";

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

function Content() {
  const { blogs, isLoading, fetchBlogs, selectedTags, searchQuery } =
    useBlogStore();
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  const handleTagsChild = (data, selected) => {
    const { addSelectedTag, removeSelectedTag } = useBlogStore.getState();
    if (!selected) {
      removeSelectedTag(data);
    } else {
      addSelectedTag(data);
    }
  };

  const getData = async () => {
    setLocalLoading(true);
    await fetchBlogs(searchQuery);
    setTimeout(() => setLocalLoading(false), 500);
  };

  const blogDetail = (id) => {
    navigate(`/blog/detail/${id}`);
  };

  const filteredContent = useMemo(() => {
    if (!selectedTags || selectedTags.length === 0) return blogs;
    return blogs?.filter((blog) => {
      return blog.tag?.some((t) => selectedTags.includes(t.tagname));
    });
  }, [blogs, selectedTags]);

  useEffect(() => {
    getData();
  }, []);

  const showLoading = isLoading || localLoading;

  return (
    <div className="flex flex-col xl:flex-row gap-12 w-full">
      {/* Main Feed */}
      <div className="flex-1 w-full">
        <div className="pb-4 border-b border-gray-100 sticky top-16 bg-white z-10 pt-4 hidden sm:block">
          <Tagbar sendTags={handleTagsChild} />
        </div>

        {showLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredContent?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 list-none mt-4">
            {filteredContent.map((blog) => (
              <div
                key={blog._id}
                className="w-full text-left group hover:bg-gray-50 transition-colors border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer flex flex-col h-full"
                onClick={() => blogDetail(blog._id)}
              >
                <Blog
                  index={blog._id}
                  name={blog.author.name}
                  title={blog.title}
                  content={
                    blog.description ||
                    "No preview available for this story. Click to read more..."
                  }
                  creatDate={blog.createdAt}
                  imageUrl={blog.author.image}
                  tags={blog.tag}
                  isUser={false}
                  readingTime={calcReadingTime(blog.content)}
                  thumbnail={blog.blog_image?.[0]?.image_path}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-lg font-serif">
              We couldn't find any stories matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar Component placed on the right */}
      <div className="hidden xl:block w-[320px] sticky top-24 h-fit border-l border-gray-100 pl-10 shrink-0">
        <Sidebar />
      </div>
    </div>
  );
}

export default Content;
