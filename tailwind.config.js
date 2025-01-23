module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",    // Includes all JS files within the src folder
    "./src/components/**/*.{js,jsx,ts,tsx}",  // Ensure this targets components specifically
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
