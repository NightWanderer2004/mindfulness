import React from 'react'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/utils'
import { PlusFeature } from './plus-feature'

interface IconsMap {
  [key: string]: string
}

interface ThemeSelectorProps {
  selectedTheme: string | null
  setSelectedTheme?: (theme: string) => void
  icons: IconsMap
  hasPro?: boolean
  onProToggle?: () => void
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  setSelectedTheme,
  icons,
  hasPro = false,
  onProToggle,
}) => {
  // Free themes (default available)
  const freeThemes = [
    {
      name: 'Softness',
      icon: icons.softness,
      color: 'border-blue-300/30 bg-blue-200/20',
      hover: 'hover:border-blue-300/20 hover:bg-blue-100/20',
      text: 'text-sky-600/60',
    },
    {
      name: 'Openness',
      icon: icons.openness,
      color: 'border-lime-400/30 bg-lime-200/20',
      hover: 'hover:border-lime-400/20 hover:bg-lime-100/20',
      text: 'text-lime-600/50',
    },
    {
      name: 'Harmony',
      icon: icons.harmony,
      color: 'border-amber-400/40 bg-amber-200/20',
      hover: 'hover:border-amber-300/30 hover:bg-amber-100/20',
      text: 'text-amber-600/50',
    },
  ]

  // Pro themes (locked behind Pro)
  const proThemes = [
    {
      name: 'Wandering',
      icon: icons.wandering,
      color: 'border-blue-400/30 bg-blue-200/20',
      hover: 'hover:border-blue-400/20 hover:bg-blue-100/20',
      text: 'text-blue-600/50',
    },
    {
      name: 'Confidence',
      icon: icons.confidence,
      color: 'border-emerald-300/30 bg-emerald-200/20',
      hover: 'hover:border-emerald-300/20 hover:bg-emerald-100/20',
      text: 'text-emerald-600/50',
    },
    {
      name: 'Tiredness',
      icon: icons.tiredness,
      color: 'border-red-300/30 bg-red-200/20',
      hover: 'hover:border-red-300/20 hover:bg-red-100/20',
      text: 'text-red-600/50',
    },
  ]

  const renderThemeButton = (theme: any) => (
    <motion.button
      key={theme.name}
      whileHover={animations.button.whileHover}
      whileTap={animations.button.whileTap}
      transition={animations.button.transition}
      className={cn(
        'p-1.5 lg:py-3 lg:px-2.5 rounded-2xl border-2 transition-colors duration-200 w-full flex lg:block items-center gap-2.5 justify-start',
        selectedTheme === theme.name
          ? `${theme.color} shadow-smooth`
          : `border-transparent ${theme.hover}`,
      )}
      onClick={() => setSelectedTheme?.(theme.name)}
    >
      <div className='lg:w-full lg:mb-2 flex items-center justify-center'>
        <img
          src={theme.icon}
          alt={theme.name}
          className='size-7 lg:size-16 object-contain pointer-events-none'
        />
      </div>
      <span className={cn('text-base font-medium', theme.text)}>
        {theme.name}
      </span>
    </motion.button>
  )

  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 place-items-center gap-1.5 lg:gap-4'>
      {freeThemes.map(theme => renderThemeButton(theme))}

      {proThemes.map(theme => (
        <div key={theme.name} className='w-full'>
          <PlusFeature isPro={hasPro} feature='themes' onClick={onProToggle}>
            {renderThemeButton(theme)}
          </PlusFeature>
        </div>
      ))}
    </div>
  )
}
