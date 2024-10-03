/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e3e9f3",
        Charcoal: "#151515",
        PastelOrange: "#fe9b72",
        LightGold: "#fec971",
        LightLavender: "#b792fd",
        BrightCyan: "#00d4fd",
        PaleYellow: "#e4ef8f",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(90deg, #FE9B72 0%, #FEC971 25%, #B792FD 50%, #00D4FD 75%, #E4EF8F 100%)",
      },
      screens: {
        xs: "375px", // Custom extra small breakpoint
      },
    },
  },
  plugins: [],
};
