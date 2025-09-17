import React from 'react'
import { cn, animations } from '../../lib/utils'
import { motion } from 'framer-motion'

interface MeditateButtonProps {
  icon: string
  label?: string
  onClick?: () => void
  className?: string
}

export const MeditateButton: React.FC<MeditateButtonProps> = ({
  icon,
  label = 'Relax Now',
  onClick,
  className,
}) => {
  return (
    <motion.button
      className={cn(
        'w-full py-4 bg-primary/10 rounded-xl shadow-smooth flex flex-col items-center justify-center border-[1.5px] border-primary/5',
        className,
      )}
      whileHover={animations.meditateButton.whileHover}
      whileTap={animations.meditateButton.whileTap}
      transition={animations.meditateButton.transition}
      onClick={onClick}
    >
      <motion.img
        src={icon}
        alt={label}
        className='size-9 opacity-90 pointer-events-none'
        animate={{
          y: [-1.25, 1.25, -1.25, 1.25],
          rotate: [2.5, -3, 4, -2.5],
        }}
        transition={{
          duration: 5.25,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />
      <span className='text-xl mt-0.5 text-primary/90 font-medium'>
        {label}
      </span>
    </motion.button>
  )
}
