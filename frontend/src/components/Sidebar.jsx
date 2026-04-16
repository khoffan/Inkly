import React from "react";
import useBlogStore from "../store/useBlogStore";
import Tag from "./Tag"; // Ensure we can reuse Tag or just map the UI

export default function Sidebar() {
	const { allTags } = useBlogStore();

	// Take first 7 tags to represent "Recommended Topics"
	const recommendedTopics = allTags?.slice(0, 7) || [];

	return (
		<aside className="w-full flex flex-col gap-8">
			
			{/* Recommended Topics */}
			{recommendedTopics.length > 0 && (
				<section>
					<h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
						Recommended topics
					</h3>
					<div className="flex flex-wrap gap-2">
						{recommendedTopics.map((tag, i) => (
							<span
								key={`side-tag-${i}`}
								className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-full cursor-pointer transition-colors border border-gray-100"
							>
								{tag.tagname}
							</span>
						))}
					</div>
					<button className="text-green-600 hover:text-green-700 text-sm mt-4 font-medium">
						See more topics
					</button>
				</section>
			)}

			{/* Who to follow (Mock for layout) */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
					Who to follow
				</h3>
				<div className="flex flex-col gap-4">
					{[1, 2, 3].map((item) => (
						<div key={item} className="flex items-start gap-4 justify-between group cursor-pointer">
							<div className="flex items-start gap-3">
								<img 
									src={`https://api.dicebear.com/7.x/initials/svg?seed=Author${item}`}
									alt="Author"
									className="w-8 h-8 rounded-full border border-gray-100 object-cover"
								/>
								<div className="flex flex-col">
									<p className="text-sm font-bold text-gray-900 group-hover:underline">Author Name {item}</p>
									<p className="text-xs text-gray-500 line-clamp-2">Tech writer, software enthusiast, and avid reader.</p>
								</div>
							</div>
							<button className="px-3 py-1.5 border border-gray-900 text-gray-900 rounded-full text-xs font-medium hover:bg-gray-900 hover:text-white transition-colors">
								Follow
							</button>
						</div>
					))}
				</div>
			</section>

			{/* Footer Links (Medium style) */}
			<section className="pt-4 border-t border-gray-100">
				<div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-400">
					<a href="#" className="hover:text-gray-600">Help</a>
					<a href="#" className="hover:text-gray-600">Status</a>
					<a href="#" className="hover:text-gray-600">About</a>
					<a href="#" className="hover:text-gray-600">Careers</a>
					<a href="#" className="hover:text-gray-600">Press</a>
					<a href="#" className="hover:text-gray-600">Blog</a>
					<a href="#" className="hover:text-gray-600">Privacy</a>
					<a href="#" className="hover:text-gray-600">Terms</a>
					<a href="#" className="hover:text-gray-600">Text to speech</a>
					<a href="#" className="hover:text-gray-600">Teams</a>
				</div>
			</section>
		</aside>
	);
}
