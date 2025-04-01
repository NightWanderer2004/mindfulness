import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./apps/extension/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
}

export default config
