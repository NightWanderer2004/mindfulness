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
        primary: "#529BC0",
        background: "#F4F6FC",
        text: {
          primary: "#344959",
          secondary: "#757575"
        }
      },
      boxShadow: {
        smooth: "0px 0.5px 8px -1px rgba(0, 0, 0, 5%)"
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"]
      },
      backgroundImage: {
        "gradient-custom":
          "linear-gradient(to right, #5093CB, #85B3D9, #75ACDE, #AEC0D6)",
        "sky-bg-popup": "url('/assets/popup-bg.png')",
        "sky-bg-main": "url('/assets/main-bg.png')"
      }
    }
  },
  important: "#root",
  presets: [sharedConfig]
}

export default config
