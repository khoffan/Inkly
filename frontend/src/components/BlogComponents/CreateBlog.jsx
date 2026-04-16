import React, { useState, useEffect, useRef } from "react";
import ParagraphField from "./ParagraphField";
import TagField from "./TagField";
import useBlogStore from "../../store/useBlogStore";
import useAuthStore from "../../store/useAuthStore";
import useTagStore from "../../store/useTagStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { createBlog, uploadBlogImage, saveDraftToCloud, fetchCloudDraft, isLoading } = useBlogStore();
  const { user } = useAuthStore();
  const { allTags, fetchUniqueTags, createTag } = useTagStore();

  const [paragraphs, setParagraphs] = useState([{ type: "text", content: "" }]);
  const [blogImage, setBlogImage] = useState([]); // {id, image_path}
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTextnavigate, setIsTextnavigate] = useState([false]);
  const [tags, setTags] = useState([]);
  
  const [saveStatus, setSaveStatus] = useState("Saved to cloud ☁️");
  const hasChanges = useRef(false);
  const paragraphRef = useRef([]);

  useEffect(() => {
    fetchUniqueTags();
  }, [fetchUniqueTags]);

  useEffect(() => {
    if (!user) return;
    
    // Load draft from cloud, fallback to empty state
    const loadDraft = async () => {
      const draft = await fetchCloudDraft();
      if (draft) {
        setParagraphs(draft.content?.length > 0 ? draft.content : [{ type: "text", content: "" }]);
        setBlogImage(draft.images?.map(img => ({ id: img.imageId, image_path: img.imagePath })) || []);
        setTags(draft.tag?.map(t => t.tagname) || []);
      }
    };
    loadDraft();
  }, [user, fetchCloudDraft]);

  // Auto-save interval (30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChanges.current && user) {
        performSave(paragraphs, blogImage, tags);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [paragraphs, blogImage, tags, user]);

  const performSave = async (p, bi, t) => {
    setSaveStatus("Saving...");
    const draftData = {
      paragraphs: p,
      blogImage: bi,
      tags: t,
      author: user.authid,
      title: p[0]?.content || "Untitled Draft",
      description: p.length > 1 && p[1].type === "text" ? p[1].content.substring(0, 150) : ""
    };
    
    const success = await saveDraftToCloud(draftData);
    if (success) {
      setSaveStatus("Saved to cloud ☁️");
      hasChanges.current = false;
    } else {
      setSaveStatus("Failed to save draft");
    }
  };

  const markChanged = () => {
    hasChanges.current = true;
    if (saveStatus !== "Unsaved changes") {
      setSaveStatus("Unsaved changes");
    }
  };

  const handleTagsChange = (newTags) => {
    setTags(newTags);
    markChanged();
  };

  const clearDraft = () => {
    // Cloud drafts are automatically deleted by the backend on publish
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
    markChanged();
  };

  const handleKeydown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newParagraph = [...paragraphs];
      newParagraph.splice(index + 1, 0, { type: "text", content: "" });
      setParagraphs(newParagraph);
      markChanged();

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
      markChanged();

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
      markChanged();

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
    markChanged();
  };

  const handleUploadBlog = async () => {
    if (paragraphs.length === 0 || !paragraphs[0].content) {
      Swal.fire("Error", "Title cannot be empty.", "error");
      return;
    }

    if (!user) {
      Swal.fire("Error", "You must be logged in to publish.", "error");
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

    const result = await createBlog(blogData);
    if (result.success) {
      // Persist each tag to the Tags collection via store
      const blogId = result.blog?._id;
      if (blogId && tags.length > 0) {
        await Promise.all(tags.map((tagname) => createTag(blogId, tagname)));
      }

      clearDraft();
      Swal.fire("Published!", "Your story is live.", "success").then(() => {
        navigate("/");
      });
    } else {
      Swal.fire("Error", "Failed to publish story.", "error");
    }
  };

  return (
    <>
      <Helmet>
        <title>Inkly - Create New Blog</title>
        <meta name="description" content="Inkly Create a new blog post" />
        <meta name="keywords" content="blog, create blog, new blog" />
      </Helmet>
      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Publish Header */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-sans">Draft</span>
            <span className={`text-sm font-medium ${saveStatus.includes("Unsaved") ? "text-amber-500" : saveStatus.includes("cloud") ? "text-green-500" : "text-gray-500"}`}>
              {saveStatus}
            </span>
          </div>
          <button
            onClick={handleUploadBlog}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50 shadow-sm"
          >
            {isLoading ? "Publishing..." : "Publish"}
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
    </>
  );
}
