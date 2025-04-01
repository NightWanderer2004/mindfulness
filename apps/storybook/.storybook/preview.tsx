import "@repo/ui/styles.css"

import type { Preview } from "@storybook/react"

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      story: {
        inline: true
      }
    },
    backgrounds: {
      default: "empty",
      values: [
        {
          name: "empty"
        }
      ]
    }
  },

  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "50vh",
          padding: "1rem"
        }}>
        <Story />
      </div>
    )
  ],

  tags: ["autodocs"]
}

export default preview
