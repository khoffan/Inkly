import { PropTypes } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faBookOpen } from "@fortawesome/free-solid-svg-icons";

const API = import.meta.env.VITE_BASE_API_URI;

function LiComponent({ navTraffic, name, icon }) {
	LiComponent.propTypes = {
		navTraffic: PropTypes.func,
		name: PropTypes.string,
		icon: PropTypes.object,
	};

	return (
		<li>
			<button
				className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
				onClick={() => navTraffic()}
			>
				{icon && <FontAwesomeIcon icon={icon} className="text-gray-400 w-4" />}
				<span>{name}</span>
			</button>
		</li>
	);
}

export default function Dropdown({
	navProfile,
	logoutevent,
	yourBlog,
	user,
	isImage,
}) {
	Dropdown.propTypes = {
		navProfile: PropTypes.func,
		logoutevent: PropTypes.func,
		yourBlog: PropTypes.func,
		user: PropTypes.object,
		isImage: PropTypes.bool,
	};
	
	return (
		<div
			id="dropdown"
			className="absolute right-0 top-0 w-[240px] bg-white border border-gray-100 rounded-xl shadow-lg z-[100] overflow-hidden flex flex-col"
		>
			<div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
				<img
					className="w-10 h-10 object-cover rounded-full border border-gray-200"
					src={
						isImage
							? `${API}/${user.image_path}`
							: "https://api.dicebear.com/7.x/initials/svg?seed=" + (user.first_name || "U")
					}
					alt=""
				/>
				<div className="flex flex-col">
					<span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{user.first_name}</span>
					<span className="text-xs text-gray-500 truncate max-w-[150px]">@{user.email?.split('@')[0] || 'user'}</span>
				</div>
			</div>
			
			<ul className="py-2 flex flex-col">
				<LiComponent navTraffic={navProfile} name="Profile" icon={faUser} />
				<LiComponent navTraffic={yourBlog} name="Your Stories" icon={faBookOpen} />
			</ul>
			
			<div className="border-t border-gray-100 py-2">
				<LiComponent navTraffic={logoutevent} name="Sign out" icon={faSignOutAlt} />
			</div>
		</div>
	);
}
