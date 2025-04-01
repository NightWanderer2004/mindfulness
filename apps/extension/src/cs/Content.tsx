import React, { useEffect, useState } from "react"
import { BaseApp, createCache } from "./Base"
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
    const [styleCache, setStyleCache] = useState<ReturnType<
      typeof createCache
    > | null>(null)

    useEffect(() => {
      const repoUI = document.querySelector(UI_SELECTOR)
      if (!repoUI || !(repoUI.shadowRoot instanceof ShadowRoot)) {
        console.error("Could not find longlist-ui element or its ShadowRoot")
        return
      }

      const shadowHead = repoUI.shadowRoot.querySelector("head")
      if (!shadowHead) {
        console.error("Could not find head in shadow DOM")
        return
      }

      const styleElement = document.createElement("style")
      styleElement.setAttribute("data-emotion", "wxt-style")
      shadowHead.appendChild(styleElement)

      const cache = createCache({
        key: "wxt-style",
        prepend: true,
        container: styleElement
      })

      setStyleCache(cache)

      return () => {
        shadowHead.removeChild(styleElement)
      }
    }, [])

    if (!styleCache) {
      return null
    }

    return (
      <BaseApp styleCache={styleCache}>
        <WrappedComponent {...(rest as P)} />
      </BaseApp>
    )
  }
}
