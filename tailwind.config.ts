import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                crypto: {
                    dark: '#020617',      // Deep Space Navy
                    primary: '#00B2FF',   // Electric Cyan
                    secondary: '#D033FF', // Neon Purple
                }
            },
        },
    },
    plugins: [],
};
export default config;