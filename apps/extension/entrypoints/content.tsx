import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useApplicationStore, vanillaStore } from '../src/bg/state'

declare global {
  interface Window {
    chrome: any
  }
}

const cssStyles = `
.breathing-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.sphere {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sphere-layer {
  position: absolute;
  border-radius: 50%;
  background-image: radial-gradient(#7dd3fc, #bae6fd, #f0f9ff);
  transform-origin: center center;
  will-change: transform, opacity;
}

.clickable-area {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10000;
}

.sphere-outer {
  width: 300px;
  height: 300px;
  filter: blur(12px);
}

.sphere-middle-outer {
  width: 225px;
  height: 225px;
  filter: blur(10px);
}

.sphere-middle-inner {
  width: 150px;
  height: 150px;
  filter: blur(8px);
}

.sphere-core {
  width: 75px;
  height: 75px;
  filter: blur(4px);
}

.hidden-link {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
`

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sessionLinkRef = React.useRef<HTMLAnchorElement>(null)
  const hasPlus = useApplicationStore(state => state.hasPlus)
  const reminder = useApplicationStore(state => state.reminder)

  useEffect(() => {
    const messageListener = (message: any) => {
      if (message && typeof message === 'object' && 'type' in message) {
        if (message.type === 'SHOW_BREATHING_SPHERE') {
          setIsVisible(true)

          setTimeout(() => {
            setIsVisible(false)
          }, 12000)

          return true
        }

        if (message.type === 'PING') {
          return true
        }
      }
      return undefined
    }

    browser.runtime.onMessage.addListener(messageListener)

    return () => {
      browser.runtime.onMessage.removeListener(messageListener)
    }
  }, [])

  useEffect(() => {
    if (!hasPlus || !reminder.enabled) {
      console.log('Reminders disabled or no Plus subscription')
      return
    }

    console.log('Reminder enabled, hasPlus:', hasPlus, 'settings:', reminder)

    if (reminder.lastShown === null) {
      const now = Date.now()
      console.log(
        'Initializing lastShown timestamp to now:',
        new Date(now).toLocaleString(),
      )
      vanillaStore.setState(state => ({
        reminder: {
          ...state.reminder,
          lastShown: now,
        },
      }))
      return
    }

    const checkReminder = () => {
      const now = Date.now()
      const lastShown = reminder.lastShown || 0
      const frequency = reminder.frequency * 60 * 1000
      const timeElapsed = now - lastShown
      const timeRemaining = frequency - timeElapsed

      console.log(`Last shown: ${new Date(lastShown).toLocaleString()}`)
      console.log(`Current time: ${new Date(now).toLocaleString()}`)
      console.log(
        `Frequency: ${reminder.frequency} minutes (${frequency / 1000} seconds)`,
      )
      console.log(`Time elapsed: ${timeElapsed / 1000} seconds`)
      console.log(`Time remaining: ${timeRemaining / 1000} seconds`)

      if (timeElapsed >= frequency) {
        console.log('Time to show reminder!')

        vanillaStore.setState(state => ({
          reminder: {
            ...state.reminder,
            lastShown: now,
          },
        }))

        setIsVisible(true)

        setTimeout(() => {
          setIsVisible(false)
        }, 12000)
      } else {
        console.log(
          `Reminder will show in ${Math.floor(timeRemaining / 1000)} seconds`,
        )
      }
    }

    const initialCheckTimeout = setTimeout(() => {
      checkReminder()
    }, 2000)

    const frequencyMs = reminder.frequency * 60 * 1000
    const checkInterval = Math.min(frequencyMs / 4, 60000)

    console.log(
      `Setting reminder check interval: ${checkInterval / 1000} seconds`,
    )
    const interval = setInterval(checkReminder, checkInterval)

    return () => {
      clearTimeout(initialCheckTimeout)
      clearInterval(interval)
    }
  }, [hasPlus, reminder])

  const handleClick = () => {
    if (sessionLinkRef.current) {
      sessionLinkRef.current.click()
    }

    setIsVisible(false)
  }

  const getSessionUrl = () => {
    if (typeof window.chrome !== 'undefined' && window.chrome.runtime) {
      return window.chrome.runtime.getURL('/session.html')
    } else if (browser && browser.runtime) {
      return browser.runtime.getURL('/session.html')
    }
    return '#'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='breathing-container'
        >
          <a
            ref={sessionLinkRef}
            href={getSessionUrl()}
            target='_blank'
            rel='noopener noreferrer'
            className='hidden-link'
          >
            Open Session
          </a>

          <div className='clickable-area' onClick={handleClick}></div>
          <SimpleSphere isActive={isVisible} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const SimpleSphere: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const breathingConfig = {
    duration: 6,
    ease: [0.4, 0.0, 0.2, 1],
  }

  return (
    <div className='sphere'>
      <motion.div
        className='sphere-layer sphere-outer'
        initial={{ scale: 0.25, opacity: 0.5 }}
        animate={{
          scale: isActive ? [0.25, 1, 0.25] : 0.25,
          opacity: isActive ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{
          repeat: Infinity,
          duration: breathingConfig.duration,
          ease: breathingConfig.ease,
          times: [0, 0.5, 1],
        }}
      />
      <motion.div
        className='sphere-layer sphere-middle-outer'
        initial={{ scale: 0.25, opacity: 0.6 }}
        animate={{
          scale: isActive ? [0.25, 1, 0.25] : 0.25,
          opacity: isActive ? [0.6, 0.9, 0.6] : 0.6,
        }}
        transition={{
          repeat: Infinity,
          duration: breathingConfig.duration,
          ease: breathingConfig.ease,
          times: [0, 0.5, 1],
          delay: 0.2,
        }}
      />
      <motion.div
        className='sphere-layer sphere-middle-inner'
        initial={{ scale: 0.25, opacity: 0.7 }}
        animate={{
          scale: isActive ? [0.25, 1, 0.25] : 0.25,
          opacity: isActive ? [0.7, 0.95, 0.7] : 0.7,
        }}
        transition={{
          repeat: Infinity,
          duration: breathingConfig.duration,
          ease: breathingConfig.ease,
          times: [0, 0.5, 1],
          delay: 0.4,
        }}
      />
      <motion.div
        className='sphere-layer sphere-core'
        initial={{ scale: 0.25, opacity: 0.8 }}
        animate={{
          scale: isActive ? [0.25, 1, 0.25] : 0.25,
          opacity: isActive ? [0.8, 1, 0.8] : 0.8,
        }}
        transition={{
          repeat: Infinity,
          duration: breathingConfig.duration,
          ease: breathingConfig.ease,
          times: [0, 0.5, 1],
          delay: 0.6,
        }}
      />
    </div>
  )
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_end',

  async main() {
    console.log('Mindful Tab: Content script started')

    try {
      const container = document.createElement('div')
      container.id = 'mindful-tab-ui'
      container.style.position = 'fixed'
      container.style.width = '0'
      container.style.height = '0'
      container.style.top = '0'
      container.style.left = '0'
      document.body.appendChild(container)

      const shadowRoot = container.attachShadow({ mode: 'open' })

      const style = document.createElement('style')
      style.textContent = cssStyles
      shadowRoot.appendChild(style)

      const appContainer = document.createElement('div')
      shadowRoot.appendChild(appContainer)

      const root = ReactDOM.createRoot(appContainer)
      root.render(<App />)
    } catch (error) {
      console.error('Error in content script:', error)
    }
  },
})
