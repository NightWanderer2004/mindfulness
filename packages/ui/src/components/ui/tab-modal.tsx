'use client'
import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { TransitionPanel } from './transition-panel'
import { ThemeSelector } from './theme-selector'
import { SoundTypeSelector } from './sound-type-selector'
import { ReminderTypeSelector } from './reminder-type-selector'
import { BreathingPatternSelector } from './breathing-pattern-selector'
import { cn, appIcons } from '../../lib/utils'
import { motion } from 'framer-motion'
import useMeasure from 'react-use-measure'

interface TabConfig {
  name: string
  key: string
  panel: React.ReactNode
}

interface TabModalProps {
  isOpen: boolean
  onClose: () => void
  tabs?: TabConfig[]
  selectedTheme?: string | null
  selectedSoundType?: string | null
  selectedReminderType?: string | null
  selectedBreathingPattern?: string | null
  selectedTimer?: number | null
  handleThemeSelection?: (theme: string) => void
  handleSoundTypeSelection?: (soundType: string) => void
  handleReminderTypeSelection?: (reminderType: string) => void
  handleBreathingPatternSelection?: (pattern: string) => void
  handleTimerSelection?: (timer: number) => void
}

export const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  onClose,
  tabs,
  selectedTheme,
  selectedSoundType,
  selectedReminderType,
  selectedBreathingPattern,
  handleThemeSelection,
  handleSoundTypeSelection,
  handleReminderTypeSelection,
  handleBreathingPatternSelection,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [panelRef, panelBounds] = useMeasure({ polyfill: ResizeObserver })

  useEffect(() => setActiveTabIndex(0), [isOpen])

  const defaultThemeHandler = (theme: string) => {
    console.log('Theme selected:', theme)
  }
  const defaultSoundHandler = (sound: string) => {
    console.log('Sound selected:', sound)
  }
  const defaultBreathingHandler = (pattern: string) => {
    console.log('Breathing pattern selected:', pattern)
  }
  const defaultReminderHandler = (reminder: string) => {
    console.log('Reminder selected:', reminder)
  }

  const defaultPanels = [
    <ThemeSelector
      key='themes'
      selectedTheme={selectedTheme || null}
      setSelectedTheme={handleThemeSelection || defaultThemeHandler}
      icons={appIcons.themeIcons}
    />,
    <SoundTypeSelector
      key='sound'
      selectedSoundType={selectedSoundType || null}
      setSelectedSoundType={handleSoundTypeSelection || defaultSoundHandler}
      icons={appIcons.soundIcons}
    />,
    <BreathingPatternSelector
      key='breathing'
      selectedPattern={selectedBreathingPattern || null}
      setSelectedPattern={
        handleBreathingPatternSelection || defaultBreathingHandler
      }
    />,
    <ReminderTypeSelector
      key='reminder'
      selectedReminderType={selectedReminderType || null}
      setSelectedReminderType={
        handleReminderTypeSelection || defaultReminderHandler
      }
      icons={appIcons.reminderIcons}
    />,
  ]

  const tabsToUse = tabs

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='w-full'>
      <div className='flex flex-col space-y-2.5'>
        <div className='flex justify-between border-b border-primary/10 pb-2.5'>
          {tabsToUse?.map((tab, index) => (
            <button
              key={tab.key}
              className={cn(
                'px-3 py-1 text-base rounded-t-lg transition-colors',
                activeTabIndex === index
                  ? 'bg-primary/20 text-primary'
                  : 'text-primary/60 hover:text-primary/80',
              )}
              onClick={() => setActiveTabIndex(index)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <motion.div
          layout='position'
          className='relative '
          initial={{
            height: 144,
          }}
          animate={{
            height: panelBounds.height,
          }}
          transition={{
            height: { type: 'spring', stiffness: 300, damping: 30 },
            layout: { type: 'spring', stiffness: 300, damping: 30 },
          }}
        >
          <TransitionPanel
            activeIndex={activeTabIndex}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            variants={{
              enter: {
                x: 20,
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
              },
              center: {
                x: 0,
                opacity: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
              },
              exit: {
                x: -20,
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
              },
            }}
          >
            {tabsToUse?.map((tab, index) => (
              <div
                key={index}
                ref={index === activeTabIndex ? panelRef : undefined}
                className='w-full h-full'
              >
                {tab.panel}
              </div>
            ))}
          </TransitionPanel>
        </motion.div>
      </div>
    </Modal>
  )
}
