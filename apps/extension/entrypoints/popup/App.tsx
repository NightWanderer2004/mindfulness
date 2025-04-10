import React, { useState, useEffect } from 'react'
import { AnimatedButton } from '@repo/ui/components/ui/animated-btn'
import { MeditateButton } from '@repo/ui/components/ui/meditate-btn'
import { Modal } from '@repo/ui/components/ui/modal'
import { TabModal } from '@repo/ui/components/ui/tab-modal'
import { useApplicationStore } from '../../src/bg/state'
import ResetButton from '../../src/cs/ResetButton'
import { appIcons, cn } from '@repo/ui/src/lib/utils'

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSessionActive, setIsSessionActive] = useState(false)

  const storedTheme = useApplicationStore(state => state.theme)
  const storedSoundType = useApplicationStore(state => state.soundType)
  const storedReminderType = useApplicationStore(state => state.reminderType)

  const setStoredTheme = useApplicationStore(state => state.setTheme)
  const setStoredSoundType = useApplicationStore(state => state.setSoundType)
  const setStoredReminderType = useApplicationStore(
    state => state.setReminderType,
  )

  const [selectedTheme, setSelectedTheme] = useState<string | null>(storedTheme)
  const [selectedSoundType, setSelectedSoundType] = useState<string | null>(
    storedSoundType,
  )
  const [selectedReminderType, setSelectedReminderType] = useState<
    string | null
  >(storedReminderType)

  useEffect(() => {
    checkSessionStatus()
  }, [])

  const checkSessionStatus = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
      chrome.tabs.query(
        { url: chrome.runtime.getURL('session.html') },
        tabs => {
          setIsSessionActive(tabs.length > 0)
        },
      )
    }
  }

  const getThemeIcon = () => {
    if (!selectedTheme) return appIcons.utility.themes
    const themeKey = selectedTheme.toLowerCase()
    return (
      appIcons.themeIcons[themeKey as keyof typeof appIcons.themeIcons] ||
      appIcons.utility.themes
    )
  }

  const getSoundIcon = () => {
    if (!selectedSoundType) return appIcons.utility.sound
    const soundKey = selectedSoundType.toLowerCase()
    return (
      appIcons.soundIcons[soundKey as keyof typeof appIcons.soundIcons] ||
      appIcons.utility.sound
    )
  }

  const getReminderIcon = () => {
    if (!selectedReminderType) return appIcons.utility.themes
    const reminderKey = selectedReminderType.toLowerCase()
    return (
      appIcons.reminderIcons[
        reminderKey as keyof typeof appIcons.reminderIcons
      ] || appIcons.utility.themes
    )
  }

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme)
    setStoredTheme(theme)
  }

  const handleSoundTypeSelection = (soundType: string) => {
    setSelectedSoundType(soundType)
    setStoredSoundType(soundType)
  }

  const handleReminderTypeSelection = (reminderType: string) => {
    setSelectedReminderType(reminderType)
    setStoredReminderType(reminderType)
  }

  const handleOpenContentPage = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
      chrome.tabs.create(
        {
          url: chrome.runtime.getURL('session.html'),
        },
        () => setIsSessionActive(true),
      )
    }
  }

  return (
    <div className='relative w-[330px] py-7 px-11 overflow-hidden flex flex-col items-center justify-center text-white'>
      <div className='absolute pointer-events-none inset-0 bg-sky-bg-popup bg-cover bg-center filter brightness-90' />
      <div
        className={cn(
          'relative z-10 bg-background/90 border-[1.5px] border-primary/20 shadow-smooth backdrop-blur-sm h-full w-full flex flex-col rounded-3xl p-4',
          isSessionActive ? 'gap-3' : 'gap-4',
        )}
      >
        <h1 className='mt-1 text-4xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]'>
          MindfulTab
        </h1>

        {isSessionActive ? (
          <p className='text-primary/85 text-base text-center font-medium'>
            You're already in session
          </p>
        ) : (
          <div className='space-y-4'>
            <MeditateButton
              icon={appIcons.utility.meditate}
              onClick={handleOpenContentPage}
            />
            <div className='space-y-2'>
              <AnimatedButton
                label='Themes'
                icon={getThemeIcon()}
                onClick={() => setIsModalOpen(true)}
              />
              <AnimatedButton
                label='Settings'
                icon={appIcons.utility.cogwheel}
                onClick={() => setIsSettingsOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      <TabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTheme={selectedTheme}
        selectedSoundType={selectedSoundType}
        selectedReminderType={selectedReminderType}
        handleThemeSelection={handleThemeSelection}
        handleSoundTypeSelection={handleSoundTypeSelection}
        handleReminderTypeSelection={handleReminderTypeSelection}
      />

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <div className='text-text-primary p-4 border-2 border-orange-600/20 rounded-lg'>
          <p className='text-sm text-primary/70 mb-4'>
            Reset all data and return to default settings
          </p>
          <ResetButton label='Reset All Data' className='w-full' />
        </div>
      </Modal>
    </div>
  )
}

export default App
