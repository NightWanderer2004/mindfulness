import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'

interface BreathingSphereProps {
  theme: string | null
  breathingPattern?: string | null
  className?: string
  size?: number
  scaleMin?: number
  isActive?: boolean
}

const themeColors: Record<
  string,
  {
    gradient: string
  }
> = {
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

export const BreathingSphere: React.FC<BreathingSphereProps> = ({
  theme,
  breathingPattern = 'Equal',
  className,
  size = 40,
  scaleMin = 0.25,
  isActive = true,
}) => {
  const themeKey = theme?.toLowerCase() || 'openness'
  const patternKey = breathingPattern?.toLowerCase() || 'equal'
  const colors =
    themeColors[themeKey as keyof typeof themeColors] || themeColors.openness

  const pattern =
    animations.breathingPatterns[
      patternKey as keyof typeof animations.breathingPatterns
    ] || animations.breathingPatterns.equal

  const dimensions = {
    outer: {
      size: `${size}vw`,
      maxSize: `${size * 12.5}px`,
      blur: 12,
      scaleMin: scaleMin,
      scaleMax: 1,
      opacityMin: 0.5,
      opacityMax: 0.8,
      delay: 0,
    },
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
      delay: 0.8,
    },
    core: {
      size: `${size * 0.25}vw`,
      maxSize: `${size * 3.125}px`,
      blur: 4,
      scaleMin: scaleMin,
      scaleMax: 1,
      opacityMin: 0.8,
      opacityMax: 1,
      delay: 1.2,
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
    const afterExhaleFraction = holdAfterExhale / totalDuration

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
          colors?.gradient || 'from-lime-300 via-lime-200 to-lime-50',
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
        'relative flex items-center justify-center w-full h-full',
        className,
      )}
      style={{ transform: 'translateZ(0)' }} // Force hardware acceleration
    >
      {renderSphere(dimensions.outer)}
      {renderSphere(dimensions.middleOuter)}
      {renderSphere(dimensions.middleInner)}
      {renderSphere(dimensions.core)}
    </div>
  )
}
