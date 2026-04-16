import { useState } from "react";

import Content from "../components/BlogComponents/Content";

export default function Home() {
	return (
		<div className="min-h-screen bg-white">

			<main className="max-w-[720px] lg:max-w-[1040px] mx-auto px-6 pt-10 pb-20">
				<Content />
			</main>
		</div>
	);
}
