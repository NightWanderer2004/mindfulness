import { defineConfig } from 'wxt'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tsconfigPaths from 'vite-tsconfig-paths'
import remToPx from '@thedutchcoder/postcss-rem-to-px'
import { resolve } from 'path'

export default defineConfig({
  manifest: {
    permissions: ['storage', 'tabs', 'alarms', 'scripting'],
    host_permissions: ['<all_urls>'],
    name: 'Mindful Tab',
    web_accessible_resources: [
      {
        resources: ['entrypoints/**/*', 'assets/**/*'],
        matches: ['<all_urls>'],
      },
    ],
  },
  chrome_url_overrides: {
    newtab: 'entrypoints/newtab/index.html',
  },
  content: {
    // Add the reminder content script to all pages
    reminder: {
      matches: ['<all_urls>'],
      runAt: 'document_idle',
    },
  },
  modules: ['@wxt-dev/module-react'],
  dev: {
    server: {
      hostname: 'localhost',
      port: 3050,
    },
  },
  runner: {
    disabled: true,
  },

  //@ts-ignore
  vite: () => ({
    plugins: [tsconfigPaths()],
    optimizeDeps: {
      exclude: ['node_modules/.cache', 'node_modules', 'chrome-data'],
    },
    resolve: {
      alias: {
        '@assets': resolve(__dirname, 'assets'),
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer, remToPx],
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === 'SOURCEMAP_ERROR') {
            return
          }
          defaultHandler(warning)
        },
      },
    },
  }),
})
