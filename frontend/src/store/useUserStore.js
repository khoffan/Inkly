import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./useAuthStore";

const API = import.meta.env.VITE_BASE_API_URI;

const useUserStore = create((set) => ({
	// State
	profile: null,
	isLoading: false,
	error: null,

	// Actions
	fetchProfile: async (authId) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API}/api/profile/${authId}`);
			if (response.data.profile) {
				set({ profile: response.data.profile, isLoading: false });
				return response.data.profile;
			}
			set({ isLoading: false });
			return null;
		} catch (error) {
			console.error("Failed to fetch profile:", error);
			set({ profile: null, isLoading: false, error: "Failed to fetch profile" });
			return null;
		}
	},

	updateProfile: async (id, data) => {
		set({ isLoading: true, error: null });
		try {
			const headers = {
				"Content-Type": "application/json",
				...useAuthStore.getState().getAuthHeaders(),
			};
			const response = await axios.put(`${API}/api/updateprofile/${id}`, data, {
				headers,
			});
			set({ isLoading: false });
			return { success: true, message: response.data.message };
		} catch (error) {
			console.error("Failed to update profile:", error);
			set({ isLoading: false, error: "Failed to update profile" });
			return { success: false };
		}
	},

	uploadProfileImage: async (id, file) => {
		set({ isLoading: true });
		try {
			const formData = new FormData();
			formData.append("file", file);
			const headers = {
				"Content-Type": "multipart/form-data",
				...useAuthStore.getState().getAuthHeaders(),
			};
			const response = await axios.put(`${API}/api/uploadimage/${id}`, formData, {
				headers,
			});
			if (response.data.image_path) {
				set((state) => ({
					profile: state.profile
						? { ...state.profile, image_path: response.data.image_path }
						: null,
					isLoading: false,
				}));
			} else {
				set({ isLoading: false });
			}
			return response.data.image_path;
		} catch (error) {
			console.error("Failed to upload image:", error);
			set({ isLoading: false });
			return null;
		}
	},

	setProfile: (profile) => set({ profile }),

	// Reset
	reset: () => set({ profile: null, error: null }),
}));

export default useUserStore;
