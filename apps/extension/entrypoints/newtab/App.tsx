import React, { useState, useEffect } from 'react'
import { AnimatedButton } from '@repo/ui/components/ui/animated-btn'
import {
  appIcons,
  cn,
  checkSessionStatus,
  animations,
} from '@repo/ui/src/lib/utils'
import { useApplicationStore } from '../../src/bg/state'
import { ThemeSelector } from '@repo/ui/components/ui/theme-selector'
import { SoundTypeSelector } from '@repo/ui/components/ui/sound-type-selector'
import { TabModal } from '@repo/ui/components/ui/tab-modal'
import { TimerSelector } from '@repo/ui/components/ui/timer-selector'
import { BreathingPatternSelector } from '@repo/ui/components/ui/breathing-pattern-selector'
import { Modal } from '@repo/ui/components/ui/modal'
// import { PlusPackContent } from '@repo/ui/components/ui/plus-pack-modal'

const App: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date())
  const theme = useApplicationStore(state => state.theme)
  const soundType = useApplicationStore(state => state.soundType)
  const breathingPattern = useApplicationStore(state => state.breathingPattern)
  const meditationTimer = useApplicationStore(state => state.meditationTimer)
  const hasPlus = useApplicationStore(state => state.hasPlus)
  const togglePlus = useApplicationStore(state => state.togglePlus)
  const resetPlusFeatures = useApplicationStore(
    state => state.resetPlusFeatures,
  )
  const customBreathingPatterns = useApplicationStore(
    state => state.customBreathingPatterns,
  )
  const addCustomBreathingPattern = useApplicationStore(
    state => state.addCustomBreathingPattern,
  )
  const removeCustomBreathingPattern = useApplicationStore(
    state => state.removeCustomBreathingPattern,
  )

  const setTheme = useApplicationStore(state => state.setTheme)
  const setSoundType = useApplicationStore(state => state.setSoundType)
  const setBreathingPattern = useApplicationStore(
    state => state.setBreathingPattern,
  )
  const setMeditationTimer = useApplicationStore(
    state => state.setMeditationTimer,
  )

  const [selectedTheme, setSelectedTheme] = useState<string | null>(theme)
  const [selectedSoundType, setSelectedSoundType] = useState<string | null>(
    soundType,
  )
  const [selectedBreathingPattern, setSelectedBreathingPattern] = useState<
    string | null
  >(breathingPattern)
  const [selectedTimer, setSelectedTimer] = useState<number | null>(
    meditationTimer,
  )
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isPlusModalOpen, setIsPlusModalOpen] = useState(false)
  const [isSessionActive, setIsSessionActive] = useState(false)

  useEffect(() => {
    checkSessionStatus(setIsSessionActive)

    // Set up interval to check session status periodically
    const checkInterval = setInterval(
      () => checkSessionStatus(setIsSessionActive),
      2000,
    )

    return () => {
      clearInterval(checkInterval)
    }
  }, [])

  const handleOpenContentPage = () => {
    if (
      typeof window.chrome !== 'undefined' &&
      window.chrome.tabs &&
      window.chrome.runtime
    ) {
      window.location.href = window.chrome.runtime.getURL('session.html')
    }
  }

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    setSelectedTheme(theme)
  }, [theme])

  useEffect(() => {
    setSelectedSoundType(soundType)
  }, [soundType])

  useEffect(() => {
    setSelectedBreathingPattern(breathingPattern)
  }, [breathingPattern])

  useEffect(() => {
    setSelectedTimer(meditationTimer)
  }, [meditationTimer])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  const getThemeIcon = () => {
    if (!selectedTheme) return appIcons.utility.themes
    const themeKey = selectedTheme.toLowerCase()
    return (
      appIcons.themeIcons[themeKey as keyof typeof appIcons.themeIcons] ||
      appIcons.utility.themes
    )
  }

  const getSettingsIcon = () => {
    return appIcons.utility.cogwheel
  }

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme)
    setTheme(theme)
  }

  const handleSoundTypeSelection = (soundType: string) => {
    setSelectedSoundType(soundType)
    setSoundType(soundType)
  }

  const handleBreathingPatternSelection = (pattern: string) => {
    setSelectedBreathingPattern(pattern)
    setBreathingPattern(pattern)
  }

  const handleTimerSelection = (timer: number) => {
    setSelectedTimer(timer)
    setMeditationTimer(timer)
  }

  const handlePlusToggle = () => {
    if (hasPlus) {
      resetPlusFeatures()
    } else {
      togglePlus()
    }
    setIsPlusModalOpen(false)
  }

  const handleShowPlusModal = () => {
    setIsPlusModalOpen(true)
  }

  const themeTabs = [
    {
      name: 'Theme',
      key: 'theme',
      panel: (
        <ThemeSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={theme => handleThemeSelection(theme)}
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
          setSelectedSoundType={soundType =>
            handleSoundTypeSelection(soundType)
          }
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
          setSelectedTimer={timer => handleTimerSelection(timer)}
        />
      ),
    },
    {
      name: 'Breathing',
      key: 'breathing',
      panel: (
        <BreathingPatternSelector
          selectedPattern={selectedBreathingPattern}
          setSelectedPattern={pattern =>
            handleBreathingPatternSelection(pattern)
          }
          customPatterns={customBreathingPatterns}
          onAddCustomPattern={addCustomBreathingPattern}
          onRemoveCustomPattern={removeCustomBreathingPattern}
          hasPro={hasPlus}
          onProToggle={handleShowPlusModal}
        />
      ),
    },
  ]

  return (
    <div className='relative select-none min-h-screen bg-new-tab dark:bg-new-tab-evening bg-no-repeat bg-cover'>
      <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none' />
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none' />

      <div className='absolute flex flex-col gap-2 top-2.5 left-3.5 text-background'>
        <span className='text-3xl sm:text-5xl md:text-6xl font-semibold'>
          {formatDate(date)}
        </span>
        <span className='text-xl sm:text-3xl md:text-4xl font-medium'>
          {formatTime(date)}
        </span>
      </div>

      <div
        className={cn(
          isSessionActive ? 'hidden' : 'flex',
          'absolute top-2.5 right-3.5 gap-2 p-2 bg-background/90 border-[1.5px] border-white/20 shadow-smooth backdrop-blur-sm rounded-3xl',
        )}
      >
        <div title='Relax Now'>
          <AnimatedButton
            isAnimated
            iconOnly
            icon={appIcons.utility.meditate}
            label='Meditate'
            onClick={handleOpenContentPage}
          />
        </div>
        <div title='Theme Settings'>
          <AnimatedButton
            iconOnly
            label='Theme'
            icon={getThemeIcon()}
            onClick={() => setIsThemeModalOpen(true)}
          />
        </div>
        <div title='Session Settings'>
          <AnimatedButton
            iconOnly
            label='Settings'
            icon={getSettingsIcon()}
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
        {/* <div title={hasPlus ? 'Plus Pack Features Enabled' : 'Get Plus Pack'}>
          <AnimatedButton
            iconOnly
            label={hasPlus ? 'Plus Pack Enabled' : 'Get Plus Pack'}
            icon={appIcons.utility.pro}
            onClick={() => setIsPlusModalOpen(true)}
          />
        </div> */}
      </div>
      <span className='absolute bottom-2.5 left-3.5 text-4xl leading-none font-sans font-medium bg-gradient-to-br from-background/70 via-background to-background/70 bg-clip-text text-transparent bg-[length:250%_250%] bg-[position:0%_0%] animate-gradient-x'>
        Mindfulness{' '}
        {/* {hasPlus && (
          <span className='text-base font-semibold text-background/85 align-top'>
            Plus
          </span>
        )} */}
      </span>
      <TabModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        tabs={themeTabs}
      />
      <TabModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
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
