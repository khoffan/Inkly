import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./useAuthStore";

const API = import.meta.env.VITE_BASE_API_URI;

const useTagStore = create((set, get) => ({
	// State
	allTags: [],       // unique tag names (strings)
	isLoading: false,
	error: null,

	// Fetch unique tag names for dropdown suggestions
	fetchUniqueTags: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API}/api/tags/unique`);
			set({ allTags: response.data.tags || [], isLoading: false });
		} catch (error) {
			console.error("Failed to fetch unique tags:", error);
			set({ isLoading: false, error: "Failed to fetch tags" });
		}
	},

	// Create a tag for a blog and add to local store (optimistic)
	createTag: async (blogid, tagname) => {
		try {
			const headers = {
				"Content-Type": "application/json",
				...useAuthStore.getState().getAuthHeaders(),
			};
			const response = await axios.post(
				`${API}/api/tags`,
				{ blogid, tagname },
				{ headers }
			);
			console.log("Tag created successfully", response.data);
			// Add to allTags if new
			const { allTags } = get();
			if (!allTags.includes(tagname)) {
				set({ allTags: [...allTags, tagname].sort() });
			}

			return { success: true, tag: response.data.tag };
		} catch (error) {
			if (error.response?.status === 409) {
				return { success: false, message: "Tag already exists", duplicate: true };
			}
			console.error("Failed to create tag:", error);
			return { success: false, message: "Failed to create tag" };
		}
	},

	// Reset
	reset: () => set({ allTags: [], error: null }),
}));

export default useTagStore;
