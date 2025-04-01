import { registerExampleService } from "../src/bg/example-service"

import { applicationStoreReadyPromise, vanillaStore } from "../src/bg/state"

let isInitialized = false
export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id })
  registerExampleService()

  applicationStoreReadyPromise.then(() => {
    vanillaStore.subscribe(async (state) => {
      if (!isInitialized) {
        state.bgActions.refreshData()
        console.log("Run an init actions from state when service boots up")
        isInitialized = true
      } else {
        console.log("Initialized already")
      }
    })
  })
})
