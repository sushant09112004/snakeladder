import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      midnight: "#121063",
      primary: "#3A0CA3",
      secondary: "#4361EE",
      tertiary: "#4CC9F0",
      rose: "#F72585",
      grape: "#7209B7",
      white: "#ffffff",
      player1color: "#FF0000",
      player2color: "#fffe00",
      player3color: "#E072A4",
      player4color: "#3D3B8E",
    },
  },
  safelist: [
    "bg-player1color",
    "bg-player2color",
    "bg-player3color",
    "bg-player4color",
  ],
  plugins: [require("@tailwindcss/forms")],
};
export default config;
