import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./useAuthStore";

const API = import.meta.env.VITE_BASE_API_URI;

const useBlogStore = create((set, get) => ({
  // State
  blogs: [],
  currentBlog: null,
  relatedBlogs: [],
  isLoading: false,
  searchQuery: "",
  selectedTags: [],
  allTags: [],
  error: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),

  addSelectedTag: (tag) => {
    const { selectedTags } = get();
    if (!selectedTags.includes(tag)) {
      set({ selectedTags: [...selectedTags, tag] });
    }
  },

  removeSelectedTag: (tag) => {
    const { selectedTags } = get();
    set({ selectedTags: selectedTags.filter((t) => t !== tag) });
  },

  fetchBlogs: async (search = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API}/api/blogs`, {
        params: { search },
      });
      set({ blogs: response.data.blogs || [], isLoading: false });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      set({ blogs: [], isLoading: false, error: "Failed to fetch blogs" });
    }
  },

  fetchBlogById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API}/api/blog/${id}`);
      set({ currentBlog: response.data.blog, isLoading: false });
      return response.data.blog;
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      set({ currentBlog: null, isLoading: false });
      return null;
    }
  },

  fetchUserBlogs: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API}/api/blogs/${userId}`);
      const blogs = response.data.message; // backend returns blogs in "message" key
      set({ blogs: Array.isArray(blogs) ? blogs : [], isLoading: false });
      return blogs;
    } catch (error) {
      console.error("Failed to fetch user blogs:", error);
      set({ blogs: [], isLoading: false });
      return [];
    }
  },

  createBlog: async (blogData) => {
    set({ isLoading: true, error: null });
    try {
      const headers = {
        "Content-Type": "application/json",
        ...useAuthStore.getState().getAuthHeaders(),
      };
      const response = await axios.post(`${API}/api/creatBlogs`, blogData, {
        headers,
      });
      if (response.status === 201) {
        set({ isLoading: false });
        return { success: true, blog: response.data.blog };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      console.error("Failed to create blog:", error);
      set({ isLoading: false, error: "Failed to create blog" });
      return { success: false };
    }
  },

  updateBlog: async (id, blogData) => {
    set({ isLoading: true, error: null });
    try {
      const headers = {
        "Content-Type": "application/json",
        ...useAuthStore.getState().getAuthHeaders(),
      };
      const response = await axios.put(
        `${API}/api/updateblog/${id}`,
        blogData,
        {
          headers,
        },
      );
      if (response.status === 200) {
        set({ isLoading: false });
        return { success: true, blog: response.data.blog };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      console.error("Failed to update blog:", error);
      set({ isLoading: false, error: "Failed to update blog" });
      return { success: false };
    }
  },

  createTag: async (blogid, tagname) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...useAuthStore.getState().getAuthHeaders(),
      };
      await axios.post(`${API}/api/tags`, { blogid, tagname }, { headers });
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  },

  deleteBlog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const headers = {
        "Content-Type": "application/json",
        ...useAuthStore.getState().getAuthHeaders(),
      };
      const response = await axios.delete(`${API}/api/deleteblog/${id}`, {
        headers,
      });
      if (response.status === 200) {
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog._id !== id),
          isLoading: false,
        }));
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      console.error("Failed to delete blog:", error);
      set({ isLoading: false, error: "Failed to delete blog" });
      return { success: false };
    }
  },

  toggleLike: async (blogId) => {
    const { currentBlog } = get();
    if (!currentBlog) return;

    const user = useAuthStore.getState().user;
    if (!user?.authid) return;

    // 1. Snapshot สำหรับ rollback
    const snapshot = { ...currentBlog, likes: [...(currentBlog.likes || [])] };

    // 2. Optimistic update — แก้ likes array ทันที
    const isCurrentlyLiked = currentBlog.likes?.includes(user.authid);
    const optimisticLikes = isCurrentlyLiked
      ? currentBlog.likes.filter((uid) => uid !== user.authid)
      : [...(currentBlog.likes || []), user.authid];

    set({
      currentBlog: { ...currentBlog, likes: optimisticLikes },
    });

    // 3. API call
    try {
      const headers = {
        "Content-Type": "application/json",
        ...useAuthStore.getState().getAuthHeaders(),
      };
      const response = await axios.patch(
        `${API}/api/blog/like/${blogId}`,
        {},
        { headers },
      );

      if (response.status === 200 && response.data.blog) {
        // 4. Success — sync ด้วยข้อมูลจาก server
        set({ currentBlog: response.data.blog });
      }
    } catch (error) {
      // 5. Error — rollback กลับสู่ snapshot
      console.error("Failed to toggle like:", error);
      set({ currentBlog: snapshot });
    }
  },

  uploadBlogImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("blog", file);
      const headers = {
        "Content-Type": "multipart/form-data",
        ...useAuthStore.getState().getAuthHeaders(),
      };
      const response = await axios.post(`${API}/api/blog/images`, formData, {
        headers,
      });
      return response.data.file;
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  },

  fetchAllTags: async () => {
    try {
      const response = await axios.get(`${API}/api/tags`);
      const rawTags = response.data.tags?.[0]?.tagname || [];
      set({ allTags: rawTags.map((tag) => ({ tagname: tag })) });
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  },

  fetchRelatedBlogs: async (id) => {
    try {
      const response = await axios.get(`${API}/api/blogs/related/${id}`);
      set({ relatedBlogs: response.data.blogs || [] });
    } catch (error) {
      console.error("Failed to fetch related blogs:", error);
      set({ relatedBlogs: [] });
    }
  },

  saveDraftToCloud: async (draftData) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...useAuthStore.getState().getAuthHeaders(),
      };
      await axios.post(`${API}/api/blog/draft`, draftData, { headers });
      return true;
    } catch (error) {
      console.error("Failed to save draft to cloud:", error);
      return false;
    }
  },

  fetchCloudDraft: async () => {
    try {
      const headers = {
        ...useAuthStore.getState().getAuthHeaders(),
      };
      const response = await axios.get(`${API}/api/blog/draft`, { headers });
      return response.data.draft || null;
    } catch (error) {
      console.error("Failed to fetch cloud draft:", error);
      return null;
    }
  },

  // Reset
  reset: () =>
    set({
      blogs: [],
      currentBlog: null,
      relatedBlogs: [],
      searchQuery: "",
      selectedTags: [],
      error: null,
    }),
}));

export default useBlogStore;
