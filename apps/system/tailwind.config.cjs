/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@repo/ui-components/tailwind-preset')],
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx,js,jsx}',
		'../../packages/ui-components/src/**/*.{ts,tsx,js,jsx}',
		'../../packages/feature-x/src/**/*.{ts,tsx,js,jsx}',
		'../../packages/feature-y/src/**/*.{ts,tsx,js,jsx}',
	],
};
