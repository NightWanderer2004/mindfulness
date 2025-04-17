import React, { useEffect, useState, useRef, useCallback } from 'react'
import { animations, cn } from '../../lib/utils'
import { motion } from 'framer-motion'
import PauseIcon from '../../../assets/icons/timer/pause.png'
import PlayIcon from '../../../assets/icons/timer/play.png'
import RepeatIcon from '../../../assets/icons/timer/repeat.png'

export interface MeditationTimerProps {
  meditationTimer: number
  theme?: string
  onTimerComplete: () => void
  className?: string
  onPause?: () => void
  onResume?: () => void
  fadeAudioNearEnd?: () => void
  isHovering?: boolean
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Theme colors map
const themeColors = {
  Harmony: 'text-amber-500/90',
  Wandering: 'text-blue-400/90',
  Openness: 'text-lime-500/90',
  Confidence: 'text-emerald-500/90',
  Softness: 'text-blue-400/90',
  Tiredness: 'text-red-400/90',
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  meditationTimer,
  theme,
  onTimerComplete,
  className,
  onPause,
  onResume,
  fadeAudioNearEnd,
  isHovering = false,
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(
    meditationTimer * 60,
  )
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true)
  const [isTimerComplete, setIsTimerComplete] = useState<boolean>(false)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get the current theme color
  const themeColor = theme && themeColors[theme as keyof typeof themeColors]

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
    <motion.div
      className={cn('relative z-50 flex justify-center', className)}
      animate={{ y: isHovering ? 0 : 45 }}
      transition={{ duration: 0.625, ease: animations.easing.smooth }}
    >
      <div className='flex items-center bg-white/[88%] backdrop-blur rounded-2xl shadow-smooth border border-white/35'>
        <button
          onClick={resetTimer}
          className={cn(
            'flex items-center justify-center pr-3 pl-3.5 h-full',
            themeColor,
          )}
          aria-label='Reset timer'
        >
          <img src={RepeatIcon} alt='Refresh' className='size-[21px]' />
        </button>

        <div
          className={cn(
            'text-[28px] leading-none font-medium tabular-nums border-x-[1.5px] border-background/35 py-2 px-2.5',
            themeColor,
          )}
        >
          {formatTime(remainingTime)}
        </div>

        <button
          onClick={toggleTimer}
          className={cn(
            'flex items-center justify-center pl-3 pr-3.5 h-full',
            themeColor,
          )}
          aria-label={isTimerActive ? 'Pause timer' : 'Resume timer'}
        >
          {isTimerActive ? (
            <img src={PauseIcon} alt='Pause' className='size-5' />
          ) : (
            <img src={PlayIcon} alt='Play' className='size-5' />
          )}
        </button>
      </div>
    </motion.div>
  )
}
