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
