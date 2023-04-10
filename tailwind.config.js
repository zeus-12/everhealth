/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind");

module.exports = {
	content: ["./App.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {},
	},
	presets: [nativewind],
	plugins: [],
};
