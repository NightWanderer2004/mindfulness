import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn, animations as animationsData } from '../../lib/utils'

interface BreathingPatternSelectorProps {
  selectedPattern: string | null
  setSelectedPattern?: (pattern: string) => void
  icons?: Record<string, string>
}

export const BreathingPatternSelector: React.FC<
  BreathingPatternSelectorProps
> = ({ selectedPattern, setSelectedPattern }) => {
  // Get breathing patterns directly from utils.ts
  const breathingPatterns = Object.entries(
    animationsData.breathingPatterns,
  ).map(([key, pattern]) => {
    const { inhale, exhale, hold, holdAfterExhale } = pattern

    // Generate description dynamically based on pattern values
    let description = `${inhale}s inhale`
    if (hold > 0) description += `, ${hold}s hold`
    description += `, ${exhale}s exhale`
    if (holdAfterExhale > 0) description += `, ${holdAfterExhale}s hold`

    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      description,
    }
  })

  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-2 gap-2 lg:gap-4 place-items-center'>
        {breathingPatterns.map(pattern => (
          <motion.button
            key={pattern.name}
            whileHover={animations.button.whileHover}
            whileTap={animations.button.whileTap}
            transition={animations.button.transition}
            className={cn(
              'p-1.5 md:py-2.5 md:px-4 rounded-xl border-2 transition-colors duration-200 w-full',
              selectedPattern === pattern.name
                ? 'border-primary/30 bg-primary/10 shadow-sm'
                : 'border-transparent hover:bg-primary/5',
            )}
            onClick={() => setSelectedPattern?.(pattern.name)}
          >
            <span
              className={cn('text-base md:text-lg font-medium text-primary/90')}
            >
              {pattern.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
