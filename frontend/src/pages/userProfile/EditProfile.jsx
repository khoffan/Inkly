import { useEffect } from "react";

import Footer from "../../components/Footer";
import useUserStore from "../../store/useUserStore";
import useAuthStore from "../../store/useAuthStore";
import { useParams, useNavigate } from "react-router-dom";
import UpdateProfileDetail from "../../components/profileComponents/UpdateProfileDetail";

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProfile, profile, isLoading } = useUserStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Only allow editing if logged in and it's their own profile
    if (!user) {
      navigate("/login");
      return;
    }
    if (user._id !== id && user.authid !== id) {
      navigate("/");
      return;
    }

    fetchProfile(id);
  }, [id, user, fetchProfile, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow w-full max-w-[720px] mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : profile ? (
          <UpdateProfileDetail id={profile._id} oldData={profile} />
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
