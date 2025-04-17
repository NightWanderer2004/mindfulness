import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { animations, cn, animations as animationsData } from '../../lib/utils'
import { CustomBreathingPattern } from './custom-breathing-pattern'
import { PlusFeature } from './plus-feature'

interface BreathingPatternSelectorProps {
  selectedPattern: string | null
  setSelectedPattern?: (pattern: string) => void
  icons?: Record<string, string>
  customPatterns?: Record<string, any>
  onAddCustomPattern?: (name: string, config: any) => void
  onRemoveCustomPattern?: (name: string) => void
  hasPro?: boolean
  onProToggle?: () => void
}

export const BreathingPatternSelector: React.FC<
  BreathingPatternSelectorProps
> = ({
  selectedPattern,
  setSelectedPattern,
  customPatterns = {},
  onAddCustomPattern,
  onRemoveCustomPattern,
  hasPro = false,
  onProToggle,
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false)
  const customPatternCount = Object.keys(customPatterns).length

  // Get breathing patterns directly from utils.ts
  const defaultPatterns = Object.entries(animationsData.breathingPatterns).map(
    ([key, pattern]) => {
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        isCustom: false,
      }
    },
  )

  // Add custom patterns if any
  const customPatternsList = Object.entries(customPatterns).map(([name]) => {
    return {
      name,
      isCustom: true,
    }
  })

  const allPatterns = [...defaultPatterns, ...customPatternsList]

  // Get existing pattern names for validation
  const existingPatternNames = allPatterns.map(p => p.name)

  const handleAddCustomPattern = (name: string, config: any) => {
    if (onAddCustomPattern && customPatternCount < 2) {
      onAddCustomPattern(name, config)
      setShowCustomForm(false)
      // Automatically select the newly added pattern
      if (setSelectedPattern) {
        setSelectedPattern(name)
      }
    }
  }

  const handleRemovePattern = (name: string) => {
    if (onRemoveCustomPattern) {
      onRemoveCustomPattern(name)
    }
  }

  // Toggle custom pattern form
  const toggleCustomForm = () => {
    if (!hasPro) {
      // If not Pro, show upgrade dialog
      if (onProToggle) onProToggle()
      return
    }
    setShowCustomForm(!showCustomForm)
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-2 lg:gap-4 place-items-center'>
        {allPatterns.map(pattern => (
          <div key={pattern.name} className='w-full relative'>
            <motion.button
              whileHover={animations.button.whileHover}
              whileTap={animations.button.whileTap}
              transition={animations.button.transition}
              className={cn(
                'p-1.5 md:py-2 md:px-4 rounded-2xl border-2 transition-colors duration-200 w-full',
                selectedPattern === pattern.name
                  ? 'border-primary/30 bg-primary/10 shadow-sm'
                  : 'border-transparent hover:bg-primary/5',
              )}
              onClick={() => setSelectedPattern?.(pattern.name)}
            >
              <span
                className={cn(
                  'text-base md:text-lg font-medium text-primary/90',
                )}
              >
                {pattern.name}
              </span>
            </motion.button>
            {pattern.isCustom && (
              <button
                className='absolute -top-1 -right-1 size-4 bg-primary/80 hover:bg-primary transition-colors duration-200 text-white leading-none rounded-full flex items-center justify-center'
                onClick={() => handleRemovePattern(pattern.name)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='size-4 fill-white p-0.5'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='1.5'
                >
                  <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <PlusFeature
        isPro={hasPro}
        feature='custom-breathing'
        onClick={onProToggle}
        className='hidden md:block w-full'
      >
        <div
          className={cn(
            'p-2.5 bg-primary/5 rounded-2xl border-2 shadow-smooth transition-colors duration-200',
            showCustomForm ? 'border-primary/30' : 'border-primary/15',
          )}
        >
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-base font-medium text-primary/90'>
                Custom Breathing Pattern
                <span className='text-sm font-normal ml-1 text-primary/70'>
                  ({customPatternCount}/2)
                </span>
              </h3>
            </div>
            {customPatternCount < 2 && (
              <motion.button
                whileHover={animations.button.whileHover}
                whileTap={animations.button.whileTap}
                transition={animations.button.transition}
                className='px-3 py-1.5 rounded-xl bg-primary/85 text-white text-base'
                onClick={toggleCustomForm}
              >
                {showCustomForm ? 'Cancel' : 'Create'}
              </motion.button>
            )}
          </div>

          {showCustomForm && (
            <div className='mt-3 pt-3 border-t border-primary/15'>
              <CustomBreathingPattern
                onAdd={handleAddCustomPattern}
                existingPatterns={existingPatternNames}
                onCancel={() => setShowCustomForm(false)}
                customPatternCount={customPatternCount}
                maxAllowedPatterns={2}
              />
            </div>
          )}
        </div>
      </PlusFeature>
    </div>
  )
}
