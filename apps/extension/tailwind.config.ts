import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'content' | 'presets' | 'important' | 'theme'> = {
  content: [
    './src/cs/**/*.tsx',
    './entrypoints/**/*.tsx',
    '../../packages/ui/src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5093CB',
        background: '#F4F6FC',
        text: {
          primary: '#344959',
          secondary: '#757575',
        },
      },
      boxShadow: {
        smooth: '0px 0.5px 5px -1px rgba(0, 0, 0, 5%)',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'sky-bg-popup': "url('/assets/popup-bg.png')",
        'sky-bg-main': "url('/assets/main-bg.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  important: '#root',
  presets: [sharedConfig],
}

export default config
