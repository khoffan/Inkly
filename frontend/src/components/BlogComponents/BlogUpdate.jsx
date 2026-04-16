import { useState, useEffect, useRef } from "react";
import ParagraphField from "./ParagraphField";
import TagField from "./TagField";
import useBlogStore from "../../store/useBlogStore";
import useAuthStore from "../../store/useAuthStore";
import useTagStore from "../../store/useTagStore";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

export default function BlogUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlog, fetchBlogById, updateBlog, uploadBlogImage, isLoading } =
    useBlogStore();
  const { user } = useAuthStore();
  const { allTags, fetchUniqueTags, createTag } = useTagStore();

  const [paragraphs, setParagraphs] = useState([{ type: "text", content: "" }]);
  const [blogImage, setBlogImage] = useState([]); // {id, image_path}
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTextnavigate, setIsTextnavigate] = useState([false]);

  const [tags, setTags] = useState([]);
  const paragraphRef = useRef([]);

  // Initial fetch
  useEffect(() => {
    fetchUniqueTags();
    if (id) {
      fetchBlogById(id);
    }
  }, [id]);

  // Initialize form when currentBlog changes
  useEffect(() => {
    if (currentBlog && currentBlog._id === id) {
      if (currentBlog.content && currentBlog.content.length > 0) {
        setParagraphs(currentBlog.content);
        setIsTextnavigate(Array(currentBlog.content.length).fill(false));
      } else {
        setParagraphs([
          { type: "text", content: currentBlog.title },
          { type: "text", content: currentBlog.description },
        ]);
        setIsTextnavigate([false, false]);
      }

      if (currentBlog.images) {
        const mappedImages = currentBlog.images.map((img) => ({
          id: img.imageId,
          image_path: img.imagePath,
        }));
        setBlogImage(mappedImages);
      }

      if (currentBlog.tag) {
        const mappedTags = currentBlog.tag.map((t) => t.tagname);
        setTags(mappedTags);
      }
    }
  }, [currentBlog, id]);

  const handleTagsChange = (newTags) => {
    setTags(newTags);
  };

  const handleFocus = (index) => {
    setActiveIndex(index);
    const newNavState = Array(paragraphs.length).fill(false);
    setIsTextnavigate(newNavState);
  };

  const handleContent = (event, index) => {
    const newParagraph = [...paragraphs];
    newParagraph[index].content = event.target.value;
    setParagraphs(newParagraph);

    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleKeydown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newParagraph = [...paragraphs];
      newParagraph.splice(index + 1, 0, { type: "text", content: "" });
      setParagraphs(newParagraph);

      setTimeout(() => {
        if (paragraphRef.current[index + 1]) {
          paragraphRef.current[index + 1].focus();
        }
      }, 0);
    } else if (
      event.key === "Backspace" &&
      paragraphs[index].content === "" &&
      paragraphs.length > 1
    ) {
      event.preventDefault();
      const newParagraph = [...paragraphs];
      newParagraph.splice(index, 1);
      setParagraphs(newParagraph);

      setTimeout(() => {
        if (paragraphRef.current[index - 1]) {
          paragraphRef.current[index - 1].focus();
          setActiveIndex(index - 1);
        }
      }, 0);
    }
  };

  const handleNavatebutton = (index) => {
    const newNavState = [...isTextnavigate];
    newNavState[index] = !newNavState[index];
    setIsTextnavigate(newNavState);
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedPath = await uploadBlogImage(file);
    if (uploadedPath) {
      const newId = `image-${Date.now()}`;
      const newBlogImages = [
        ...blogImage,
        { id: newId, image_path: uploadedPath },
      ];
      setBlogImage(newBlogImages);

      const newParagraph = [...paragraphs];
      newParagraph[index] = { type: "image", content: newId };
      newParagraph.splice(index + 1, 0, { type: "text", content: "" });
      setParagraphs(newParagraph);

      const newNavState = Array(newParagraph.length).fill(false);
      setIsTextnavigate(newNavState);

      setTimeout(() => {
        if (paragraphRef.current[index + 1]) {
          paragraphRef.current[index + 1].focus();
        }
      }, 0);
    }
  };

  const handleDeleteImage = (index) => {
    const newParagraph = [...paragraphs];
    const imageId = newParagraph[index].content;
    newParagraph.splice(index, 1);

    const newBlogImages = blogImage.filter((img) => img.id !== imageId);

    if (newParagraph.length === 0) {
      newParagraph.push({ type: "text", content: "" });
    }

    setParagraphs(newParagraph);
    setBlogImage(newBlogImages);
  };

  const handleUpdateBlog = async () => {
    if (paragraphs.length === 0 || !paragraphs[0].content) {
      Swal.fire("Error", "Title cannot be empty.", "error");
      return;
    }

    if (!user) {
      Swal.fire("Error", "You must be logged in to update.", "error");
      return;
    }

    const title = paragraphs[0].content;
    const description =
      paragraphs.length > 1 && paragraphs[1].type === "text"
        ? paragraphs[1].content.substring(0, 150) + "..."
        : "";

    const blogData = {
      title,
      description,
      tags,
      paragraphs,
      blogImage,
      author: user.authid,
    };

    const result = await updateBlog(id, blogData);
    if (result.success) {
      if (tags.length > 0) {
        await Promise.all(tags.map((tagname) => createTag(id, tagname)));
      }

      Swal.fire("Updated!", "Your story has been updated.", "success").then(
        () => {
          navigate(`/blog/${user.authid}`);
        },
      );
    } else {
      Swal.fire("Error", "Failed to update story.", "error");
    }
  };

  if (isLoading && !currentBlog) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Inkly - Update Story</title>
        <meta name="description" content="Inkly Update Story" />
        <meta name="keywords" content="update story, blog, update story" />
      </Helmet>
      <div className="w-full flex-grow flex flex-col bg-white">
        <div className="max-w-[800px] mx-auto px-6 py-12 w-full">
          {/* Publish Header */}
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-sans">Editing Mode</span>
              <span className="text-sm font-medium text-gray-500">Live</span>
            </div>
            <button
              onClick={handleUpdateBlog}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50 shadow-sm"
            >
              {isLoading ? "Updating..." : "Update Story"}
            </button>
          </div>

          {/* Main Editor Area */}
          <div className="w-full">
            <ParagraphField
              paragraphs={paragraphs}
              handleContent={handleContent}
              activeIndex={activeIndex}
              paragraphRef={paragraphRef}
              handleKeydown={handleKeydown}
              handleFocus={handleFocus}
              isTextnavigate={isTextnavigate}
              handleNavatebutton={handleNavatebutton}
              handleFileUpload={handleFileUpload}
              handleDeleteImage={handleDeleteImage}
              blogImage={blogImage}
            />

            {/* Tag Editor */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <TagField
                selectedTags={tags}
                onTagsChange={handleTagsChange}
                allTags={allTags}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
