import { dirname, join, resolve } from "path"
import type { StorybookConfig } from "@storybook/react-vite"

function getAbsolutePath(value: any) {
  return dirname(require.resolve(join(value, "package.json")))
}

const config: StorybookConfig = {
  stories: ["../stories/**/*.tsx"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-themes")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {}
  },

  core: {},

  async viteFinal(config, { configType }) {
    return {
      ...config,
      define: { "process.env": {} }
    }
  },

  docs: {}
}

export default config
