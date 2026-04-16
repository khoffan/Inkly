import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./useAuthStore";

const API = import.meta.env.VITE_BASE_API_URI;

const useCommentStore = create((set, get) => ({
	comments: [],
	isLoading: false,
	error: null,

	fetchComments: async (blogId) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API}/api/comments/${blogId}`);
			// the backend returns { commentsData: [...] }
			set({ comments: response.data.commentsData || [], isLoading: false });
		} catch (error) {
			console.error("Failed to fetch comments:", error);
			set({ comments: [], isLoading: false, error: "Failed to fetch comments" });
		}
	},

	addComment: async (blogId, text) => {
		set({ isLoading: true, error: null });
		try {
			// Get current user from auth store
			const authState = useAuthStore.getState();
			const user = authState.user;
			
			if (!user) {
				set({ isLoading: false, error: "User not authenticated" });
				return { success: false, message: "Please login to comment" };
			}

			const headers = {
				"Content-Type": "application/json",
				...authState.getAuthHeaders(),
			};

			const commentData = {
				userid: user.authid || user._id, // use the correct id field for your backend
				blogid: blogId,
				comment: text
			};

			const response = await axios.post(`${API}/api/comment`, commentData, {
				headers,
			});

			if (response.status === 201 || response.status === 200) {
				// Optionally add the returned comment to the state immediately for optimistic UI
				if(response.data.comment) {
					set((state) => ({
						comments: [response.data.comment, ...state.comments],
						isLoading: false
					}));
				} else {
					// Fallback to refetching
					set({ isLoading: false });
					get().fetchComments(blogId);
				}
				
				return { success: true, message: "Comment added successfully" };
			}
			set({ isLoading: false });
			return { success: false, message: "Failed to add comment" };
		} catch (error) {
			console.error("Failed to add comment:", error);
			set({ isLoading: false, error: "Failed to add comment" });
			return { success: false, message: "Failed to add comment" };
		}
	},
	
	reset: () => set({ comments: [], error: null })
}));

export default useCommentStore;
