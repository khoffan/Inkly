/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				serif: ["Lora", "Georgia", "serif"],
				title: ["Montserrat", "sans-serif"]
			},
			colors: {
				brand: {
					100: "#f9f9f9",
					200: "#e6e6e6",
					500: "#191919",
					800: "#080808",
				}
			}
		}
	},
	plugins: []
};
