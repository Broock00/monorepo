/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@repo/ui-components/tailwind-preset')],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui-components/src/**/*.{ts,tsx}',
    '../../packages/feature-x/src/**/*.{ts,tsx}',
    '../../packages/feature-y/src/**/*.{ts,tsx}',
  ],
};
