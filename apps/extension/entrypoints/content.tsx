// Content script for Mindful Tab
import { UI_SELECTOR } from '../src/cs/Content'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BreathingSphere } from '@repo/ui/components/ui/breathing-sphere'
import { cn } from '@repo/ui/src/lib/utils'
import '@repo/ui/src/style/styles.css'
import { vanillaStore } from '../src/bg/state'

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [theme, setTheme] = useState('openness')
  const [breathingPattern, setBreathingPattern] = useState('Equal')

  useEffect(() => {
    // Get stored settings from state
    const state = vanillaStore.getState()
    if (state.theme) {
      setTheme(state.theme)
    }
    if (state.breathingPattern) {
      setBreathingPattern(state.breathingPattern)
    }

    // Handle messages from background script
    const messageListener = (message: any) => {
      if (message && typeof message === 'object' && 'type' in message) {
        if (message.type === 'SHOW_BREATHING_SPHERE') {
          setIsVisible(true)

          setTimeout(() => {
            setIsVisible(false)
          }, 10000)

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

  const handleClick = () => {
    browser.runtime
      .sendMessage({
        type: 'OPEN_SESSION',
        url: chrome.runtime.getURL('session.html'),
        timestamp: Date.now(),
      })
      .catch(e => console.error('Failed to send message:', e))
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-[200px] h-[200px] flex items-center justify-center',
        'cursor-pointer z-[2147483647] bg-transparent',
        'transition-opacity duration-500 ease-in-out',
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
      )}
    >
      <BreathingSphere
        theme={theme}
        breathingPattern={breathingPattern}
        size={12}
        isActive={isVisible}
      />
    </div>
  )
}

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'manual',
  runAt: 'document_end',
  async main(ctx) {
    console.log('Mindful Tab: Content script started')

    try {
      const container = document.createElement('div')
      container.id = UI_SELECTOR
      container.className = cn(
        'fixed top-0 left-0 w-full h-full',
        'pointer-events-none z-[2147483647]',
      )

      document.body.appendChild(container)

      const root = ReactDOM.createRoot(container)
      root.render(<App />)
    } catch (error) {
      console.error('Error in content script:', error)
    }
  },
})
