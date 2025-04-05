import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transitionBase = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1.2
}

export const transitionSmooth = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1.2
}

export const animations = {
  easing: {
    smooth: [0.19, 1, 0.22, 1]
  },
  button: {
    whileHover: {
      scale: 1.015
    },
    whileTap: {
      scale: 0.995,
      opacity: 0.9
    },
    transition: {
      ...transitionBase,
      backgroundColor: {
        ease: "easeInOut"
      }
    }
  },

  meditateButton: {
    whileHover: {
      scale: 1.01
    },
    whileTap: {
      scale: 0.99,
      opacity: 0.9
    },
    transition: {
      ...transitionSmooth
    }
  }
}
