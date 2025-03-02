/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryColor: "#CD3431",
        inputBackgroundColor: "#F7C2C1",
        primaryTextColor: "#FAFAFA",
        shadowColor: "#fcf8f6",
        screenBackgroundColor: "#F5F5F5",
        headingColor: "#333",
        placeHolderColor: "",
      },
      fontFamily: {
        roboto: ["Roboto_400Regular", "sans-serif"],
        poppins: ["Poppins_400Regular", "sans-serif"],
      },
    },
  },

  plugins: [],
};
