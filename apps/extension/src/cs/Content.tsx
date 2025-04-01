import React, { useEffect } from "react"
import { BaseApp } from "./Base"
import "@repo/ui/styles.css"

interface WithAppProvidersProps {
  container: HTMLElement
}

export const UI_SELECTOR = "repo-ui"

export function withAppProviders<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AppProviders(props: P & WithAppProvidersProps) {
    const { container, ...rest } = props

    useEffect(() => {
      const repoUI = document.querySelector(UI_SELECTOR)
      if (!repoUI || !(repoUI.shadowRoot instanceof ShadowRoot)) {
        console.error("Could not find longlist-ui element or its ShadowRoot")
        return
      }

      const shadowRoot = repoUI.shadowRoot
      const linkElement = document.createElement("link")
      linkElement.setAttribute("rel", "stylesheet")

      linkElement.setAttribute("href", "/content.css")

      const shadowHead = shadowRoot.querySelector("head")
      if (shadowHead) {
        shadowHead.appendChild(linkElement)
        return () => {
          shadowHead.removeChild(linkElement)
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
