import { defineConfig } from 'wxt'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tsconfigPaths from 'vite-tsconfig-paths'
import remToPx from '@thedutchcoder/postcss-rem-to-px'
import { resolve } from 'path'

export default defineConfig({
  manifest: {
    permissions: ['storage'],
    name: 'Mindful Tab',
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
