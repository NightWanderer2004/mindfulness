import React, { useState, useEffect } from 'react'
import themes from '../../assets/icons/themes.png'
import openness from '../../assets/icons/openness.png'
import meditate from '../../assets/icons/meditate.png'
import cogwheel from '../../assets/icons/cogwheel.png'
import harmony from '../../assets/icons/harmony.png'
import exploration from '../../assets/icons/exploration.png'
import confidence from '../../assets/icons/confidence.png'
import softness from '../../assets/icons/softness.png'
import tiredness from '../../assets/icons/tiredness.png'
import { AnimatedButton } from '@repo/ui/components/ui/animated-btn'
import { MeditateButton } from '@repo/ui/components/ui/meditate-btn'
import { Modal } from '@repo/ui/components/ui/modal'
import { ThemeSelector } from '@repo/ui/components/ui/theme-selector'
import { useApplicationStore } from '../../src/bg/state'
import ResetButton from '../../src/cs/ResetButton'

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const storedTheme = useApplicationStore(state => state.theme)
  const storedSoundType = useApplicationStore(state => state.soundType)
  const setStoredTheme = useApplicationStore(state => state.setTheme)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(storedTheme)

  const icons = {
    harmony: harmony,
    exploration: exploration,
    openness: openness,
    confidence: confidence,
    softness: softness,
    tiredness: tiredness,
  }

  const getThemeIcon = () => {
    if (!selectedTheme) return themes
    const themeKey = selectedTheme.toLowerCase()
    return icons[themeKey as keyof typeof icons]
  }

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme)
    setStoredTheme(theme)
  }

  return (
    <div className='relative w-[350px] py-7 px-11 overflow-hidden flex flex-col items-center justify-center text-white'>
      <div className='absolute pointer-events-none inset-0 bg-sky-bg-popup bg-cover bg-center filter brightness-90' />
      <div className='relative z-10 bg-background/90 border-[1.5px] border-primary/20 shadow-smooth backdrop-blur-sm h-full w-full flex flex-col gap-6 rounded-3xl p-4'>
        <h1 className='mt-1 text-4xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]'>
          Mindful Tab
        </h1>
        <MeditateButton
          icon={meditate}
          onClick={() => console.log('Meditate clicked')}
        />
        <div className='space-y-2'>
          <AnimatedButton
            label='Theme'
            icon={getThemeIcon()}
            onClick={() => setIsModalOpen(true)}
          />
          <AnimatedButton
            label='Settings'
            icon={cogwheel}
            onClick={() => setIsSettingsOpen(true)}
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ThemeSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={handleThemeSelection}
          icons={icons}
        />
      </Modal>
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <div className='text-text-primary p-4 border-2 border-orange-600/20 rounded-lg'>
          <ResetButton label='Reset All Data' className='w-full' />
        </div>
      </Modal>
    </div>
  )
}

export default App
