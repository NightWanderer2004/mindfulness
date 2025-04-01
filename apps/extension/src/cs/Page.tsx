import React from "react"
import ReactDOM from "react-dom/client"
import { BaseApp } from "./Base"
import { applicationStoreReadyPromise } from "../bg/state"

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
      ReactDOM.createRoot(document.getElementById("root")!).render(
        <AppWrapper AppComponent={App} />
      )
    })
    .catch(console.error)
}
