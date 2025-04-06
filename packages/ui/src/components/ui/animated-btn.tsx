import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn, animations } from '#lib/utils'

interface AnimatedButtonProps {
  label: string
  icon?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ label, icon, onClick, className, disabled = false }, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        'text-lg text-text-primary font-medium w-full flex items-center justify-between bg-white/85 rounded-2xl px-5 py-1.5 shadow-smooth border border-white/35',
        className,
      )}
      whileHover={animations.button.whileHover}
      whileTap={animations.button.whileTap}
      transition={animations.button.transition}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{label}</span>
      {icon && (
        <img
          src={icon}
          alt=''
          className='max-w-6 max-h-6 pointer-events-none'
        />
      )}
    </motion.button>
  )
})
