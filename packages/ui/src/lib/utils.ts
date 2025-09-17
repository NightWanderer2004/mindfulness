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
import pro from '../../assets/icons/pro.png'

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
    breathing: [0.25, 0.1, 0.25, 1],
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
    pro,
  },
}

// Chrome extension types and utilities
export interface ChromeTab {
  id?: number
  url?: string
  active: boolean
  [key: string]: any
}

// Check if a meditation session is active
export const checkSessionStatus = (
  setIsSessionActive: (isActive: boolean) => void,
) => {
  if (
    typeof window.chrome !== 'undefined' &&
    window.chrome.tabs &&
    window.chrome.runtime
  ) {
    window.chrome.tabs.query(
      { url: window.chrome.runtime.getURL('session.html') },
      (tabs: ChromeTab[]) => {
        setIsSessionActive(tabs.length > 0)
      },
    )
  }
}

// Fix Chrome types error
declare global {
  interface Window {
    chrome: any
  }
}
