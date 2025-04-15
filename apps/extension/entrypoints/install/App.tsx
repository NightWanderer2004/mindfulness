import React, { useState, useEffect } from 'react'
import { AnimatedButton } from '@repo/ui/components/ui/animated-btn'
import { Modal } from '@repo/ui/components/ui/modal'
import { ThemeSelector } from '@repo/ui/components/ui/theme-selector'
import { SoundTypeSelector } from '@repo/ui/components/ui/sound-type-selector'
import { TransitionPanel } from '@repo/ui/components/ui/transition-panel'
import { HoldSphere } from '@repo/ui/components/ui/hold-sphere'
import { motion } from 'framer-motion'
import { animations, transitionSmooth, appIcons } from '@repo/ui/src/lib/utils'
import { useApplicationStore } from '../../src/bg/state'

const steps = [
  {
    description: "Welcome! Let's start from choosing theme",
  },
  {
    description: 'Next, had better to choose sound type',
  },
  {
    description:
      'All set! Wish you a great experience further. Hold «space» to finish.',
  },
]

const App: React.FC = () => {
  const theme = useApplicationStore(state => state.theme)
  const soundType = useApplicationStore(state => state.soundType)
  const setTheme = useApplicationStore(state => state.setTheme)
  const setSoundType = useApplicationStore(state => state.setSoundType)

  const [selectedTheme, setSelectedTheme] = useState<string | null>(theme)
  const [selectedSoundType, setSelectedSoundType] = useState<string | null>(
    soundType,
  )
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false)
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [setupComplete, setSetupComplete] = useState(false)

  const getCurrentStep = (): number => {
    return activeIndex
  }

  const handleSetupComplete = () => setSetupComplete(true)

  const handleCloseTab = () => {
    window.close()
  }

  const handleSetActiveIndex = (newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1)
    setActiveIndex(newIndex)
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
    if (setupComplete && activeIndex === 2) {
      handleCloseTab()
    }
  }, [setupComplete, activeIndex])

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
      }
    }
  }

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0)
    if (activeIndex >= steps.length) setActiveIndex(steps.length - 1)
  }, [activeIndex])

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
    const soundKey = selectedSoundType.toLowerCase().replace(/\s+/g, '')
    return (
      appIcons.soundIcons[soundKey as keyof typeof appIcons.soundIcons] ||
      appIcons.utility.sound
    )
  }

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme)
    setTheme(theme)
  }

  const handleSoundTypeSelection = (soundType: string) => {
    setSelectedSoundType(soundType)
    setSoundType(soundType)
  }

  const contentVariants = {
    enter: (direction: number) => ({
      scale: 0.95,
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      scale: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      scale: 0.95,
      x: direction < 0 ? 300 : -300,
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
    const stepConfig = [
      {
        key: 'theme',
        description: steps[0]?.description,
        label: selectedTheme ? `Theme: ${selectedTheme}` : 'Choose Theme',
        icon: getThemeIcon(),
        onClick: () => setIsThemeModalOpen(true),
        isFirstStep: true,
      },
      {
        key: 'sound',
        description: steps[1]?.description,
        label: selectedSoundType
          ? `Sound: ${selectedSoundType}`
          : 'Choose Sound',
        icon: getSoundIcon(),
        onClick: () => setIsSoundModalOpen(true),
      },
      {
        key: 'complete',
        description: steps[2]?.description,
        customContent: (
          <HoldSphere
            holdDuration={2200}
            onComplete={() => {
              handleSetupComplete()
            }}
          />
        ),
      },
    ]

    return stepConfig.map(
      ({
        key,
        description,
        label,
        icon,
        onClick,
        customContent,
        isFirstStep,
      }) => (
        <div key={key} className='flex flex-col gap-6'>
          <p className='text-xl text-background/85'>{description}</p>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-center'>
              {customContent || (
                <AnimatedButton
                  className='max-w-[300px] !bg-background/90'
                  label={label}
                  icon={icon}
                  onClick={onClick}
                />
              )}
            </div>
            {!customContent && navBtns(isFirstStep)}
          </div>
        </div>
      ),
    )
  }

  return (
    <div className='h-screen relative flex flex-col items-center justify-center pb-20 text-center text-primary overflow-hidden'>
      <div className='absolute inset-0 bg-sky-bg-main bg-cover bg-center bg-no-repeat blur-sm scale-105 pointer-events-none brightness-110 z-0' />

      <div
        className={`fixed top-2.5 right-[52px] flex flex-col gap-1 items-center z-50 transition-opacity duration-300 ${activeIndex === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='text-background/85'
        >
          <path
            d='M12 4L12 20M12 4L6 10M12 4L18 10'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <span className='text-sm font-semibold text-background/85 text-center whitespace-nowrap'>
          Pin this extension
          <br />
          to the toolbar
        </span>
      </div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          ...transitionSmooth,
          delay: 0.125,
          opacity: { ease: 'linear', delay: 0.145 },
        }}
        className='z-20 w-full max-w-sm mx-auto'
      >
        <h1 className='mb-2.5 text-6xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-background/90 via-background/65 to-background/55 bg-clip-text text-transparent bg-[length:250%_250%] bg-[position:0%_0%]'>
          MindfulTab
        </h1>

        <div className='relative ' style={{ minHeight: '200px' }}>
          <TransitionPanel
            activeIndex={activeIndex}
            variants={contentVariants}
            transition={{
              x: transitionSmooth,
              opacity: { duration: 0.15 },
            }}
            custom={direction}
          >
            {renderStepContent()}
          </TransitionPanel>
        </div>
      </motion.div>

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
          icons={appIcons.themeIcons}
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
          icons={appIcons.soundIcons}
        />
      </Modal>
    </div>
  )
}

export default App
