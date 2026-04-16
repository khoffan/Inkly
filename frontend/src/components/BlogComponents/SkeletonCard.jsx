export default function SkeletonCard() {
	return (
		<div className="animate-pulse flex flex-col h-full w-full border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
			{/* Thumbnail Area */}
			<div className="w-full aspect-video md:aspect-[4/3] bg-gray-200"></div>
			
			{/* Content Area */}
			<div className="flex-1 flex flex-col p-4 md:p-5 h-full w-full">
				
				{/* Author Meta */}
				<div className="flex items-center gap-2 mb-3">
					<div className="h-6 w-6 rounded-full bg-gray-200"></div>
					<div className="h-4 w-24 bg-gray-200 rounded"></div>
				</div>
				
				{/* Title & Excerpt */}
				<div className="h-6 w-3/4 bg-gray-200 rounded mt-2 mb-4"></div>
				<div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
				<div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
				<div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
				
				{/* Footer Meta */}
				<div className="flex items-center gap-2 md:gap-4 mt-auto pt-4 border-t border-gray-50">
					<div className="h-3 w-20 bg-gray-200 rounded"></div>
					<div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block shrink-0"></div>
					<div className="h-3 w-16 bg-gray-200 rounded hidden sm:block"></div>
				</div>
			</div>
		</div>
	);
}
