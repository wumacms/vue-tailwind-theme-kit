import themePreset from "./preset.cjs";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [themePreset],
  content: [
    "./index.html",
    "./playground/**/*.{vue,js,ts,jsx,tsx}",
  ],
};
