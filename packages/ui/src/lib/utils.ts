import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const animations = {
  button: {
    whileHover: {
      scale: 1.01,
      backgroundColor: "rgba(255, 255, 255, 0.9)"
    },
    whileTap: {
      scale: 0.995,
      opacity: 0.9
    },
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 1.2
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
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 0.8
    }
  }
}
