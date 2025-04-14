'use client'
import React from 'react'
import { cn } from '../../lib/utils'

type IconsType = Record<string, React.ReactNode>

interface TimerSelectorProps {
  selectedTimer: number | null
  setSelectedTimer: (timer: number) => void
  icons: IconsType
}

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  selectedTimer,
  setSelectedTimer,
  icons,
}) => {
  const predefinedTimers = [2, 4, 6, 8]

  return (
    <div className='grid grid-cols-2 gap-2 justify-center'>
      {predefinedTimers.map(timer => (
        <button
          key={timer}
          onClick={() => setSelectedTimer(timer)}
          className={cn(
            'p-1.5 rounded-xl border-2 transition-colors duration-200 w-full',
            selectedTimer === timer
              ? 'border-primary/30 bg-primary/10 shadow-sm'
              : 'border-transparent hover:bg-primary/5',
          )}
        >
          <span className={cn('text-base font-medium text-primary/90')}>
            {timer} min
          </span>
        </button>
      ))}
    </div>
  )
}
