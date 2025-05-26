export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        montserrat: ["Montserrat Alternates", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#6B8E23",
          500: "#506A1A",
          300: "#83A53E",
        },
        letter: {
          DEFAULT: "#2C2525",
        },
        sand: {
          DEFAULT: "#F8F5E8",
        },
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
