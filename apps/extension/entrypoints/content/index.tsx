import "@repo/ui/styles.css"
import { applicationStoreReadyPromise } from "../../src/bg/state"
import { UI_SELECTOR, withAppProviders } from "../../src/cs/Content"
import React from "react"
import ReactDOM from "react-dom/client"

const App: React.FC = () => {
  return <div>hi hi</div>
}

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  runAt: "document_end",
  main(ctx) {
    // Wait for the selector to exist
    const waitForElement = (selector: string) => {
      return new Promise<Element | null>((resolve) => {
        if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector))
        }

        const observer = new MutationObserver(() => {
          if (document.querySelector(selector)) {
            resolve(document.querySelector(selector))
            observer.disconnect()
          }
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      })
    }

    waitForElement('[data-testid="primaryColumn"]').then(
      async (primaryColumn) => {
        if (!primaryColumn) return

        const ui = await createShadowRootUi(ctx, {
          name: UI_SELECTOR,
          position: "inline",
          anchor: '[data-testid="primaryColumn"]',
          append: "first",
          onMount: (container) => {
            console.log("Mounted")
            const app = document.createElement("div")
            app.id = "root"
            container.append(app)
            let root: ReactDOM.Root
            const AppWithProviders = withAppProviders(App)
            root = ReactDOM.createRoot(app)
            applicationStoreReadyPromise.then(() => {
              root.render(<AppWithProviders container={container} />)
            })
            return root
          },
          onRemove: (root) => {
            root?.unmount()
          }
        })

        ui.mount()
      }
    )
  }
})
