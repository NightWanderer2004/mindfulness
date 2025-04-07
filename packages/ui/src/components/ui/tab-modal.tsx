'use client'
import React, { useState } from 'react'
import { Modal } from './modal'
import { TransitionPanel } from './transition-panel'
import { ThemeSelector } from './theme-selector'
import { SoundTypeSelector } from './sound-type-selector'
import { ReminderTypeSelector } from './reminder-type-selector'
import { cn, transitionSmooth, appIcons } from '../../lib/utils'
import { motion } from 'framer-motion'
import useMeasure from 'react-use-measure'

interface TabModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTheme: string | null
  selectedSoundType: string | null
  selectedReminderType: string | null
  handleThemeSelection: (theme: string) => void
  handleSoundTypeSelection: (soundType: string) => void
  handleReminderTypeSelection: (reminderType: string) => void
}

export const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  onClose,
  selectedTheme,
  selectedSoundType,
  selectedReminderType,
  handleThemeSelection,
  handleSoundTypeSelection,
  handleReminderTypeSelection,
}) => {
  const [ref, bounds] = useMeasure()

  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')
  const [contentWidth, setContentWidth] = useState<number | 'auto'>('auto')

  const tabs = [
    { name: 'Themes', key: 'themes' },
    { name: 'Sound', key: 'sound' },
    { name: 'Reminder', key: 'reminder' },
  ]

  const tabPanels = [
    <ThemeSelector
      key='themes'
      selectedTheme={selectedTheme}
      setSelectedTheme={handleThemeSelection}
      icons={appIcons.themeIcons}
    />,
    <SoundTypeSelector
      key='sound'
      selectedSoundType={selectedSoundType}
      setSelectedSoundType={handleSoundTypeSelection}
      icons={appIcons.soundIcons}
    />,
    <ReminderTypeSelector
      key='reminder'
      selectedReminderType={selectedReminderType}
      setSelectedReminderType={handleReminderTypeSelection}
      icons={appIcons.reminderIcons}
    />,
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='w-[300px] mx-auto'>
      <motion.div
        className='flex flex-col space-y-2.5'
        layout
        transition={{
          layout: { duration: 0.3, ease: 'easeInOut' },
        }}
      >
        <div className='flex justify-between border-b border-primary/10 pb-2.5'>
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              className={cn(
                'px-3 py-1 rounded-t-lg transition-colors',
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

        <TransitionPanel
          activeIndex={activeTabIndex}
          transition={{
            x: transitionSmooth,
            opacity: { duration: 0.1 },
          }}
          variants={{
            enter: {
              x: 40,
              opacity: 0,
              height: bounds.height > 0 ? bounds.height : 'auto',
              position: 'initial',
            },
            center: {
              x: 0,
              opacity: 1,
              height: bounds.height > 0 ? bounds.height : 'auto',
            },
            exit: {
              zIndex: 0,
              x: -40,
              opacity: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            },
          }}
          onAnimationComplete={() => {
            // Measure the current content after animation completes
            const content = document.getElementById(
              `tab-content-${activeTabIndex}`,
            )
            if (content) {
              setContentHeight(content.offsetHeight)
              setContentWidth(content.offsetWidth)
            }
          }}
        >
          {tabPanels.map((panel, index) => (
            <div ref={ref} id={`tab-content-${index}`} key={index}>
              {panel}
            </div>
          ))}
        </TransitionPanel>
      </motion.div>
    </Modal>
  )
}
