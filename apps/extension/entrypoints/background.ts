import { registerExampleService } from '../src/bg/example-service'
import { applicationStoreReadyPromise, vanillaStore } from '../src/bg/state'
import { sendAnalyticsEvent } from '../src/common/analytics'

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

  // Track service worker startup (cold start)
  void sendAnalyticsEvent('bg_start')

  // Track extension installation/update
  browser.runtime.onInstalled.addListener(details => {
    const reason = details.reason
    if (reason === 'install') {
      void sendAnalyticsEvent('install', { reason })
    } else if (reason === 'update') {
      void sendAnalyticsEvent('update', { reason })
    } else {
      void sendAnalyticsEvent('onInstalled', { reason })
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

          void sendAnalyticsEvent('open_session', {
            source: 'content_script',
          })
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
