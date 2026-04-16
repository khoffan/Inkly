import { PropTypes } from "prop-types";
import { format } from "date-fns";

const API = import.meta.env.VITE_BASE_API_URI;

export default function Blog({
	index,
	name,
	title,
	content,
	creatDate,
	imageUrl,
	isUser,
	thumbnail,
	onEdit,
	onDelete,
	readingTime,
}) {
	Blog.propTypes = {
		index: PropTypes.string,
		name: PropTypes.string,
		title: PropTypes.string,
		content: PropTypes.string, // Passed from Description mostly
		creatDate: PropTypes.string,
		imageUrl: PropTypes.string,
		isUser: PropTypes.bool,
		thumbnail: PropTypes.string,
		onEdit: PropTypes.func,
		onDelete: PropTypes.func,
		readingTime: PropTypes.string,
	};

	const formattedDate = creatDate 
		? format(new Date(creatDate), "MMM d, yyyy") 
		: "Unknown date";
		
	const displayAvatar = imageUrl 
		? `${API}/${imageUrl}` 
		: "https://api.dicebear.com/7.x/initials/svg?seed=" + (name || "U");

	return (
		<article className="flex flex-col h-full w-full">
			{/* Top Thumbnail Image Area */}
			{thumbnail ? (
				<div className="w-full aspect-video md:aspect-[4/3] w-full shrink-0 overflow-hidden">
					<img 
						src={`${API}/${thumbnail}`} 
						alt={title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>
			) : (
				// Fallback generic pattern if no thumbnail
				<div className="w-full aspect-video md:aspect-[4/3] shrink-0 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
					<div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
				</div>
			)}

			{/* Content Area */}
			<div className="flex-1 min-w-0 flex flex-col p-4 md:p-5 h-full w-full bg-white">
				
				{/* Author Meta */}
				<div className="flex items-center gap-2 mb-3">
					<img
						className="w-6 h-6 rounded-full object-cover border border-gray-100"
						src={displayAvatar}
						alt={name}
					/>
					<span className="text-sm text-gray-900 font-medium truncate">{name}</span>
					<span className="text-[13px] text-gray-500 hidden sm:inline">in</span>
					<span className="text-[13px] text-gray-900 font-medium hidden sm:inline truncate">Programming</span> {/* Mock topic for design */}
				</div>
				
				{/* Title & Excerpt */}
				<h2 className="text-lg md:text-xl font-serif font-bold text-gray-900 leading-tight mb-2 group-hover:text-black line-clamp-2">
					{title}
				</h2>
				<p className="text-sm md:text-base text-gray-600 font-serif leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
					{content || "No preview description available. Click to read the full story on Inkly."}
				</p>
				
				{/* Footer Meta (Date, Read Time) */}
				<div className="flex flex-wrap items-center gap-2 md:gap-4 mt-auto pt-4 border-t border-gray-50">
					<span className="text-[13px] text-gray-500 shrink-0">{formattedDate}</span>
					<div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block shrink-0"></div>
					<span className="text-[13px] text-gray-500 hidden sm:block shrink-0">{readingTime || "1 min read"}</span>
					
					{/* Status Tag for User Dashboard */}
					{isUser && (
						<div className="ml-auto flex items-center gap-2">
							<span className="text-[10px] md:text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
								Published
							</span>
							<button 
								onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(index); }}
								className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full font-medium transition-colors"
							>
								Edit
							</button>
							<button 
								onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(index); }}
								className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full font-medium transition-colors"
							>
								Delete
							</button>
						</div>
					)}
				</div>
			</div>
		</article>
	);
}
