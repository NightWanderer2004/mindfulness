import React from 'react'
import ReactDOM from 'react-dom/client'
import { BaseApp } from './Base'
import { applicationStoreReadyPromise } from '../bg/state'

function AppWrapper({ AppComponent }: { AppComponent: React.ComponentType }) {
  return (
    <BaseApp>
      <AppComponent />
    </BaseApp>
  )
}

export function renderApp(App: React.ComponentType) {
  applicationStoreReadyPromise
    .then(() => {
      const rootElement = document.getElementById('root')
      if (rootElement) {
        ReactDOM.createRoot(rootElement).render(
          <AppWrapper AppComponent={App} />,
        )
      }
    })
    .catch(console.error)
}
