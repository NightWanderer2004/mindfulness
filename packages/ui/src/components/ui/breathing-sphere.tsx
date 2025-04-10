import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'

interface BreathingSphereProps {
  theme: string | null
  className?: string
  size?: number
  scaleMin?: number
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
  className,
  size = 40,
  scaleMin = 0.25,
}) => {
  const themeKey = theme?.toLowerCase() || 'openness'
  const colors =
    themeColors[themeKey as keyof typeof themeColors] || themeColors.openness

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

  const breathingAnimation = {
    transition: {
      repeat: Infinity,
      duration: 8,
      ease: animations.easing.breathing,
    },
  }

  const renderSphere = (config: typeof dimensions.outer) => (
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
      animate={{
        scale: [config.scaleMin, config.scaleMax, config.scaleMin],
        opacity: [config.opacityMin, config.opacityMax, config.opacityMin],
      }}
      transition={{
        ...breathingAnimation.transition,
        delay: config.delay,
      }}
    />
  )

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
