import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'

interface IconsMap {
  [key: string]: string
}

interface ReminderTypeSelectorProps {
  selectedReminderType: string | null
  setSelectedReminderType: (reminderType: string) => void
  icons: IconsMap
}

export const ReminderTypeSelector: React.FC<ReminderTypeSelectorProps> = ({
  selectedReminderType,
  setSelectedReminderType,
  icons,
}) => {
  const reminderTypes = [
    {
      name: 'Sunshine',
      color: 'border-amber-400/40 bg-amber-200/20',
      hover: 'hover:border-amber-300/30 hover:bg-amber-100/20',
      text: 'text-amber-600/50',
    },
    {
      name: 'Blossom',
      color: 'border-blue-400/30 bg-blue-200/20',
      hover: 'hover:border-blue-400/20 hover:bg-blue-100/20',
      text: 'text-blue-500/50',
    },
  ]

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 place-items-center gap-1.5 lg:gap-4'>
      {reminderTypes.map(reminderType => (
        <motion.button
          key={reminderType.name}
          whileHover={animations.button.whileHover}
          whileTap={animations.button.whileTap}
          transition={animations.button.transition}
          className={cn(
            'p-1.5 lg:py-3 lg:px-2.5 rounded-xl border-2 transition-colors duration-200 w-full flex lg:block items-center gap-2.5 justify-start',
            selectedReminderType === reminderType.name
              ? `${reminderType.color} shadow-smooth`
              : `border-transparent ${reminderType.hover}`,
          )}
          onClick={() => setSelectedReminderType(reminderType.name)}
        >
          <div
            className={cn(
              'lg:w-full rounded-lg lg:mb-2 flex items-center justify-center',
            )}
          >
            <img
              src={icons[reminderType.name.toLowerCase()]}
              alt={reminderType.name}
              className={cn(
                'size-7 lg:size-16 object-contain pointer-events-none',
              )}
            />
          </div>
          <span className={cn('text-base font-medium', reminderType.text)}>
            {reminderType.name}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
