import React from "react";
import FieldData from "./FieldData";

export default function FieldDataProfile({ id, oldData, isUpdate }) {
	if (isUpdate) {
		return <FieldData id={id} oldData={oldData} isUpdate={isUpdate} />;
	}

	return (
		<div className="flex flex-col gap-6 text-[15px] font-sans">
			<div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 pb-4 border-b border-gray-50">
				<span className="w-32 text-gray-900 font-semibold">Name</span>
				<span className="text-gray-600">{oldData.first_name} {oldData.last_name}</span>
			</div>
			
			<div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 pb-4 border-b border-gray-50">
				<span className="w-32 text-gray-900 font-semibold">Email</span>
				<span className="text-gray-600">{oldData.email}</span>
			</div>

			<div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 pb-4 border-b border-gray-50">
				<span className="w-32 text-gray-900 font-semibold">Address</span>
				<span className="text-gray-600">{oldData.address || "Not provided"}</span>
			</div>

			<div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 pb-4 border-b border-gray-50">
				<span className="w-32 text-gray-900 font-semibold">Phone</span>
				<span className="text-gray-600">{oldData.phone_nuumber || "Not provided"}</span>
			</div>
			
			<div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
				<span className="w-32 text-gray-900 font-semibold">Stories Published</span>
				<span className="text-gray-600">{oldData.blogs_count || 0}</span>
			</div>
		</div>
	);
}
