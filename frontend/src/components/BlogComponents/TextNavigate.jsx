import { faImage, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TextNavigate({ handleFile, index }) {
	return (
		<div className="flex gap-4 items-center">
			{/* Image Upload Button */}
			<label
				htmlFor={`file-upload-${index}`}
				className="w-10 h-10 rounded-full border border-green-600 text-green-600 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors"
				title="Add an image"
			>
				<FontAwesomeIcon icon={faImage} />
			</label>
			<input
				id={`file-upload-${index}`}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => handleFile(e, index)}
			/>
			
			{/* Video (Mock) Upload Button */}
			<button 
				type="button" 
				className="w-10 h-10 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center transition-colors cursor-not-allowed"
				title="Video upload not supported yet"
			>
				<FontAwesomeIcon icon={faPlayCircle} />
			</button>
		</div>
	);
}
