import React from 'react'
import { BaseApp } from './Base'
import '@repo/ui/src/style/styles.css'

interface WithAppProvidersProps {
  container: HTMLElement
}

export const UI_SELECTOR = 'mindfulness-ui'

export function withAppProviders<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function AppProviders(props: P & WithAppProvidersProps) {
    const { container, ...rest } = props

    return (
      <BaseApp>
        <WrappedComponent {...(rest as P)} />
      </BaseApp>
    )
  }
}
