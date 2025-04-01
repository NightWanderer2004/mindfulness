import { create, useStore } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { webextStorage } from "../common/storage-enginge"
// @ts-ignore
import { wrapStore } from "webext-zustand"

import type { User } from "@repo/db/index"
import { getExampleService } from "./example-service"

interface ApplicationState {
  user: User | undefined
  secretText: string | undefined
  loginStatus: "idle" | "loading" | "success" | "error"
  setUser: (user: User | undefined) => void
  setLoginStatus: (status: "idle" | "loading" | "success" | "error") => void
  count: number
  csActions: {
    increment: () => void
  }
  bgActions: {
    refreshData: () => Promise<void>
  }
}

const createVanillaStore = () =>
  create<ApplicationState>()(
    persist(
      (set, get) => ({
        user: undefined,
        count: 0,
        secretText: undefined,
        loginStatus: "idle",
        setUser: (user) => set({ user }),
        setLoginStatus: (loginStatus) => set({ loginStatus }),
        csActions: {
          increment: () => {
            console.log("Incremented")
            const currentCount = get().count
            set({ count: currentCount + 1 })
          }
        },
        bgActions: {
          refreshData: async () => {
            // Run in background,
            // Save result to state
            // Front end / Content Script automatically updates
            const service = getExampleService()
            const secret = await service.doSomething()
            set({ secretText: secret })
          }
        }
      }),
      {
        name: "applicationState",
        storage: createJSONStorage(() => webextStorage),
        partialize: (state) => ({
          user: state.user,
          count: state.count,
          secretText: state.secretText,
          loginStatus: state.loginStatus
        })
      }
    )
  )

export const vanillaStore = createVanillaStore()
export const useApplicationStore = <T>(
  selector: (state: ApplicationState) => T
) => useStore(vanillaStore, selector)

export const useSecret = () => useApplicationStore((store) => store.secretText)
export const useCount = () => useApplicationStore((store) => store.count)
export const csActions = vanillaStore.getState().csActions
export const bgActions = vanillaStore.getState().bgActions

export const applicationStoreReadyPromise = wrapStore(vanillaStore)
