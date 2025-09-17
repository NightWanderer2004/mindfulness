import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'

interface BreathingPatternConfig {
  duration: number
  inhale: number
  exhale: number
  hold: number
  holdAfterExhale: number
}

interface BreathingSphereProps {
  theme: string | null
  breathingPattern?: string | null
  className?: string
  size?: number
  scaleMin?: number
  isActive?: boolean
  customPatterns?: Record<string, BreathingPatternConfig>
}

// Note: themeColorsGradient is defined locally instead of importing from utils
// because importing causes styling issues with Tailwind CSS gradients
const themeColorsGradient = {
  harmony: {
    gradient: 'from-amber-300 via-amber-200 to-amber-100',
  },
  wandering: {
    gradient: 'from-blue-400 via-blue-300 to-blue-50',
  },
  openness: {
    gradient: 'from-lime-300 via-lime-200 to-lime-50',
  },
  confidence: {
    gradient: 'from-green-300 via-green-200 to-green-50',
  },
  softness: {
    gradient: 'from-sky-300 via-sky-200 to-sky-50',
  },
  tiredness: {
    gradient: 'from-red-400 via-red-300 to-red-100',
  },
}

export const BreathingSphere: React.FC<BreathingSphereProps> = ({
  theme,
  breathingPattern,
  className,
  size = 40,
  scaleMin = 0.25,
  isActive = true,
  customPatterns = {},
}) => {
  const themeKey = theme?.toLowerCase() || 'openness'
  const patternKey = breathingPattern?.toLowerCase() || 'equal'
  const colors =
    themeColorsGradient[themeKey as keyof typeof themeColorsGradient] ||
    themeColorsGradient.openness

  // Check if this is a custom pattern
  const customPattern = customPatterns[breathingPattern || '']

  // Use custom pattern if available, otherwise use default
  const pattern =
    customPattern ||
    animations.breathingPatterns[
      patternKey as keyof typeof animations.breathingPatterns
    ] ||
    animations.breathingPatterns.equal

  const dimensions = {
    middleOuter: {
      size: `${size * 0.75}vw`,
      maxSize: `${size * 9.375}px`,
      blur: 10,
      scaleMin: scaleMin,
      scaleMax: 1,
      opacityMin: 0.6,
      opacityMax: 0.9,
      delay: 0.4,
    },
    middleInner: {
      size: `${size * 0.5}vw`,
      maxSize: `${size * 6.25}px`,
      blur: 8,
      scaleMin: scaleMin,
      scaleMax: 1,
      opacityMin: 0.7,
      opacityMax: 0.95,
      delay: 0.6,
    },
    core: {
      size: `${size * 0.25}vw`,
      maxSize: `${size * 4.25}px`,
      blur: 4,
      scaleMin: scaleMin,
      scaleMax: 1,
      opacityMin: 0.8,
      opacityMax: 1,
      delay: 1,
    },
  }

  // Create keyframes based on breathing pattern
  const createBreathingKeyframes = (config: typeof dimensions.outer) => {
    const { inhale, exhale, hold, holdAfterExhale } = pattern
    const totalDuration = pattern.duration

    // Calculate time points for animation keyframes (0 to 1 scale)
    const inhaleFraction = inhale / totalDuration
    const holdFraction = hold / totalDuration
    const exhaleFraction = exhale / totalDuration

    // Accumulate for keyframe positions
    const inhaleDone = inhaleFraction
    const holdDone = inhaleDone + holdFraction
    const exhaleDone = holdDone + exhaleFraction
    // Last one implicitly goes to 1.0 (afterExhaleDone)

    // Define keyframes based on breathing pattern
    if (hold > 0 || holdAfterExhale > 0) {
      // Pattern with holds (e.g. box breathing)
      return {
        scale: [
          config.scaleMin, // Start (exhaled)
          config.scaleMax, // After inhale
          config.scaleMax, // After hold
          config.scaleMin, // After exhale
          config.scaleMin, // After hold after exhale
        ],
        opacity: [
          config.opacityMin, // Start
          config.opacityMax, // After inhale
          config.opacityMax, // After hold
          config.opacityMin, // After exhale
          config.opacityMin, // After hold after exhale
        ],
        times: [0, inhaleDone, holdDone, exhaleDone, 1],
      }
    } else {
      // Simple inhale/exhale pattern
      return {
        scale: [
          config.scaleMin, // Start (exhaled)
          config.scaleMax, // After inhale
          config.scaleMin, // After exhale
        ],
        opacity: [
          config.opacityMin, // Start
          config.opacityMax, // After inhale
          config.opacityMin, // After exhale
        ],
      }
    }
  }

  const breathingAnimation = {
    transition: {
      repeat: Infinity,
      duration: pattern.duration,
      ease: animations.easing.breathing,
    },
  }

  const renderSphere = (config: typeof dimensions.outer) => {
    const keyframes = createBreathingKeyframes(config)

    return (
      <motion.div
        className={cn(
          'absolute rounded-full bg-gradient-radial',
          colors?.gradient,
        )}
        style={{
          width: config.size,
          height: config.size,
          maxWidth: config.maxSize,
          maxHeight: config.maxSize,
          filter: `blur(${config.blur}px)`,
        }}
        initial={{ scale: config.scaleMin, opacity: config.opacityMin }}
        animate={
          isActive
            ? keyframes
            : { scale: config.scaleMin, opacity: config.opacityMin }
        }
        transition={
          isActive
            ? {
                ...breathingAnimation.transition,
                delay: config.delay,
              }
            : { type: 'spring', stiffness: 100, damping: 25, duration: 0.5 }
        }
      />
    )
  }

  return (
    <div
      className={cn(
        'relative pointer-events-none flex items-center justify-center w-full h-full',
        className,
      )}
      style={{ transform: 'translateZ(0px)' }} // Force hardware acceleration
    >
      {renderSphere(dimensions.middleOuter)}
      {renderSphere(dimensions.middleInner)}
      {renderSphere(dimensions.core)}
    </div>
  )
}
