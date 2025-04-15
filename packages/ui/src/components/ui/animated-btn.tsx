import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn, animations } from '#lib/utils'

interface AnimatedButtonProps {
  label: string
  icon?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  iconOnly?: boolean
  isAnimated?: boolean
}

export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      label,
      icon,
      onClick,
      className,
      disabled = false,
      iconOnly = false,
      isAnimated = false,
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'text-lg text-text-primary font-medium flex items-center bg-white/85 rounded-2xl px-5 py-1.5 shadow-smooth border border-white/35',
          iconOnly
            ? 'justify-center aspect-square p-2 size-10'
            : 'w-full justify-between',
          className,
        )}
        whileHover={animations.button.whileHover}
        whileTap={animations.button.whileTap}
        transition={animations.button.transition}
        onClick={onClick}
        disabled={disabled}
      >
        {!iconOnly && <span>{label}</span>}
        {icon && (
          <motion.img
            src={icon}
            alt={iconOnly ? label : ''}
            className={cn(
              'pointer-events-none',
              iconOnly ? 'max-w-6 max-h-6' : 'max-w-6 max-h-6',
            )}
            animate={
              isAnimated
                ? {
                    y: [-1.25, 1.25, -1.25, 1.25],
                    rotate: [2.5, -3, 4, -2.5],
                  }
                : undefined
            }
            transition={
              isAnimated
                ? {
                    duration: 5.25,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  }
                : undefined
            }
          />
        )}
      </motion.button>
    )
  },
)
