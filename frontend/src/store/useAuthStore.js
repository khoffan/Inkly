import { create } from "zustand";
import axios from "axios";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase_conf";

const API = import.meta.env.VITE_BASE_API_URI;

const useAuthStore = create((set, get) => ({
	// State
	user: null,
	firebaseUser: null,
	idToken: null,
	isLogin: false,
	isImage: false,
	isLoading: false,
	isAuthReady: false,
	error: null,

	// Helper: get auth headers for API calls
	getAuthHeaders: () => {
		const token = get().idToken;
		if (!token) return {};
		return { Authorization: `Bearer ${token}` };
	},

	// Initialize auth listener (call once on app mount)
	initAuth: () => {
		set({ isLoading: true });

		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				try {
					const token = await firebaseUser.getIdToken();
					set({ firebaseUser, idToken: token, isLogin: true });

					// Fetch profile from backend
					await get().fetchUser();
					set({ isAuthReady: true, isLoading: false });
				} catch (error) {
					console.error("initAuth token error:", error);
					set({
						firebaseUser: null,
						idToken: null,
						isLogin: false,
						user: null,
						isAuthReady: true,
						isLoading: false,
					});
				}
			} else {
				set({
					firebaseUser: null,
					idToken: null,
					isLogin: false,
					user: null,
					isImage: false,
					isAuthReady: true,
					isLoading: false,
				});
			}
		});

		return unsubscribe;
	},

	// Fetch user profile from backend
	fetchUser: async () => {
		const headers = get().getAuthHeaders();
		if (!headers.Authorization) return null;

		try {
			const res = await axios.get(`${API}/api/user`, { headers });

			if (res.status === 200 && res.data.auth === true) {
				const userData = res.data.user;
				set({
					user: userData,
					isImage: !!userData.image_path,
				});
				return userData;
			}
			return null;
		} catch (error) {
			console.error("fetchUser error:", error);
			return null;
		}
	},

	// Login with Firebase
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);
			const token = await credential.user.getIdToken();

			set({ firebaseUser: credential.user, idToken: token, isLogin: true });

			// Sync user profile (creates if doesn't exist)
			await axios.post(
				`${API}/api/sync-user`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Fetch full profile
			await get().fetchUser();
			set({ isLoading: false });

			return { success: true, message: "Login successfully" };
		} catch (error) {
			const msg = error.code === "auth/invalid-credential"
				? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
				: error.code === "auth/user-not-found"
				? "ไม่พบผู้ใช้งานนี้"
				: error.code === "auth/wrong-password"
				? "รหัสผ่านไม่ถูกต้อง"
				: error.code === "auth/too-many-requests"
				? "มีการเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง"
				: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง";
			set({ isLoading: false, error: msg });
			return { success: false, message: msg };
		}
	},

	// Register with Firebase
	register: async ({ first_name, last_name, email, password }) => {
		set({ isLoading: true, error: null });
		try {
			const credential = await createUserWithEmailAndPassword(auth, email, password);
			const token = await credential.user.getIdToken();

			// Sync profile to MongoDB
			await axios.post(
				`${API}/api/sync-user`,
				{ first_name, last_name },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Sign out after registration (user should login manually)
			await signOut(auth);
			set({ isLoading: false });

			return { success: true, message: "ลงทะเบียนสำเร็จ" };
		} catch (error) {
			const msg = error.code === "auth/email-already-in-use"
				? "อีเมลนี้ถูกใช้งานแล้ว"
				: error.code === "auth/weak-password"
				? "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
				: error.code === "auth/invalid-email"
				? "รูปแบบอีเมลไม่ถูกต้อง"
				: "ลงทะเบียนไม่สำเร็จ กรุณาลองอีกครั้ง";
			set({ isLoading: false, error: msg });
			return { success: false, message: msg };
		}
	},

	// Logout
	logout: async () => {
		set({ isLoading: true });
		try {
			await signOut(auth);
			set({
				user: null,
				firebaseUser: null,
				idToken: null,
				isLogin: false,
				isImage: false,
				isLoading: false,
			});
			return { success: true, message: "Logout successfully" };
		} catch (error) {
			set({ isLoading: false });
			return { success: false, message: "Logout failed" };
		}
	},

	// Reset
	reset: () =>
		set({
			user: null,
			firebaseUser: null,
			idToken: null,
			isLogin: false,
			isImage: false,
			error: null,
			isAuthReady: false,
		}),
}));

export default useAuthStore;
