'use client'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, animations } from '../../lib/utils'

interface FlashScreenProps {
  isActive: boolean
  onFlashComplete?: () => void
  duration?: number
  className?: string
}

export const FlashScreen: React.FC<FlashScreenProps> = ({
  isActive,
  onFlashComplete,
  duration = 1500,
  className,
}) => {
  useEffect(() => {
    let closeTimer: NodeJS.Timeout | null = null

    if (isActive && onFlashComplete) {
      closeTimer = setTimeout(() => {
        onFlashComplete()
      }, duration)
    }

    return () => {
      if (closeTimer) clearTimeout(closeTimer)
    }
  }, [isActive, duration, onFlashComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <div className='fixed inset-0 flex items-center justify-center overflow-hidden z-[9999] pointer-events-none'>
          {/* Central glowing sphere that expands */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 40,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.5,
                duration: 0.5,
              },
            }}
            transition={{
              scale: {
                duration: 1.5,
                ease: animations.easing.breathing,
              },
              opacity: {
                duration: 0.3,
              },
            }}
            className={cn(
              'h-[100px] w-[100px] rounded-full bg-[#fff0dc]',
              className,
            )}
            style={{
              filter: 'blur(15px)',
              transformOrigin: 'center',
            }}
          />

          {/* Inner brighter core */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 30,
              opacity: 0.9,
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.3,
                duration: 0.3,
              },
            }}
            transition={{
              scale: {
                duration: 1.3,
                ease: animations.easing.breathing,
              },
              opacity: {
                duration: 0.5,
              },
            }}
            className='absolute h-[80px] w-[80px] rounded-full bg-white'
            style={{
              filter: 'blur(8px)',
              transformOrigin: 'center',
            }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}
