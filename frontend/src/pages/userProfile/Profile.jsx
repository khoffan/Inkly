import { useEffect } from "react";

import Footer from "../../components/Footer";
import DetailProfile from "../../components/profileComponents/DetailProfile";
import useUserStore from "../../store/useUserStore";
import useAuthStore from "../../store/useAuthStore";
import { useParams } from "react-router-dom";

export default function Profile() {
	const { fetchProfile, profile, isLoading } = useUserStore();
	const { user } = useAuthStore();
	// Can get ID either from URL params (if we change routes) or the auth store
	const userId = user?.authid; 

	useEffect(() => {
		if (userId) {
			fetchProfile(userId);
		}
	}, [userId]);

	return (
		<div className="min-h-screen flex flex-col bg-white">

			<main className="flex-grow w-full max-w-[1040px] mx-auto px-6 py-12">
				{isLoading ? (
					<div className="flex justify-center items-center h-40">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
					</div>
				) : profile ? (
					<DetailProfile userObj={profile} />
				) : (
					<div className="text-center py-20 text-gray-500 font-serif text-lg">
						Profile not found.
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
