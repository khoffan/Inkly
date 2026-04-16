import React, { useEffect, useState, useCallback } from "react";

import { useParams } from "react-router-dom";
import CardDetail from "../../components/BlogComponents/CardDetail";

export default function BlogDetail() {
	const { id } = useParams();
	const [scrollProgress, setScrollProgress] = useState(0);

	const handleScroll = useCallback(() => {
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (docHeight <= 0) return;
		const progress = Math.min((scrollTop / docHeight) * 100, 100);
		setScrollProgress(progress);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return (
		<div className="min-h-screen bg-white">
			{/* Scroll Progress Bar */}
			<div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
				<div
					className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-[width] duration-150 ease-out"
					style={{ width: `${scrollProgress}%` }}
				/>
			</div>

			<main className="w-full">
				<CardDetail id={id} />
			</main>
		</div>
	);
}
