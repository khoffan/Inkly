import { useNavigate } from "react-router-dom";
import FieldDataProfile from "./FieldDataProfile";
import { Helmet } from "react-helmet-async";

const API = import.meta.env.VITE_BASE_API_URI;

export default function DetailProfile({ userObj }) {
  const navigate = useNavigate();

  const handleUpdateProfile = () => {
    if (!userObj) return;
    navigate(`/user/editprofile/${userObj.authid}`);
  };

  if (!userObj) return null;

  const displayName = userObj.first_name + " " + userObj.last_name;
  const displayImage = userObj.image_path
    ? `${API}/${userObj.image_path}`
    : "https://api.dicebear.com/7.x/initials/svg?seed=" +
      (userObj.first_name || "U");

  return (
    <>
      <Helmet>
        <title>Inkly - {displayName}</title>
        <meta name="description" content="User Profile" />
        <meta
          name="keywords"
          content="user profile, user information, user details"
        />
      </Helmet>
      <div className="flex flex-col md:flex-row gap-16 font-sans">
        {/* Left Column - User Info */}
        <div className="w-full md:w-[680px]">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-[42px] font-bold tracking-tight text-gray-900">
              {displayName}
            </h1>
            <button
              onClick={handleUpdateProfile}
              className="hidden md:flex text-gray-600 hover:text-black hover:bg-gray-50 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium transition-colors"
            >
              Edit profile
            </button>
          </div>

          {/* Basic Data List */}
          <div className="mb-10 block md:hidden">
            {/* Mobile edit button */}
            <button
              onClick={handleUpdateProfile}
              className="w-full text-center text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-full border border-gray-200 text-sm font-medium transition-colors"
            >
              Edit profile
            </button>
          </div>

          <div className="border-t border-gray-100 py-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900 font-serif">
              About
            </h3>
            <FieldDataProfile
              id={userObj._id}
              oldData={userObj}
              isShow={true}
            />
          </div>
        </div>

        {/* Right Column - Avatar / Settings sidebar */}
        <div className="hidden md:flex flex-col w-[320px] shrink-0 border-l border-gray-100 pl-10 pt-4">
          <img
            src={displayImage}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover mb-6 border border-gray-200"
          />
          <h2 className="text-base font-bold text-gray-900 mb-2">
            {displayName}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {userObj.blogs_count || 0} Stories written
          </p>

          <button
            onClick={handleUpdateProfile}
            className="text-green-600 hover:text-green-700 text-sm mb-4 font-medium text-left transition-colors"
          >
            Edit profile information
          </button>
        </div>
      </div>
    </>
  );
}
