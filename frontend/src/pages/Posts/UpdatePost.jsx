import React from "react";
import BlogUpdate from "../../components/BlogComponents/BlogUpdate";
import { useParams } from "react-router-dom";

export default function UpdatePost() {
	const { id } = useParams();

	return (
		<>
			<BlogUpdate id={id} />
		</>
	);
}
