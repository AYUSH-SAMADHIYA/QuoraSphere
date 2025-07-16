module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", // Enables class-based dark mode (use 'dark' class on <html>)
  theme: {
    extend: {
      colors: {
        darkBg: "#121212",
        darkCard: "#1e1e1e",
        darkBorder: "#2c2c2c",
        lightText: "#e0e0e0",
        accent: "#3b82f6", // Tailwind blue-500
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
