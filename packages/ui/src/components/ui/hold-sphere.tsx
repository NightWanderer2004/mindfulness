import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { cn, transitionSmooth } from '../../lib/utils'

interface HoldSphereProps {
  holdDuration: number // Duration in ms
  onComplete?: () => void
  className?: string
}

export const HoldSphere: React.FC<HoldSphereProps> = ({
  holdDuration,
  onComplete,
  className,
}) => {
  const size = 105
  const blurAmount = 8

  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const controls = useAnimation()

  const floatAnimation = useMemo(
    () => ({
      float: {
        y: [0, -5, 0],
        transition: {
          y: {
            repeat: Infinity,
            duration: 2.5,
            ease: 'easeInOut',
            repeatType: 'loop',
          },
        },
      },
      complete: {
        opacity: 0,
        scale: 0.7,
        filter: `blur(${blurAmount * 3.5}px)`,
        y: 0,
        transition: { ...transitionSmooth },
      },
      normal: {
        opacity: 1,
        scale: 1,
        filter: 'none',
        transition: { ...transitionSmooth },
      },
    }),
    [blurAmount],
  )

  useEffect(() => {
    controls.start('float')
  }, [controls])

  useEffect(() => {
    if (complete) {
      controls.start('complete')
    } else {
      controls.start('float')
    }
  }, [complete, controls])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isHolding && !complete) {
        setIsHolding(true)
        setProgress(0)
      }
    },
    [isHolding, complete],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space' && isHolding) {
        setIsHolding(false)

        if (progress < 1) {
          setProgress(0)
        }
      }
    },
    [isHolding, progress],
  )

  useEffect(() => {
    let animationFrameId: number
    let startTime: number

    if (isHolding && progress < 1) {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsedTime = timestamp - startTime

        // Compute linear progress based on elapsed time vs holdDuration
        const newProgress = Math.min(elapsedTime / holdDuration, 1)

        setProgress(newProgress)

        if (newProgress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setComplete(true)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isHolding, holdDuration])

  useEffect(() => {
    if (complete) {
      setShowAlert(true)
      if (onComplete) onComplete()
    }
  }, [complete, onComplete])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return (
    <motion.div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      variants={floatAnimation}
      initial='normal'
      animate={controls}
    >
      {/* Outer sphere container */}
      <motion.div
        className='absolute rounded-full border-4 bg-background/15 border-background/35'
        style={{
          width: size,
          height: size,
          filter: `blur(${blurAmount}px)`,
        }}
        initial={{ opacity: 0.8, scale: 1 }}
        animate={{
          opacity: isHolding ? 1 + progress : 0.8,
          scale: isHolding ? 1 - progress * 1.5 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
      />

      {/* Inner loading sphere (fills up) */}
      <motion.div
        className='absolute rounded-full bg-background'
        style={{
          width: size,
          height: size,
          filter: `blur(${blurAmount * 2.25}px)`,
          transformOrigin: 'center',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: progress * 20,
          opacity: progress * 5,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  )
}
