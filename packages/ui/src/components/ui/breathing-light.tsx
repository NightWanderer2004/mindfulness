import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'

interface BreathingLightProps {
  theme: string | null
  breathingPattern?: string | null
  className?: string
  size?: number
  scaleMin?: number
  isActive?: boolean
}

const themeColors = {
  harmony: {
    primary: 'from-amber-200 to-amber-200/10',
    secondary: 'from-amber-100 to-amber-100/10',
    tertiary: 'from-amber-50 to-amber-50/10',
    center: 'bg-amber-50',
  },
  wandering: {
    primary: 'from-blue-300 to-blue-300/10',
    secondary: 'from-blue-200 to-blue-200/10',
    tertiary: 'from-blue-100 to-blue-100/10',
    center: 'bg-blue-50',
  },
  openness: {
    primary: 'from-lime-200 to-lime-200/10',
    secondary: 'from-lime-100 to-lime-100/10',
    tertiary: 'from-lime-50 to-lime-50/10',
    center: 'bg-lime-50',
  },
  confidence: {
    primary: 'from-emerald-200 to-emerald-200/10',
    secondary: 'from-emerald-100 to-emerald-100/10',
    tertiary: 'from-emerald-50 to-emerald-50/10',
    center: 'bg-emerald-50',
  },
  softness: {
    primary: 'from-sky-200 to-sky-200/10',
    secondary: 'from-sky-100 to-sky-100/10',
    tertiary: 'from-sky-50 to-sky-50/10',
    center: 'bg-sky-50',
  },
  tiredness: {
    primary: 'from-red-200 to-red-200/10',
    secondary: 'from-red-100 to-red-100/10',
    tertiary: 'from-red-100 to-red-100/10',
    center: 'bg-red-50',
  },
}

type ThemeKey = keyof typeof themeColors

export const BreathingLight: React.FC<BreathingLightProps> = ({
  theme,
  breathingPattern = 'Equal',
  className,
  size = 40,
  scaleMin = 0.25,
  isActive = true,
}) => {
  const normalizedTheme = theme?.toLowerCase() || ''
  const themeKey = (
    Object.keys(themeColors).includes(normalizedTheme)
      ? normalizedTheme
      : 'openness'
  ) as ThemeKey

  const patternKey = breathingPattern?.toLowerCase() || 'equal'

  const themeColorSet = themeColors[themeKey]

  const pattern =
    animations.breathingPatterns[
      patternKey as keyof typeof animations.breathingPatterns
    ] || animations.breathingPatterns.equal

  const lightConfigs = [
    {
      size: size * 1.5,
      delay: 0,
      colorClass: themeColorSet.primary,
      baseOpacity: 0.9,
      blur: 40,
      scaleRange: [scaleMin, 0.9],
    },
    {
      size: size * 1.1,
      delay: 0.2,
      colorClass: themeColorSet.secondary,
      baseOpacity: 0.95,
      blur: 35,
      scaleRange: [scaleMin + 0.05, 0.85],
    },
    {
      size: size * 0.8,
      delay: 0.4,
      colorClass: themeColorSet.tertiary,
      baseOpacity: 1.0,
      blur: 25,
      scaleRange: [scaleMin + 0.1, 0.75],
    },
  ]

  const createBreathingKeyframes = (config: (typeof lightConfigs)[0]) => {
    const { inhale, exhale, hold, holdAfterExhale } = pattern
    const totalDuration = pattern.duration
    const [minScale, maxScale] = config.scaleRange

    const inhaleFraction = inhale / totalDuration
    const holdFraction = hold / totalDuration
    const exhaleFraction = exhale / totalDuration

    const inhaleDone = inhaleFraction
    const holdDone = inhaleDone + holdFraction
    const exhaleDone = holdDone + exhaleFraction

    if (hold > 0 || holdAfterExhale > 0) {
      return {
        scale: [minScale, maxScale, maxScale, minScale, minScale],
        opacity: [
          config.baseOpacity * 0.7,
          config.baseOpacity,
          config.baseOpacity,
          config.baseOpacity * 0.7,
          config.baseOpacity * 0.7,
        ],
        times: [0, inhaleDone, holdDone, exhaleDone, 1],
      }
    } else {
      return {
        scale: [minScale, maxScale, minScale],
        opacity: [
          config.baseOpacity * 0.7,
          config.baseOpacity,
          config.baseOpacity * 0.7,
        ],
        times: [0, inhaleFraction, 1],
      }
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-full h-full',
        className,
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      {lightConfigs.map((config, index) => {
        const keyframes = createBreathingKeyframes(config)
        const waveSize = `${config.size}vw`
        const maxWaveSize = `${config.size * 12.5}px`

        return (
          <motion.div
            key={index}
            className={cn(
              'absolute rounded-full bg-gradient-radial',
              config.colorClass,
            )}
            style={{
              width: waveSize,
              height: waveSize,
              maxWidth: maxWaveSize,
              maxHeight: maxWaveSize,
              filter: `blur(${config.blur}px)`,
            }}
            initial={{
              scale: config.scaleRange[0],
              opacity: config.baseOpacity * 0.7,
              borderRadius: '100%',
            }}
            animate={
              isActive
                ? keyframes
                : {
                    scale: config.scaleRange[0],
                    opacity: config.baseOpacity * 0.7,
                    borderRadius: '100%',
                  }
            }
            transition={
              isActive
                ? {
                    repeat: Infinity,
                    duration: pattern.duration,
                    ease: animations.easing.breathing,
                    delay: config.delay,
                  }
                : { type: 'spring', stiffness: 100, damping: 25, duration: 0.5 }
            }
          />
        )
      })}

      {/* Central glow */}
      <motion.div
        className={cn(
          'absolute rounded-full bg-gradient-radial from-white to-transparent',
        )}
        style={{
          width: `${size * 0.35}vw`,
          height: `${size * 0.35}vw`,
          maxWidth: `${size * 4.375}px`,
          maxHeight: `${size * 4.375}px`,
          filter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
        }}
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={
          isActive
            ? {
                scale: [0.85, 1.1, 0.85],
                opacity: [0.7, 0.9, 0.7],
              }
            : { scale: 0.85, opacity: 0.7 }
        }
        transition={
          isActive
            ? {
                repeat: Infinity,
                duration: pattern.duration,
                ease: animations.easing.breathing,
              }
            : { type: 'spring', stiffness: 100, damping: 25, duration: 0.5 }
        }
      />

      {/* Central dot */}
      <motion.div
        className={cn('absolute rounded-full', themeColorSet.center)}
        style={{
          width: `${size * 0.15}vw`,
          height: `${size * 0.15}vw`,
          maxWidth: `${size * 1.875}px`,
          maxHeight: `${size * 1.875}px`,
          filter: 'blur(10px)',
        }}
        initial={{ scale: 0.9, opacity: 0.5 }}
        animate={
          isActive
            ? {
                scale: [0.9, 1.1, 0.9],
                opacity: [0.5, 0.8, 0.5],
              }
            : { scale: 0.9, opacity: 0.5 }
        }
        transition={
          isActive
            ? {
                repeat: Infinity,
                duration: pattern.duration,
                ease: animations.easing.breathing,
              }
            : { type: 'spring', stiffness: 100, damping: 25, duration: 0.5 }
        }
      />
    </div>
  )
}
