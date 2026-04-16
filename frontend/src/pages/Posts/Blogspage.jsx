import { useEffect } from "react";

import Sidebar from "../../components/Sidebar";
import Blog from "../../components/BlogComponents/Blog";
import useBlogStore from "../../store/useBlogStore";
import useAuthStore from "../../store/useAuthStore";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Blogspage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, fetchUserBlogs, isLoading } = useBlogStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchUserBlogs(id);
    }
  }, [id]);

  const blogDetail = (blogId) => {
    navigate(`/blog/detail/${blogId}`);
  };

  // Determine if the viewed blogs belong to the currently logged in user
  const isOwnProfile = user && (user._id === id || user.authid === id);

  const handleEdit = (blogId) => {
    navigate(`/update-blog/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      await useBlogStore.getState().deleteBlog(blogId);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inkly - {isOwnProfile ? "Your stories" : "Stories"}</title>
        <meta name="description" content="Stories" />
        <meta name="keywords" content="stories, blog, stories" />
      </Helmet>
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <main className="max-w-[1240px] mx-auto px-4 md:px-6 pt-6 md:pt-10 pb-20 w-full flex-grow">
          <div className="flex flex-col xl:flex-row gap-12 w-full">
            {/* Main Feed */}
            <div className="flex-1 w-full">
              <div className="pb-8 border-b border-gray-100 mb-8 mt-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 font-serif">
                  {isOwnProfile ? "Your stories" : "Stories"}
                </h1>
                <div className="flex gap-4 md:gap-6 mt-6 border-b border-gray-100 overflow-x-auto whitespace-nowrap hide-scrollbar">
                  <button className="text-sm font-medium text-black border-b-2 border-black pb-3 min-w-[70px] text-center min-h-[44px]">
                    Published
                  </button>
                  <button className="text-sm font-medium text-gray-500 pb-3 hover:text-black min-w-[50px] text-center min-h-[44px]">
                    Drafts
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : blogs && blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 list-none">
                  {blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="w-full text-left group hover:bg-gray-50 transition-colors border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer flex flex-col h-full"
                      onClick={() => blogDetail(blog._id)}
                    >
                      <Blog
                        index={blog._id}
                        name={blog.author.name}
                        title={blog.title}
                        content={blog.description}
                        creatDate={blog.createdAt}
                        imageUrl={blog.author.image}
                        tags={blog.tag}
                        isUser={isOwnProfile}
                        thumbnail={blog.blog_image?.[0]?.image_path}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-500 text-lg font-serif">
                    {isOwnProfile
                      ? "You haven't published any stories yet."
                      : "This author hasn't published any stories yet."}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate(`/create-blog/${user?.authid}`)}
                      className="mt-6 px-6 py-2 border border-black rounded-full text-black hover:bg-black hover:text-white transition-colors text-sm font-medium"
                    >
                      Write a story
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Component placed on the right */}
            <div className="hidden lg:block w-[320px] sticky top-24 h-fit border-l border-gray-100 pl-10">
              <Sidebar />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
