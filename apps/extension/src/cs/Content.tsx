import React, { useEffect } from 'react'
import { BaseApp } from './Base'
import '@repo/ui/styles.css'

interface WithAppProvidersProps {
  container: HTMLElement
}

export const UI_SELECTOR = 'repo-ui'

export function withAppProviders<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function AppProviders(props: P & WithAppProvidersProps) {
    const { container, ...rest } = props

    useEffect(() => {
      console.log('withAppProviders hook running')
      // We need to find the shadow root containing our element
      const shadowHost =
        document.querySelector(`.${UI_SELECTOR}`) ||
        document.querySelector(`#${UI_SELECTOR}`)

      if (!shadowHost || !(shadowHost.shadowRoot instanceof ShadowRoot)) {
        console.error(
          `Could not find ${UI_SELECTOR} element or its ShadowRoot`,
          shadowHost,
        )
        return
      }

      console.log('Found shadow root:', shadowHost.shadowRoot)

      // Add stylesheet to shadow root if needed
      const shadowRoot = shadowHost.shadowRoot
      const existingLink = shadowRoot.querySelector('link[href="/content.css"]')

      if (!existingLink) {
        const linkElement = document.createElement('link')
        linkElement.setAttribute('rel', 'stylesheet')
        linkElement.setAttribute('href', '/content.css')

        // Append to shadow root directly or to head if it exists
        shadowRoot.appendChild(linkElement)

        return () => {
          shadowRoot.removeChild(linkElement)
        }
      }
    }, [])

    return (
      <BaseApp>
        <WrappedComponent {...(rest as P)} />
      </BaseApp>
    )
  }
}
