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
  const predefinedTimers = [2, 5, 8, 10, 12, 15]

  return (
    <div className='flex flex-wrap gap-2 justify-center'>
      {predefinedTimers.map(timer => (
        <button
          key={timer}
          onClick={() => setSelectedTimer(timer)}
          className={cn(
            'flex items-center justify-center px-4 py-2 text-base rounded-lg transition-colors',
            selectedTimer === timer
              ? 'bg-primary/20 text-primary font-medium'
              : 'text-primary/60 hover:text-primary/80 hover:bg-primary/10',
          )}
        >
          {timer} min
        </button>
      ))}
    </div>
  )
}
