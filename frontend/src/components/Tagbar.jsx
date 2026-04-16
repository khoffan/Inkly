import { useEffect } from "react";
import Tag from "./Tag";
import useTagStore from "../store/useTagStore";

export default function Tagbar({ sendTags }) {
	const { allTags, fetchUniqueTags } = useTagStore();

	useEffect(() => {
		fetchUniqueTags();
	}, []);

	if (!allTags || allTags.length === 0) return null;

	return (
		<div className="w-full">
			<div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
				<div className="flex gap-2">
					{allTags.map((tagName, index) => (
						<Tag
							tagName={tagName}
							key={`tag-${index}`}
							index={index}
							sendTags={sendTags}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
