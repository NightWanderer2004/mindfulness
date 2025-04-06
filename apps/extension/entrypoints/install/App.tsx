import React, { useState, useEffect } from 'react'
import themes from '../../assets/icons/themes.png'

import openness from '../../assets/icons/openness.png'
import harmony from '../../assets/icons/harmony.png'
import exploration from '../../assets/icons/exploration.png'
import confidence from '../../assets/icons/confidence.png'
import tiredness from '../../assets/icons/tiredness.png'
import softness from '../../assets/icons/softness.png'

import sound from '../../assets/icons/sound.png'
import ambient from '../../assets/icons/sounds/ambient.png'
import nature from '../../assets/icons/sounds/nature.png'
import mono from '../../assets/icons/sounds/mono.png'

import { AnimatedButton } from '@repo/ui/components/ui/animated-btn'
import { Modal } from '@repo/ui/components/ui/modal'
import { ThemeSelector } from '@repo/ui/components/ui/theme-selector'
import { SoundTypeSelector } from '@repo/ui/components/ui/sound-type-selector'
import { ReminderTypeSelector } from '@repo/ui/components/ui/reminder-type-selector'
import { TransitionPanel } from '@repo/ui/components/ui/transition-panel'
import { motion } from 'framer-motion'
import { animations, cn, transitionSmooth } from '@repo/ui/src/lib/utils'
import { useApplicationStore } from '../../src/bg/state'

const steps = [
  {
    description: "Welcome! Let's start from choosing theme",
  },
  {
    description: 'Next, had better to choose sound type',
  },
  {
    description: 'And the last step is reminder type',
  },
  {
    description:
      "You're all set! Hold «space» button to start your mindful experience",
  },
]

