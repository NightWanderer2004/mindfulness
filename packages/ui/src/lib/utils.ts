import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import openness from '../../assets/icons/openness.png'
import harmony from '../../assets/icons/harmony.png'
import wandering from '../../assets/icons/wandering.png'
import confidence from '../../assets/icons/confidence.png'
import tiredness from '../../assets/icons/tiredness.png'
import softness from '../../assets/icons/softness.png'

import ambient from '../../assets/icons/sounds/ambient.png'
import nature from '../../assets/icons/sounds/nature.png'
import mono from '../../assets/icons/sounds/mono.png'

import sunshine from '../../assets/icons/reminders/sunshine.png'
import blossom from '../../assets/icons/reminders/blossom.png'

import themes from '../../assets/icons/themes.png'
import meditate from '../../assets/icons/meditate.png'
import cogwheel from '../../assets/icons/cogwheel.png'
import sound from '../../assets/icons/sound.png'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transitionBase = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 1.2,
}

export const transitionSmooth = {
  type: 'spring',
  stiffness: 300,
  damping: 35,
  mass: 1.15,
}

export const animations = {
  easing: {
    smooth: [0.19, 1, 0.22, 1],
    breathing: [0.4, 0, 0.6, 1],
  },
  button: {
    whileHover: {
      scale: 1.015,
    },
    whileTap: {
      scale: 0.995,
      opacity: 0.9,
    },
    transition: {
      ...transitionBase,
      backgroundColor: {
        ease: 'easeInOut',
      },
    },
  },

  meditateButton: {
    whileHover: {
      scale: 1.01,
    },
    whileTap: {
      scale: 0.99,
      opacity: 0.9,
    },
    transition: {
      ...transitionSmooth,
    },
  },

  breathingPatterns: {
    equal: {
      duration: 8,
      inhale: 4,
      exhale: 4,
      hold: 0,
      holdAfterExhale: 0,
    },
    relaxing: {
      duration: 19,
      inhale: 4,
      exhale: 8,
      hold: 7,
      holdAfterExhale: 0,
    },
    square: {
      duration: 16,
      inhale: 4,
      exhale: 4,
      hold: 4,
      holdAfterExhale: 4,
    },
    calming: {
      duration: 18,
      inhale: 6,
      exhale: 9,
      hold: 3,
      holdAfterExhale: 0,
    },
  },
}

export const appIcons = {
  themeIcons: {
    openness,
    harmony,
    wandering,
    confidence,
    tiredness,
    softness,
  },

  soundIcons: {
    ambient,
    nature,
    mono,
  },

  reminderIcons: {
    sunshine,
    blossom,
  },

  utility: {
    themes,
    meditate,
    cogwheel,
    sound,
  },
}

export const themeColors = {
  harmony: {
    primary: 'from-amber-200 to-amber-200/0',
    secondary: 'from-amber-100 to-amber-100/0',
    tertiary: 'from-amber-50 to-amber-50/0',
    center: 'bg-amber-50',
  },
  wandering: {
    primary: 'from-blue-300 to-blue-300/0',
    secondary: 'from-blue-200 to-blue-200/0',
    tertiary: 'from-blue-100 to-blue-100/0',
    center: 'bg-blue-50',
  },
  openness: {
    primary: 'from-lime-200 to-lime-200/0',
    secondary: 'from-lime-100 to-lime-100/0',
    tertiary: 'from-lime-50 to-lime-50/0',
    center: 'bg-lime-50',
  },
  confidence: {
    primary: 'from-emerald-200 to-emerald-200/0',
    secondary: 'from-emerald-100 to-emerald-100/0',
    tertiary: 'from-emerald-50 to-emerald-50/0',
    center: 'bg-emerald-50',
  },
  softness: {
    primary: 'from-sky-200 to-sky-200/0',
    secondary: 'from-sky-100 to-sky-100/0',
    tertiary: 'from-sky-50 to-sky-50/0',
    center: 'bg-sky-50',
  },
  tiredness: {
    primary: 'from-red-200 to-red-200/0',
    secondary: 'from-red-100 to-red-100/0',
    tertiary: 'from-red-50 to-red-50/0',
    center: 'bg-red-50',
  },
}

export const themeColorsGradient = {
  harmony: {
    gradient: 'from-amber-300 via-amber-200 to-amber-50',
  },
  wandering: {
    gradient: 'from-blue-400 via-blue-300 to-blue-100',
  },
  openness: {
    gradient: 'from-lime-300 via-lime-200 to-lime-50',
  },
  confidence: {
    gradient: 'from-emerald-300 via-emerald-200 to-emerald-50',
  },
  softness: {
    gradient: 'from-sky-300 via-sky-200 to-sky-50',
  },
  tiredness: {
    gradient: 'from-red-300 via-red-200 to-red-50',
  },
}
