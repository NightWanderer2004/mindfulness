import type { Config } from "tailwindcss"
import sharedConfig from "@repo/tailwind-config"

const config: Pick<Config, "content" | "presets" | "important" | "theme"> = {
  content: [
    "./src/cs/**/*.tsx",
    "./entrypoints/**/*.tsx",
    "../../packages/ui/src/**/*.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#529BE0",
        secondary: "#F58B3D",
        background: "#FFFFFF",
        text: {
          primary: "#161616",
          secondary: "#757575"
        }
      },
      fontFamily: {
        sans: ["Inter", "Inter var", "Arial", "sans-serif"]
      }
    }
  },
  important: "#root",
  presets: [sharedConfig]
}

export default config
