import { faCirclePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextNavigate from "./TextNavigate";

const API = import.meta.env.VITE_BASE_API_URI;

export default function ParagraphField({
	paragraphs = [],
	handleContent,
	activeIndex,
	paragraphRef,
	handleKeydown,
	handleFocus,
	isTextnavigate,
	handleNavatebutton,
	handleFileUpload,
	handleDeleteImage,
	blogImage = [],
}) {
	const getImageFile = (imageid) => {
		const image = blogImage.find((img) => img.id === imageid);
		return image ? `${API}/${image.image_path}` : "";
	};

	return (
		<div className="flex flex-col w-full relative pl-12 -ml-12">
			{paragraphs.map((paragraph, index) => (
				<div key={index} className="flex gap-4 relative group min-h-[40px] items-center py-2">
					
					{/* Add Button (Medium style plus icon) */}
					{activeIndex === index && paragraph.type === "text" && paragraph.content === "" && (
						<button
							className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gray-300 text-gray-400 hover:border-black hover:text-black flex outline-none transition-colors items-center justify-center bg-white"
							onClick={() => handleNavatebutton(index)}
						>
							<FontAwesomeIcon icon={faCirclePlus} className={isTextnavigate[index] ? "rotate-45" : "rotate-0"} style={{transition: 'transform 0.2s'}} />
						</button>
					)}

					<div className="w-full">
						{!isTextnavigate[index] ? (
							paragraph.type === "text" ? (
								<textarea
									ref={(el) => (paragraphRef.current[index] = el)}
									className={`w-full bg-transparent outline-none resize-none font-serif text-gray-800 focus:ring-0 p-0 block leading-relaxed ${
										index === 0
											? "text-4xl md:text-[42px] font-bold placeholder-gray-300 leading-tight tracking-tight mt-4"
											: "text-[21px] placeholder-gray-300 mt-2"
									}`}
									onChange={(event) => handleContent(event, index)}
									onKeyDown={(event) => handleKeydown(event, index)}
									onFocus={() => handleFocus(index)}
									placeholder={index === 0 ? "Title" : "Tell your story..."}
									value={paragraph.content}
									rows={1}
									spellCheck={false}
								></textarea>
							) : (
								<div className="w-full my-8 relative group">
									<img
										src={getImageFile(paragraph.content)}
										alt="blog_image"
										className="w-full h-auto max-h-[600px] object-cover rounded-sm border border-gray-100"
									/>
									<button
										onClick={() => handleDeleteImage(index)}
										className="absolute top-4 right-4 bg-white shadow-md hover:bg-red-50 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-red-100"
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							)
						) : (
							<TextNavigate
								handleFile={handleFileUpload}
								index={index}
							/>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
