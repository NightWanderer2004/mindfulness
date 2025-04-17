'use client'
import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { TransitionPanel } from './transition-panel'
import { cn } from '../../lib/utils'
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
}

export const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  onClose,
  tabs,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [panelRef, panelBounds] = useMeasure({ polyfill: ResizeObserver })

  useEffect(() => setActiveTabIndex(0), [isOpen])

  const tabsToUse = tabs

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='w-full max-w-sm'>
      <div className='flex flex-col space-y-2.5'>
        <div className='flex justify-between gap-1.5 md:mb-1'>
          {tabsToUse?.map((tab, index) => (
            <button
              key={tab.key}
              className={cn(
                'px-3 py-1 text-base md:text-lg rounded-t-xl rounded-b transition-colors',
                activeTabIndex === index
                  ? 'bg-primary/[8%] text-primary'
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
          className='relative w-full max-w-sm mx-auto'
          animate={{
            height: panelBounds.height,
            width: panelBounds.width,
          }}
          transition={{
            height: { type: 'spring', stiffness: 300, damping: 30 },
            width: { type: 'spring', stiffness: 300, damping: 30 },
            layout: { type: 'spring', stiffness: 300, damping: 30 },
          }}
        >
          <TransitionPanel
            activeIndex={activeTabIndex}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.075, ease: 'linear' },
            }}
            variants={{
              enter: {
                x: 45,
                opacity: 0,
              },
              center: {
                x: 0,
                opacity: 1,
              },
              exit: {
                x: -45,
                opacity: 0,
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
