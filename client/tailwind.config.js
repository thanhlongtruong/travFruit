/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        "custom-height": "140px",
      },
      gridTemplateColumns: {},
      animation: { "bounce-hozi": "bounce-hozi 1s infinite" },
      keyframes: {
        "bounce-hozi": {
          "0%, 100%": { transform: "translateX(25%)" },
          "50%": { transform: "translateX(-25%)" },
        },
      },
    },
  },
  plugins: [],
};
