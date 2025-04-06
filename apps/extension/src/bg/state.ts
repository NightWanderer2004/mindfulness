import { create, useStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { webextStorage } from '../common/storage-enginge'
// @ts-ignore
import { wrapStore } from 'webext-zustand'

import type { User } from '@repo/db/index'
import { getExampleService } from './example-service'

interface ApplicationState {
  user: User | undefined
  secretText: string | undefined
  loginStatus: 'idle' | 'loading' | 'success' | 'error'
  setUser: (user: User | undefined) => void
  setLoginStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void
  count: number
  theme: string | null
  soundType: string | null
  setTheme: (theme: string) => void
  setSoundType: (soundType: string) => void
  csActions: {
    increment: () => void
  }
  bgActions: {
    refreshData: () => Promise<void>
    resetStorage: () => Promise<void>
  }
}

const createVanillaStore = () =>
  create<ApplicationState>()(
    persist(
      (set, get) => ({
        user: undefined,
        count: 0,
        secretText: undefined,
        loginStatus: 'idle',
        theme: '',
        soundType: '',
        setUser: user => set({ user }),
        setLoginStatus: loginStatus => set({ loginStatus }),
        setTheme: theme => set({ theme }),
        setSoundType: soundType => set({ soundType }),
        csActions: {
          increment: () => {
            console.log('Incremented')
            const currentCount = get().count
            set({ count: currentCount + 1 })
          },
        },
        bgActions: {
          refreshData: async () => {
            // Run in background,
            // Save result to state
            // Front end / Content Script automatically updates
            const service = getExampleService()
            const secret = await service.doSomething()
            set({ secretText: secret })
          },
          resetStorage: async () => {
            const { clearStorage } = await import('../common/storage-enginge')
            return clearStorage()
          },
        },
      }),
      {
        name: 'applicationState',
        storage: createJSONStorage(() => webextStorage),
        partialize: state => ({
          user: state.user,
          count: state.count,
          secretText: state.secretText,
          loginStatus: state.loginStatus,
          theme: state.theme,
          soundType: state.soundType,
        }),
      },
    ),
  )

export const vanillaStore = createVanillaStore()
export const useApplicationStore = <T>(
  selector: (state: ApplicationState) => T,
) => useStore(vanillaStore, selector)

export const useSecret = () => useApplicationStore(store => store.secretText)
export const useCount = () => useApplicationStore(store => store.count)
export const useTheme = () => useApplicationStore(store => store.theme)
export const useSoundType = () => useApplicationStore(store => store.soundType)
export const csActions = vanillaStore.getState().csActions
export const bgActions = vanillaStore.getState().bgActions

export const applicationStoreReadyPromise = wrapStore(vanillaStore)
