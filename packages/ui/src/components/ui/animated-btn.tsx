import React, { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn, animations } from "#lib/utils"

interface AnimatedButtonProps {
  label: string
  icon: string
  onClick?: () => void
  className?: string
}

export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ label, icon, onClick, className }, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        "w-full flex items-center justify-between bg-white/85 rounded-2xl px-5 py-1.5 shadow-smooth border border-white/35",
        className
      )}
      whileHover={animations.button.whileHover}
      whileTap={animations.button.whileTap}
      transition={animations.button.transition}
      onClick={onClick}>
      <span className="text-lg text-text-primary font-medium">{label}</span>
      <img src={icon} alt="" className="w-6 h-full pointer-events-none" />
    </motion.button>
  )
})