const App: React.FC = () => {
  const theme = useApplicationStore(state => state.theme)
  const soundType = useApplicationStore(state => state.soundType)
  const reminderType = useApplicationStore(state => state.reminderType)
  const setTheme = useApplicationStore(state => state.setTheme)
  const setSoundType = useApplicationStore(state => state.setSoundType)
  const setReminderType = useApplicationStore(state => state.setReminderType)

  const [selectedTheme, setSelectedTheme] = useState<string | null>(theme)
  const [selectedSoundType, setSelectedSoundType] = useState<string | null>(
    soundType,
  )
  const [selectedReminderType, setSelectedReminderType] = useState<
    string | null
  >(reminderType)
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false)
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [setupComplete, setSetupComplete] = useState(false)

  const getCurrentStep = (): number => {
    return activeIndex
  }

  useEffect(() => {
    if (selectedTheme && activeIndex === 0) {
      setDirection(1)
      setActiveIndex(1)
    }
  }, [selectedTheme])

  useEffect(() => {
    if (selectedSoundType && activeIndex === 1) {
      setDirection(1)
      setActiveIndex(2)
    }
  }, [selectedSoundType])

  useEffect(() => {
    if (selectedReminderType && activeIndex === 2) {
      setDirection(1)
      setActiveIndex(3)
    }
  }, [selectedReminderType])

  const handleGoBack = () => {
    const currentStep = getCurrentStep()
    if (currentStep >= 1) {
      setDirection(-1)
      setActiveIndex(currentStep - 1)
    }
  }

  const handleNext = () => {
    const currentStep = getCurrentStep()
    if (currentStep < 3) {
      if (currentStep === 0 && selectedTheme) {
        setDirection(1)
        setActiveIndex(1)
      } else if (currentStep === 1 && selectedSoundType) {
        setDirection(1)
        setActiveIndex(2)
      } else if (currentStep === 2 && selectedReminderType) {
        setDirection(1)
        setActiveIndex(3)
      } else if (currentStep === 3) {
        console.log('Setup complete, navigate to main app')
        // Navigate to main app or close onboarding
      }
    } else {
      console.log('Setup complete, navigate to main app')
      // Navigate to main app or close onboarding
    }
  }

  const handleSetActiveIndex = (newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1)
    setActiveIndex(newIndex)
  }

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0)
    if (activeIndex >= steps.length) setActiveIndex(steps.length - 1)
  }, [activeIndex])

  const themeIcons = {
    openness,
    harmony,
    exploration,
    confidence,
    tiredness,
    softness,
  }

  const soundIcons = {
    ambient,
    nature,
    mono,
  }

  const reminderIcons = {
    a: 'a',
    b: 'b',
  }

  const getThemeIcon = () => {
    if (!selectedTheme) return themes
    const themeKey = selectedTheme.toLowerCase()
    return themeIcons[themeKey as keyof typeof themeIcons]
  }

  const getSoundIcon = () => {
    if (!selectedSoundType) return sound
    const soundKey = selectedSoundType.toLowerCase().replace(/\s+/g, '')
    return soundIcons[soundKey as keyof typeof soundIcons]
  }

  const getReminderIcon = () => {
    if (!selectedReminderType) return themes // Using themes as a default icon
    const reminderKey = selectedReminderType.toLowerCase()
    return typeof reminderIcons[reminderKey as keyof typeof reminderIcons] ===
      'string'
      ? reminderIcons[reminderKey as keyof typeof reminderIcons]
      : themes
  }

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme)
    setTheme(theme)
  }

  const handleSoundTypeSelection = (soundType: string) => {
    setSelectedSoundType(soundType)
    setSoundType(soundType)
  }

  const handleReminderTypeSelection = (reminderType: string) => {
    setSelectedReminderType(reminderType)
    setReminderType(reminderType)
  }

  const canProceed =
    (activeIndex === 0 && selectedTheme) ||
    (activeIndex === 1 && selectedSoundType) ||
    (activeIndex === 2 && selectedReminderType)

  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 386 : -386,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 386 : -386,
      opacity: 0,
    }),
  }

  const navBtns = (isFirstStep: boolean = false) => (
    <div className='space-x-6'>
      {!isFirstStep && (
        <motion.button
          whileHover={animations.button.whileHover}
          whileTap={animations.button.whileTap}
          transition={animations.button.transition}
          className='text-base text-background/75 font-medium'
          onClick={handleGoBack}
        >
          Back
        </motion.button>
      )}

      {(activeIndex === 0 && selectedTheme) ||
      (activeIndex === 1 && selectedSoundType) ? (
        <motion.button
          whileHover={animations.button.whileHover}
          whileTap={animations.button.whileTap}
          transition={animations.button.transition}
          className='text-base text-background/75 font-medium'
          onClick={handleNext}
        >
          Next
        </motion.button>
      ) : null}
    </div>
  )

  const renderStepContent = () => {
    return [
      // Step 1: Theme selection
      <div key='theme' className='flex flex-col gap-6'>
        <p className='text-xl text-background/85'>{steps[0]?.description}</p>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3 justify-center'>
            <AnimatedButton
              className='max-w-[300px] !bg-background/90'
              label={selectedTheme ? `Theme: ${selectedTheme}` : 'Choose Theme'}
              icon={getThemeIcon()}
              onClick={() => {
                setIsThemeModalOpen(true)
              }}
            />
          </div>
          {navBtns(true)}
        </div>
      </div>,

      // Step 2: Sound selection
      <div key='sound' className='flex flex-col gap-6'>
        <p className='text-xl text-background/85'>{steps[1]?.description}</p>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3 justify-center'>
            <AnimatedButton
              className='max-w-[300px] !bg-background/90'
              label={
                selectedSoundType
                  ? `Sound: ${selectedSoundType}`
                  : 'Choose Sound'
              }
              icon={getSoundIcon()}
              onClick={() => {
                setIsSoundModalOpen(true)
              }}
            />
          </div>
          {navBtns()}
        </div>
      </div>,

      // Step 3: Reminder selection
      <div key='reminder' className='flex flex-col gap-6'>
        <p className='text-xl text-background/85'>{steps[2]?.description}</p>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-center'>
            <AnimatedButton
              className='max-w-[300px] !bg-background/90'
              label={
                selectedReminderType
                  ? `Reminder: ${selectedReminderType}`
                  : 'Choose Reminder'
              }
              icon={getReminderIcon()}
              onClick={() => {
                setIsReminderModalOpen(true)
              }}
            />
          </div>
          {navBtns()}
        </div>
      </div>,

      // Step 4: Completion
      <div key='complete' className='flex flex-col gap-6'>
        <p className='text-xl text-background/85'>{steps[3]?.description}</p>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-center'>
            <motion.button
              whileHover={animations.button.whileHover}
              whileTap={animations.button.whileTap}
              transition={animations.button.transition}
              className={cn(
                'flex items-center justify-between bg-primary/80 border-background/35 rounded-2xl px-5 py-1.5 shadow-smooth border-[1.5px]',
              )}
              onClick={handleNext}
            >
              <span className='text-lg text-background/90 font-medium'>
                Finish
              </span>
            </motion.button>
          </div>
        </div>
      </div>,
    ]
  }

  return (
    <div className='h-screen relative flex flex-col items-center justify-center pb-20 text-center text-primary overflow-hidden'>
      <div className='absolute inset-0 bg-sky-bg-main bg-cover bg-center bg-no-repeat blur-sm scale-105 pointer-events-none brightness-110 z-0' />
      <div className='z-20 w-full max-w-sm mx-auto'>
        <h1 className='mb-2.5 text-6xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-background/90 via-background/65 to-background/55 bg-clip-text text-transparent bg-[length:250%_250%] bg-[position:0%_0%]'>
          Mindful Tab
        </h1>

        <div
          className='relative overflow-hidden'
          style={{ minHeight: '200px' }}
        >
          <TransitionPanel
            activeIndex={activeIndex}
            variants={contentVariants}
            transition={{
              x: transitionSmooth,
              opacity: { duration: 0.2 },
            }}
            custom={direction}
          >
            {renderStepContent()}
          </TransitionPanel>
        </div>
      </div>

      <Modal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      >
        <div className='mb-6'>
          <h2 className='text-3xl font-medium mb-1.5 bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]'>
            Choose Your Theme
          </h2>
          <p className='text-base text-primary/85'>
            Select a theme that resonates with your mood
          </p>
        </div>
        <ThemeSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={theme => {
            handleThemeSelection(theme)
            setIsThemeModalOpen(false)
          }}
          icons={themeIcons}
        />
      </Modal>

      <Modal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
      >
        <div className='mb-6'>
          <h2 className='text-3xl font-medium mb-1.5 bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]'>
            Choose Your Sound
          </h2>
          <p className='text-base text-primary/85'>
            Select a sound type that helps you focus
          </p>
        </div>
        <SoundTypeSelector
          selectedSoundType={selectedSoundType}
          setSelectedSoundType={soundType => {
            handleSoundTypeSelection(soundType)
            setIsSoundModalOpen(false)
          }}
          icons={soundIcons}
        />
      </Modal>

      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      >
        <div className='mb-6'>
          <h2 className='text-3xl font-medium mb-1.5 bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]'>
            Choose Your Reminder
          </h2>
          <p className='text-base text-primary/85'>
            Select a reminder type that helps you focus
          </p>
        </div>
        <ReminderTypeSelector
          selectedReminderType={selectedReminderType}
          setSelectedReminderType={reminderType => {
            handleReminderTypeSelection(reminderType)
            setIsReminderModalOpen(false)
          }}
          icons={reminderIcons}
        />
      </Modal>
    </div>
  )
}

export default App
