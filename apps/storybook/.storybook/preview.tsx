import "@repo/ui/styles.css"

import createCache from "@emotion/cache"
import { CacheProvider, ThemeProvider } from "@emotion/react"
import type { Preview } from "@storybook/react"
import { themes } from "@storybook/theming"

import { repoTheme } from "@repo/ui/theme"
import { CssBaseline, StyledEngineProvider } from "@mui/material"

const styleCache = createCache({
  key: "wxt-style",
  prepend: true
})

// LinkedIn-like background color
const linkedInBackgroundColor = "@/f3f2ef"

// Custom theme for docs
const linkedInDocsTheme = {
  ...themes.light
  // appBg: linkedInBackgroundColor,
  // appContentBg: linkedInBackgroundColor,
  // barBg: "@/ffffff"
}

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
      theme: linkedInDocsTheme,
      story: {
        inline: true
      }
    },
    backgrounds: {
      default: "linkedin",
      values: [
        {
          name: "linkedin"
          // value: linkedInBackgroundColor
        }
      ]
    }
  },

  decorators: [
    (Story) => (
      <CacheProvider value={styleCache}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={repoTheme}>
            <CssBaseline />
            <div
              style={{
                minHeight: "50vh",
                padding: "1rem"
              }}>
              <Story />
            </div>
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    )
  ],

  tags: ["autodocs"]
}

export default preview
