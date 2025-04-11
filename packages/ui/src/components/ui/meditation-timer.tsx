import React, { useEffect, useState, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { Pause, Play, RefreshCw } from 'lucide-react'

export interface MeditationTimerProps {
  meditationTimer: number
  theme?: string
  onTimerComplete: () => void
  className?: string
  onPause?: () => void
  onResume?: () => void
  fadeAudioNearEnd?: () => void
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  meditationTimer,
  theme,
  onTimerComplete,
  className,
  onPause,
  onResume,
  fadeAudioNearEnd,
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(
    meditationTimer * 60,
  )
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true)
  const [isTimerComplete, setIsTimerComplete] = useState<boolean>(false)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) return

    setIsTimerActive(true)
    if (onResume) onResume()

    timerIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        // Check if there are 3 seconds remaining to fade audio
        if (prev === 4 && fadeAudioNearEnd) {
          fadeAudioNearEnd()
        }

        if (prev <= 1) {
          clearInterval(timerIntervalRef.current as NodeJS.Timeout)
          timerIntervalRef.current = null
          setIsTimerActive(false)
          setIsTimerComplete(true)
          onTimerComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [onTimerComplete, onResume, fadeAudioNearEnd])

  const pauseTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
      setIsTimerActive(false)
      if (onPause) onPause()
    }
  }, [onPause])

  const resetTimer = useCallback(() => {
    pauseTimer()
    setRemainingTime(meditationTimer * 60)
    setIsTimerComplete(false)
  }, [meditationTimer, pauseTimer])

  const toggleTimer = useCallback(() => {
    if (isTimerActive) {
      pauseTimer()
    } else {
      startTimer()
    }
  }, [isTimerActive, pauseTimer, startTimer])

  useEffect(() => {
    startTimer()

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [startTimer])

  useEffect(() => {
    resetTimer()
    startTimer()
  }, [meditationTimer, resetTimer, startTimer])

  return (
    <div className={cn('flex flex-col items-center mb-3', className)}>
      <div className='flex items-center gap-2.5 justify-center'>
        <button
          onClick={resetTimer}
          className='bg-background/95 hover:bg-background/40 text-text-primary p-2 rounded-xl transition-colors'
          aria-label='Reset timer'
        >
          <RefreshCw strokeWidth={2.5} size={18} />
        </button>

        <div className='relative min-w-[120px] text-center'>
          <div className='absolute inset-0 bg-white/85 rounded-2xl shadow-smooth border border-white/35' />
          <div
            className={cn(
              'relative z-20 text-2xl text-text-primary font-medium px-5 py-1.5 font-variant-numeric tabular-nums',
            )}
          >
            {formatTime(remainingTime)}
          </div>
        </div>

        <button
          onClick={toggleTimer}
          className='bg-background/95 hover:bg-background/40 text-text-primary p-2 rounded-xl transition-colors'
          aria-label={isTimerActive ? 'Pause timer' : 'Resume timer'}
        >
          {isTimerActive ? (
            <Pause fill='text-text-primary' size={18} />
          ) : (
            <Play fill='text-text-primary' size={18} />
          )}
        </button>
      </div>
    </div>
  )
}
