import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

const API = import.meta.env.VITE_BASE_API_URI;

export default function FieldData({ id, oldData }) {
	const navigate = useNavigate();
	const { updateProfile, uploadProfileImage, isLoading } = useUserStore();

	const [newProfile, setNewProfile] = useState({
		first_name: oldData.first_name || "",
		last_name: oldData.last_name || "",
		email: oldData.email || "",
		address: oldData.address || "",
		phone: oldData.phone_nuumber || "",
	});

	const [localImage, setLocalImage] = useState(
		oldData.image_path ? `${API}/${oldData.image_path}` : "https://api.dicebear.com/7.x/initials/svg?seed=" + (oldData.first_name || "U")
	);

	const handleChangImage = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// Show instant local preview
		setLocalImage(URL.createObjectURL(file));

		// Upload immediately
		await uploadProfileImage(id, file);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const result = await updateProfile(id, {
			first_name: newProfile.first_name,
			last_name: newProfile.last_name,
			email: newProfile.email,
			address: newProfile.address,
			phone_nuumber: newProfile.phone,
		});

		if (result.success) {
			useUserStore.getState().setProfile({
				...oldData,
				first_name: newProfile.first_name,
				last_name: newProfile.last_name,
				email: newProfile.email,
				address: newProfile.address,
				phone_nuumber: newProfile.phone,
			});
			navigate(-1); // Go back to profile
		} else {
			alert(result.message || "Failed to update profile");
		}
	};

	const handleChange = (e) => {
		setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
	};

	return (
		<div className="w-full">
			{/* Image Upload Section */}
			<div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-8 border-b border-gray-100">
				<img
					src={localImage}
					alt="profile preview"
					className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
				/>
				<div className="flex flex-col gap-2 items-center sm:items-start">
					<p className="text-sm text-gray-600 font-medium">Profile photo</p>
					<p className="text-xs text-gray-500 mb-2">Recommended: Square image, at least 400x400px</p>
					<label
						htmlFor="file"
						className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
					>
						Update image
					</label>
					<input
						type="file"
						id="file"
						className="hidden"
						accept="image/*"
						onChange={handleChangImage}
					/>
				</div>
			</div>

			{/* Form Form */}
			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				
				<div className="flex flex-col sm:flex-row gap-6">
					<div className="w-full sm:w-1/2 flex flex-col gap-2">
						<label htmlFor="first_name" className="text-sm font-semibold text-gray-900">First Name</label>
						<input
							type="text"
							id="first_name"
							name="first_name"
							className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
							value={newProfile.first_name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="w-full sm:w-1/2 flex flex-col gap-2">
						<label htmlFor="last_name" className="text-sm font-semibold text-gray-900">Last Name</label>
						<input
							type="text"
							id="last_name"
							name="last_name"
							className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
							value={newProfile.last_name}
							onChange={handleChange}
							required
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-sm font-semibold text-gray-900">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
						value={newProfile.email}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="address" className="text-sm font-semibold text-gray-900">Address (Optional)</label>
					<input
						type="text"
						id="address"
						name="address"
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
						value={newProfile.address}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="phone" className="text-sm font-semibold text-gray-900">Phone (Optional)</label>
					<input
						type="text"
						id="phone"
						name="phone"
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
						value={newProfile.phone}
						onChange={handleChange}
					/>
				</div>

				<div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="px-6 py-2.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
					>
						{isLoading ? "Saving..." : "Save changes"}
					</button>
				</div>
			</form>
		</div>
	);
}
