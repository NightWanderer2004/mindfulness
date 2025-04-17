import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useApplicationStore, vanillaStore } from '../../src/bg/state'
import { motion, AnimatePresence } from 'framer-motion'

// Fix for Chrome types
declare global {
  interface Window {
    chrome: any
  }
}

const ReminderOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const hasPlus = useApplicationStore(state => state.hasPlus)
  const reminder = useApplicationStore(state => state.reminder)
  const sphereType = useApplicationStore(state => state.sphereType) || 'zen'
  const toggleReminder = useApplicationStore(state => state.toggleReminder)

  useEffect(() => {
    if (!hasPlus || !reminder.enabled) return

    // Check if it's time to show the reminder
    const checkReminder = () => {
      const now = Date.now()
      const lastShown = reminder.lastShown || 0
      const frequency = reminder.frequency * 60 * 1000 // convert minutes to ms

      if (now - lastShown >= frequency) {
        // Update the last shown timestamp in the store using the proper method
        vanillaStore.setState(state => ({
          reminder: {
            ...state.reminder,
            lastShown: now,
          },
        }))

        // Show the reminder
        setIsVisible(true)

        // Hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false)
        }, 5000)
      }
    }

    // Initial check
    checkReminder()

    // Set interval to check periodically
    const interval = setInterval(checkReminder, 60000) // check every minute

    return () => {
      clearInterval(interval)
    }
  }, [hasPlus, reminder, toggleReminder])

  const handleClick = () => {
    // Redirect to the meditation session page
    if (typeof window.chrome !== 'undefined' && window.chrome.runtime) {
      window.open(window.chrome.runtime.getURL('session.html'), '_blank')
    }
    setIsVisible(false)
  }

  const getSphereStyle = () => {
    // Return different styles based on sphereType
    switch (sphereType.toLowerCase()) {
      case 'zen':
        return {
          background:
            'radial-gradient(circle, rgba(111,184,237,0.9) 0%, rgba(78,146,200,0.75) 100%)',
        }
      case 'sunshine':
        return {
          background:
            'radial-gradient(circle, rgba(255,215,100,0.9) 0%, rgba(255,177,41,0.75) 100%)',
        }
      case 'blossom':
        return {
          background:
            'radial-gradient(circle, rgba(255,175,204,0.9) 0%, rgba(255,128,157,0.75) 100%)',
        }
      default:
        return {
          background:
            'radial-gradient(circle, rgba(111,184,237,0.9) 0%, rgba(78,146,200,0.75) 100%)',
        }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className='fixed bottom-8 right-8 z-[9999] cursor-pointer'
          onClick={handleClick}
        >
          <div
            className='flex items-center justify-center w-16 h-16 rounded-full shadow-lg'
            style={getSphereStyle()}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className='w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full'
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap px-3 py-1 bg-black/75 text-white text-sm rounded'
          >
            Time for a mindful break
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mount the overlay
const mount = () => {
  // Create container
  const container = document.createElement('div')
  container.id = 'mindful-tab-reminder'
  document.body.appendChild(container)

  // Render component
  const root = createRoot(container)
  root.render(<ReminderOverlay />)
}

// Wait for DOM content to be loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}

export {}
