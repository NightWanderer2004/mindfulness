import React, { useState, useEffect } from 'react'
import { analytics } from '#analytics'
import { AnimatedButton } from '@repo/ui/components/ui/animated-btn'
import { MeditateButton } from '@repo/ui/components/ui/meditate-btn'
import { TabModal } from '@repo/ui/components/ui/tab-modal'
import { Modal } from '@repo/ui/components/ui/modal'
import { TimerSelector } from '@repo/ui/components/ui/timer-selector'
import { ThemeSelector } from '@repo/ui/components/ui/theme-selector'
import { SoundTypeSelector } from '@repo/ui/components/ui/sound-type-selector'
import { BreathingPatternSelector } from '@repo/ui/components/ui/breathing-pattern-selector'
import { useApplicationStore } from '../../src/bg/state'
import {
  appIcons,
  cn,
  checkSessionStatus,
  animations,
} from '@repo/ui/src/lib/utils'
// import { PlusPackContent } from '@repo/ui/components/ui/plus-pack-modal'

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isPlusModalOpen, setIsPlusModalOpen] = useState(false)
  const [isSessionActive, setIsSessionActive] = useState(false)

  const storedTheme = useApplicationStore(state => state.theme)
  const storedSoundType = useApplicationStore(state => state.soundType)
  const storedBreathingPattern = useApplicationStore(
    state => state.breathingPattern,
  )
  const storedTimer = useApplicationStore(state => state.meditationTimer)
  const customBreathingPatterns = useApplicationStore(
    state => state.customBreathingPatterns,
  )
  const hasPlus = useApplicationStore(state => state.hasPlus)
  const resetPlusFeatures = useApplicationStore(
    state => state.resetPlusFeatures,
  )

  const setStoredTheme = useApplicationStore(state => state.setTheme)
  const setStoredSoundType = useApplicationStore(state => state.setSoundType)
  const setStoredBreathingPattern = useApplicationStore(
    state => state.setBreathingPattern,
  )
  const setStoredTimer = useApplicationStore(state => state.setMeditationTimer)
  const addCustomBreathingPattern = useApplicationStore(
    state => state.addCustomBreathingPattern,
  )
  const removeCustomBreathingPattern = useApplicationStore(
    state => state.removeCustomBreathingPattern,
  )
  const togglePlus = useApplicationStore(state => state.togglePlus)

  const [selectedTheme, setSelectedTheme] = useState<string | null>(storedTheme)
  const [selectedSoundType, setSelectedSoundType] = useState<string | null>(
    storedSoundType,
  )
  const [selectedBreathingPattern, setSelectedBreathingPattern] = useState<
    string | null
  >(storedBreathingPattern)
  const [selectedTimer, setSelectedTimer] = useState<number | null>(storedTimer)

  useEffect(() => {
    checkSessionStatus(setIsSessionActive)
    void analytics.track('popup_open')
  }, [])

  const getThemeIcon = () => {
    if (!selectedTheme) return appIcons.utility.themes
    const themeKey = selectedTheme.toLowerCase()
    return (
      appIcons.themeIcons[themeKey as keyof typeof appIcons.themeIcons] ||
      appIcons.utility.themes
    )
  }

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme)
    setStoredTheme(theme)
    void analytics.track('theme_select', { theme })
  }

  const handleSoundTypeSelection = (soundType: string) => {
    setSelectedSoundType(soundType)
    setStoredSoundType(soundType)
    void analytics.track('sound_type_select', { soundType })
  }

  const handleBreathingPatternSelection = (pattern: string) => {
    setSelectedBreathingPattern(pattern)
    setStoredBreathingPattern(pattern)
    void analytics.track('breathing_select', { pattern })
  }

  const handleTimerSelection = (timer: number) => {
    setSelectedTimer(timer)
    setStoredTimer(timer)
    void analytics.track('timer_select', { timer })
  }

  const handleAddCustomPattern = (name: string, config: any) => {
    addCustomBreathingPattern(name, config)
    void analytics.track('breathing_custom_add', { name })
  }

  const handleRemoveCustomPattern = (name: string) => {
    removeCustomBreathingPattern(name)
    // If the removed pattern was selected, switch to the default pattern
    if (selectedBreathingPattern === name) {
      handleBreathingPatternSelection('Equal')
    }
    void analytics.track('breathing_custom_remove', { name })
  }

  const handlePlusToggle = () => {
    if (hasPlus) {
      resetPlusFeatures()
    } else {
      togglePlus()
    }
    setIsPlusModalOpen(false)
    void analytics.track('plus_toggle', { enabled: !hasPlus })
  }

  const handleShowPlusModal = () => {
    setIsPlusModalOpen(true)
  }

  const handleOpenContentPage = () => {
    if (
      typeof window.chrome !== 'undefined' &&
      window.chrome.tabs &&
      window.chrome.runtime
    ) {
      window.chrome.tabs.create(
        {
          url: window.chrome.runtime.getURL('session.html'),
        },
        () => setIsSessionActive(true),
      )
      void analytics.track('start_session', { source: 'popup' })
    }
  }

  const themeTabs = [
    {
      name: 'Theme',
      key: 'theme',
      panel: (
        <ThemeSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={handleThemeSelection}
          icons={appIcons.themeIcons}
          hasPro={hasPlus}
          onProToggle={handleShowPlusModal}
        />
      ),
    },
    {
      name: 'Sound',
      key: 'sound',
      panel: (
        <SoundTypeSelector
          selectedSoundType={selectedSoundType}
          setSelectedSoundType={handleSoundTypeSelection}
          icons={appIcons.soundIcons}
          hasPro={hasPlus}
          onProToggle={handleShowPlusModal}
        />
      ),
    },
  ]

  const settingsTabs = [
    {
      name: 'Timer',
      key: 'timer',
      panel: (
        <TimerSelector
          selectedTimer={selectedTimer}
          setSelectedTimer={handleTimerSelection}
        />
      ),
    },
    {
      name: 'Breathing',
      key: 'breathing',
      panel: (
        <BreathingPatternSelector
          selectedPattern={selectedBreathingPattern}
          setSelectedPattern={handleBreathingPatternSelection}
          customPatterns={customBreathingPatterns}
          onAddCustomPattern={handleAddCustomPattern}
          onRemoveCustomPattern={handleRemoveCustomPattern}
          hasPro={hasPlus}
          onProToggle={handleShowPlusModal}
        />
      ),
    },
  ]

  return (
    <div className='relative w-[320px] p-4 py-5 overflow-hidden flex flex-col items-center justify-center'>
      <div className='absolute pointer-events-none inset-0 bg-sky-bg-popup bg-cover bg-center filter brightness-90' />
      <div
        className={cn(
          'relative z-10 bg-background/90 border-[1.5px] border-primary/20 shadow-smooth backdrop-blur-sm h-full w-full flex flex-col rounded-3xl p-3',
          isSessionActive ? 'gap-3' : 'gap-4',
        )}
      >
        <h1 className='mt-1 text-4xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]'>
          Mindfulness
        </h1>

        {isSessionActive ? (
          <p className='text-primary/85 text-base text-center font-medium'>
            You're already relaxing, enjoy
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
              {/* {!hasPlus && (
                <AnimatedButton
                  label='Get Plus Pack'
                  icon={appIcons.utility.pro}
                  onClick={handleShowPlusModal}
                />
              )} */}
            </div>
          </div>
        )}
      </div>

      <TabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tabs={themeTabs}
      />

      <TabModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tabs={settingsTabs}
      />

      {/* <Modal
        isOpen={isPlusModalOpen}
        onClose={() => setIsPlusModalOpen(false)}
        showDefaultButton={false}
      >
        <PlusPackContent
          onGetPlus={handlePlusToggle}
          onClose={() => setIsPlusModalOpen(false)}
          hasPlus={hasPlus}
        />
      </Modal> */}
    </div>
  )
}

export default App
