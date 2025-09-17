import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { animations, cn, transitionSmooth } from '../../lib/utils'

interface HoldSphereProps {
  holdDuration: number // Duration in ms
  onComplete: () => void
  className?: string
}

export const HoldSphere: React.FC<HoldSphereProps> = ({
  holdDuration,
  onComplete,
  className,
}) => {
  const size = 105
  const blurAmount = 6

  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)

  const controls = useAnimation()

  const floatAnimation = useMemo(
    () => ({
      float: {
        y: [0, -4, 0],
        rotate: [0, 180, 0],
        transition: {
          y: {
            repeat: Infinity,
            duration: 5.5,
            ease: 'easeInOut',
            repeatType: 'loop',
          },
          rotate: {
            repeat: Infinity,
            duration: 20,
            ease: 'easeInOut',
            repeatType: 'loop',
          },
        },
      },
      normal: {
        opacity: 1,
        scale: 1,
        filter: 'none',
        transition: { ...transitionSmooth },
      },
    }),
    [],
  )

  useEffect(() => {
    controls.start('float')
  }, [controls])

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
    if (complete) onComplete()
  }, [complete])

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
      {/* Central glow */}
      <motion.div
        className='absolute rounded-full bg-orange-50/90'
        style={{
          width: size * 0.4,
          height: size * 0.4,
          filter: `blur(${blurAmount * 0.6}px)`,
          zIndex: 10,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHolding ? 0.9 + progress * 0.1 : 0.7,
          scale: isHolding ? 1 + progress * 4.25 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: animations.easing.smooth,
        }}
      />

      {/* Outer sphere container */}
      <motion.div
        className='absolute rounded-full border-4 bg-background/[16.5%] border-background/35 shadow-[inset_1.5px_2px_0_2px_rgba(255,251,238,1),inset_-2px_-4px_0_1.5px_rgba(255,255,255,0.75)]'
        style={{
          width: size,
          height: size,
          filter: `blur(${blurAmount}px)`,
          zIndex: 2,
        }}
        initial={{ opacity: 0.8, scale: 1 }}
        animate={{
          opacity: isHolding ? 1 + progress : 0.8,
          scale: isHolding ? 1 - progress * 1.5 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: animations.easing.smooth,
        }}
      />

      {/* Inner loading sphere (fills up) */}
      <motion.div
        className='absolute rounded-full bg-[#fff0dc]'
        style={{
          width: size,
          height: size,
          filter: `blur(${blurAmount * 1.75}px)`,
          transformOrigin: 'center',
          zIndex: 1,
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
