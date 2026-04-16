import { useState, useRef, useEffect } from "react";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TagField({
	selectedTags = [],
	onTagsChange,
	allTags = [],
	maxTags = 5,
}) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef(null);
	const inputRef = useRef(null);

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const trimmedQuery = query.trim().toLowerCase();

	// Filter tags: match query, exclude already selected
	const filteredTags = allTags.filter(
		(tag) =>
			tag.toLowerCase().includes(trimmedQuery) &&
			!selectedTags.includes(tag)
	);

	// Check if the exact query already exists (case-insensitive)
	const exactMatchExists = allTags.some(
		(tag) => tag.toLowerCase() === trimmedQuery
	);
	const isAlreadySelected = selectedTags.some(
		(tag) => tag.toLowerCase() === trimmedQuery
	);
	const showCreateOption =
		trimmedQuery.length > 0 && !exactMatchExists && !isAlreadySelected;

	const addTag = (tagName) => {
		if (selectedTags.length >= maxTags) return;
		if (!selectedTags.includes(tagName)) {
			onTagsChange([...selectedTags, tagName]);
		}
		setQuery("");
		setIsOpen(false);
		inputRef.current?.focus();
	};

	const removeTag = (tagToRemove) => {
		onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (showCreateOption) {
				addTag(query.trim());
			} else if (filteredTags.length > 0) {
				addTag(filteredTags[0]);
			}
		} else if (e.key === "Backspace" && query === "" && selectedTags.length > 0) {
			removeTag(selectedTags[selectedTags.length - 1]);
		} else if (e.key === "Escape") {
			setIsOpen(false);
		}
	};

	const atLimit = selectedTags.length >= maxTags;

	return (
		<div className="w-full" ref={wrapperRef}>
			<h3 className="text-base font-bold text-gray-900 mb-3 font-sans pb-2 border-b border-gray-100">
				Add Tags
			</h3>
			<p className="text-sm text-gray-500 mb-4 font-sans">
				Add up to {maxTags} tags to help readers find your story.
			</p>

			{/* Selected Tags (Chips) */}
			{selectedTags.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-3">
					{selectedTags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center gap-1.5 bg-gray-900 text-white py-1.5 px-3 rounded-full text-sm font-sans font-medium"
						>
							{tag}
							<button
								type="button"
								className="text-gray-300 hover:text-white focus:outline-none transition-colors w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-700"
								onClick={() => removeTag(tag)}
							>
								<FontAwesomeIcon icon={faXmark} className="text-[10px]" />
							</button>
						</span>
					))}
				</div>
			)}

			{/* Search Input */}
			<div className="relative">
				<input
					ref={inputRef}
					type="text"
					placeholder={atLimit ? `Maximum ${maxTags} tags reached` : "Search or create a tag..."}
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					disabled={atLimit}
					className="w-full p-3 font-sans text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				/>

				{/* Dropdown */}
				{isOpen && !atLimit && (filteredTags.length > 0 || showCreateOption) && (
					<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
						{/* Existing tag suggestions */}
						{filteredTags.map((tag) => (
							<button
								key={tag}
								type="button"
								className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-sans first:rounded-t-lg last:rounded-b-lg"
								onClick={() => addTag(tag)}
							>
								{tag}
							</button>
						))}

						{/* Create new tag option */}
						{showCreateOption && (
							<button
								type="button"
								className="w-full text-left px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors font-sans border-t border-gray-100 flex items-center gap-2 last:rounded-b-lg"
								onClick={() => addTag(query.trim())}
							>
								<FontAwesomeIcon icon={faPlus} className="text-xs" />
								Create &quot;{query.trim()}&quot;
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
