import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedButton } from './animated-btn'
import { animations } from '../../lib/utils'

export interface ThemeSoundControlsProps {
  theme: string | undefined | null
  soundType: string | undefined | null
  getThemeIcon: () => string
  getSoundIcon: () => string
  onThemeClick: () => void
  onSoundClick: () => void
}

export const ThemeSoundControls: React.FC<ThemeSoundControlsProps> = ({
  theme,
  soundType,
  getThemeIcon,
  getSoundIcon,
  onThemeClick,
  onSoundClick,
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false)

  return (
    <div className='relative max-w-md w-full'>
      <motion.div
        className='relative w-full h-[55px] overflow-hidden'
        transition={{ duration: 0.3, ease: animations.easing.smooth }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <motion.div
          className='absolute w-full flex items-center justify-center bottom-3 pointer-events-none'
          initial={{ opacity: 1 }}
          animate={{
            opacity: isHovering ? 0 : 1,
            y: [-1.35, 1.35, -1.35, 1.35],
          }}
          transition={{
            y: {
              duration: 5.25,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            },
            opacity: { duration: 0.2, ease: 'linear' },
          }}
        >
          <div className='w-12 h-1.5 bg-background/70 rounded-full' />
        </motion.div>

        <motion.div
          className='flex items-end justify-center gap-5'
          initial={{ y: 55 }}
          animate={{ y: isHovering ? 0 : 55 }}
          transition={{ duration: 0.5, ease: animations.easing.smooth }}
        >
          <AnimatedButton
            className='max-w-[180px] !bg-background/90'
            label={theme ? `${theme}` : 'Choose Theme'}
            icon={getThemeIcon()}
            onClick={onThemeClick}
          />
          <AnimatedButton
            className='max-w-[180px] !bg-background/90'
            label={soundType ? `${soundType}` : 'Choose Sound'}
            icon={getSoundIcon()}
            onClick={onSoundClick}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
