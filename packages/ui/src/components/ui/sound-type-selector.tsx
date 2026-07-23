import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'
import { PlusFeature } from './plus-feature'

interface IconsMap {
  [key: string]: string
}

interface SoundTypeSelectorProps {
  selectedSoundType: string | null
  setSelectedSoundType?: (soundType: string) => void
  icons: IconsMap
  hasPro: boolean
  onProToggle?: () => void
}

export const SoundTypeSelector: React.FC<SoundTypeSelectorProps> = ({
  selectedSoundType,
  setSelectedSoundType,
  icons,
  hasPro = true,
  onProToggle,
}) => {
  const freeSounds = [
    {
      name: 'Ambient',
      color: 'border-yellow-400/40 bg-yellow-200/20',
      hover: 'hover:border-yellow-300/30 hover:bg-yellow-100/20',
      text: 'text-yellow-600/50',
    },
  ]

  const proSounds = [
    {
      name: 'Nature',
      color: 'border-blue-400/30 bg-blue-200/20',
      hover: 'hover:border-blue-400/20 hover:bg-blue-100/20',
      text: 'text-blue-600/50',
    },
    // {
    //   name: 'Mono',
    //   color: 'border-orange-400/30 bg-orange-200/20',
    //   hover: 'hover:border-orange-400/20 hover:bg-orange-100/20',
    //   text: 'text-orange-600/50',
    // },
  ]

  const renderSoundButton = (soundType: any) => (
    <motion.button
      key={soundType.name}
      whileHover={animations.button.whileHover}
      whileTap={animations.button.whileTap}
      transition={animations.button.transition}
      className={cn(
        'p-1.5 lg:py-3 lg:px-5 rounded-2xl border-2 transition-colors duration-200 w-full flex lg:block items-center gap-2.5 justify-start',
        selectedSoundType === soundType.name
          ? `${soundType.color} shadow-smooth`
          : `border-transparent ${soundType.hover}`,
      )}
      onClick={() => setSelectedSoundType?.(soundType.name)}
    >
      <div className={cn('lg:w-full lg:mb-2 flex items-center justify-center')}>
        <img
          src={icons[soundType.name.toLowerCase()]}
          alt={soundType.name}
          className={cn(
            'size-7 min-w-7 lg:size-16 object-contain pointer-events-none',
          )}
        />
      </div>
      <span className={cn('text-base font-medium', soundType.text)}>
        {soundType.name}
      </span>
    </motion.button>
  )

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 place-items-center gap-1.5 lg:gap-4'>
      {/* Free sounds - always accessible */}
      {freeSounds.map(soundType => renderSoundButton(soundType))}

      {/* Pro sounds - only accessible with Pro or shown with lock */}
      {proSounds.map(soundType => (
        <div key={soundType.name} className='w-full'>
          <PlusFeature isPro={hasPro} feature='themes' onClick={onProToggle}>
            {renderSoundButton(soundType)}
          </PlusFeature>
        </div>
      ))}
    </div>
  )
}
