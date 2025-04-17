import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'

// Define the breathing pattern config locally to avoid dependency issues
interface BreathingPatternConfig {
  duration: number
  inhale: number
  exhale: number
  hold: number
  holdAfterExhale: number
}

interface CustomBreathingPatternProps {
  onAdd: (name: string, config: BreathingPatternConfig) => void
  existingPatterns: string[]
  onCancel?: () => void
  customPatternCount?: number
  maxAllowedPatterns?: number
}

interface TimeInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 15,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (newValue < min) {
      onChange(min)
    } else if (newValue > max) {
      onChange(max)
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className='flex flex-col items-start justify-center gap-1'>
      <label className='text-base font-medium text-primary/90'>{label}</label>
      <div className='flex items-center gap-1.5'>
        <input
          type='number'
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className='w-auto pl-3 py-0.5 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-sm text-center'
        />
        <span className='text-base mb-0.5 text-primary/90'>sec</span>
      </div>
    </div>
  )
}

export const CustomBreathingPattern: React.FC<CustomBreathingPatternProps> = ({
  onAdd,
  existingPatterns,
  onCancel,
  customPatternCount = 0,
  maxAllowedPatterns = 2,
}) => {
  const [name, setName] = useState('')
  const [inhale, setInhale] = useState(2)
  const [exhale, setExhale] = useState(2)
  const [hold, setHold] = useState(0)
  const [holdAfterExhale, setHoldAfterExhale] = useState(0)

  const isLimitReached = customPatternCount >= maxAllowedPatterns

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 8) {
      setName(value)
    }
  }

  const isNameValid =
    name.trim() !== '' &&
    !existingPatterns.map(pattern => pattern.trim()).includes(name.trim())
  const isConfigValid =
    inhale >= 2 &&
    inhale <= 15 &&
    exhale >= 2 &&
    exhale <= 15 &&
    hold >= 0 &&
    hold <= 15 &&
    holdAfterExhale >= 0 &&
    holdAfterExhale <= 15

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isNameValid || !isConfigValid || isLimitReached) return

    const duration = inhale + exhale + hold + holdAfterExhale

    onAdd(name, {
      duration,
      inhale,
      exhale,
      hold,
      holdAfterExhale,
    })

    // Reset form
    setName('')
    setInhale(2)
    setExhale(2)
    setHold(0)
    setHoldAfterExhale(0)
  }

  if (isLimitReached) {
    return (
      <div className='p-4 text-center'>
        <p className='text-primary/90 mb-2'>
          Maximum custom patterns limit reached (2).
        </p>
        <p className='text-primary/70 text-sm'>
          Delete an existing pattern to create a new one.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div className='flex gap-3 items-center'>
        <label className='block whitespace-nowrap text-base font-medium text-primary/90'>
          Pattern name
        </label>
        <input
          type='text'
          value={name}
          onChange={handleNameChange}
          maxLength={8}
          className={cn(
            'w-full font-medium px-3 py-2 border border-primary/20 rounded-xl placeholder:text-sm text-sm bg-background/50 transition-all duration-300',
            name && !isNameValid
              ? 'border-red-500 outline-none ring-red-500'
              : 'focus:outline-none focus:ring-primary/30',
          )}
          placeholder='My Pattern'
        />
      </div>

      <div className='grid grid-cols-2'>
        <TimeInput label='Inhale' value={inhale} onChange={setInhale} min={2} />

        <TimeInput label='Exhale' value={exhale} onChange={setExhale} min={2} />
      </div>
      <div className='grid grid-cols-2'>
        <TimeInput label='Hold After Inhale' value={hold} onChange={setHold} />

        <TimeInput
          label='Hold After Exhale'
          value={holdAfterExhale}
          onChange={setHoldAfterExhale}
        />
      </div>

      <div className='flex justify-end gap-2 pt-2'>
        <motion.button
          type='submit'
          disabled={!isNameValid || !isConfigValid}
          whileHover={animations.button.whileHover}
          whileTap={animations.button.whileTap}
          transition={animations.button.transition}
          className={cn(
            'w-full px-3 py-1.5 rounded-xl text-base',
            isNameValid && isConfigValid
              ? 'bg-primary/85 hover:bg-primary text-white border-transparent'
              : 'bg-primary/30 text-white/80 cursor-not-allowed border-transparent',
          )}
        >
          Add Pattern
        </motion.button>
      </div>
    </form>
  )
}
