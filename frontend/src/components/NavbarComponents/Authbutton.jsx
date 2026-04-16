import { Link } from "react-router-dom";

export default function Authbutton({ handleCheckLogin }) {
	return (
		<div className="flex gap-4 items-center pl-4 border-l border-gray-200">
			<Link to="/login">
				<button className="text-gray-600 hover:text-black font-medium text-sm transition-colors">
					Sign In
				</button>
			</Link>
			<Link to="/signup">
				<button className="bg-black text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm">
					Get started
				</button>
			</Link>
		</div>
	);
}
