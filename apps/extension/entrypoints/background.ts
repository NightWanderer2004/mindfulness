import { registerExampleService } from '../src/bg/example-service'
import { applicationStoreReadyPromise, vanillaStore } from '../src/bg/state'

// Simplified interface for messages
interface ContentScriptMessage {
  type: string
  timestamp: number
  url?: string
  [key: string]: any
}

let isInitialized = false
export default defineBackground(() => {
  console.log('Mindfulness background script initialized')
  registerExampleService()

  // Set up an alarm to show the breathing sphere every 3 seconds (for development)
  // This will be changed to 30 minutes in production
  browser.alarms.create('showBreathingSphere', { periodInMinutes: 0.05 }) // 3 seconds

  // Listen for alarm events
  browser.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'showBreathingSphere') {
      // Get active tabs and trigger the sphere to appear
      browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        tabs.forEach(tab => {
          if (tab.id && tab.url && !tab.url.startsWith('chrome:')) {
            // First check if we can access this tab
            browser.tabs
              .sendMessage(tab.id, {
                type: 'PING',
                timestamp: Date.now(),
              })
              .catch(() => {
                // Content script isn't loaded, inject it if we have permission
                if (tab.id && tab.url && !tab.url.startsWith('chrome:')) {
                  browser.scripting
                    .executeScript({
                      target: { tabId: tab.id },
                      files: ['/content.js'],
                    })
                    .then(() => {
                      // After injection, send the actual message
                      setTimeout(() => {
                        browser.tabs
                          .sendMessage(tab.id as number, {
                            type: 'SHOW_BREATHING_SPHERE',
                            timestamp: Date.now(),
                          })
                          .catch(err => console.log('Tab not ready yet:', err))
                      }, 500)
                    })
                    .catch(err => {
                      console.log(
                        `Cannot inject script into ${tab.url}: ${err.message}`,
                      )
                    })
                }
              })
          }
        })
      })
    }
  })

  // Handle messages from content script
  browser.runtime.onMessage.addListener(
    (message: unknown, sender, sendResponse) => {
      if (
        message &&
        typeof message === 'object' &&
        'type' in message &&
        'timestamp' in message
      ) {
        const typedMessage = message as ContentScriptMessage

        if (typedMessage.type === 'OPEN_SESSION' && typedMessage.url) {
          // Open session.html in a new tab
          browser.tabs
            .create({ url: typedMessage.url })
            .catch(err => console.error('Failed to open session page:', err))
        }
      }
      return undefined
    },
  )

  applicationStoreReadyPromise.then(() => {
    vanillaStore.subscribe(async state => {
      if (!isInitialized) {
        state.bgActions.refreshData()
        isInitialized = true
      }
    })
  })
})
