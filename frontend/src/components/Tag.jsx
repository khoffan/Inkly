import { PropTypes } from "prop-types";
import { useState } from "react";

export default function Tag({ tagName, index, sendTags }) {
	const [selected, setSelected] = useState(false);

	const toggleTag = () => {
		setSelected(!selected);
		sendTags(tagName, !selected);
	};

	return (
		<button
			onClick={toggleTag}
			className={`
				px-4 py-2 text-[14px] rounded-full transition-colors whitespace-nowrap
				${selected 
					? "bg-black text-white hover:bg-gray-800" 
					: "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
				}
			`}
		>
			{tagName}
		</button>
	);
}

Tag.propTypes = {
	tagName: PropTypes.string.isRequired,
	index: PropTypes.number,
	sendTags: PropTypes.func.isRequired,
};
