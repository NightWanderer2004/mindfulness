import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'

interface IconsMap {
  [key: string]: string
}

interface SphereSelectorProps {
  selectedSphereType: string | null
  setSelectedSphereType?: (sphereType: string) => void
  icons: IconsMap
}

export const SphereSelector: React.FC<SphereSelectorProps> = ({
  selectedSphereType,
  setSelectedSphereType,
  icons,
}) => {
  const sphereTypes = [
    {
      name: 'Light',
      color: 'border-amber-400/40 bg-amber-200/20',
      hover: 'hover:border-amber-300/30 hover:bg-amber-100/20',
      text: 'text-amber-600/50',
    },
    {
      name: 'Zen',
      color: 'border-lime-400/30 bg-lime-200/20',
      hover: 'hover:border-lime-400/20 hover:bg-lime-100/20',
      text: 'text-lime-500/50',
    },
  ]

  return (
    <div className='grid grid-cols-2 place-items-center gap-1.5 lg:gap-4'>
      {sphereTypes.map(sphereType => (
        <motion.button
          key={sphereType.name}
          whileHover={animations.button.whileHover}
          whileTap={animations.button.whileTap}
          transition={animations.button.transition}
          className={cn(
            'p-1.5 lg:py-3 lg:px-2.5 rounded-xl border-2 transition-colors duration-200 w-full flex lg:block items-center gap-2.5 justify-start',
            selectedSphereType === sphereType.name
              ? `${sphereType.color} shadow-smooth`
              : `border-transparent ${sphereType.hover}`,
          )}
          onClick={() => setSelectedSphereType?.(sphereType.name)}
        >
          <div
            className={cn(
              'lg:w-full rounded-lg lg:mb-2 flex items-center justify-center',
            )}
          >
            <img
              src={icons[sphereType.name.toLowerCase()]}
              alt={sphereType.name}
              className={cn(
                'size-7 lg:size-16 object-contain pointer-events-none',
              )}
            />
          </div>
          <span className={cn('text-base font-medium', sphereType.text)}>
            {sphereType.name}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
