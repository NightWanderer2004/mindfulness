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
  sphereType: string | null
  reminderType?: string | null
  breathingPattern: string | null
  meditationTimer: number | null
  setTheme: (theme: string) => void
  setSoundType: (soundType: string) => void
  setSphereType: (sphereType: string) => void
  setBreathingPattern: (pattern: string) => void
  setMeditationTimer: (timer: number) => void
  csActions: {
    increment: () => void
  }
  bgActions: {
    refreshData: () => Promise<void>
    resetStorage: () => Promise<void>
  }
}

const migrateState = (state: any): any => {
  if (state.reminderType && !state.sphereType) {
    state.sphereType = state.reminderType
  }

  return state
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
        sphereType: 'zen',
        breathingPattern: 'Equal',
        meditationTimer: 10,
        setUser: user => set({ user }),
        setLoginStatus: loginStatus => set({ loginStatus }),
        setTheme: theme => set({ theme }),
        setSoundType: soundType => set({ soundType }),
        setSphereType: sphereType => set({ sphereType }),
        setBreathingPattern: pattern => set({ breathingPattern: pattern }),
        setMeditationTimer: timer => set({ meditationTimer: timer }),
        csActions: {
          increment: () => {
            console.log('Incremented')
            const currentCount = get().count
            set({ count: currentCount + 1 })
          },
        },
        bgActions: {
          refreshData: async () => {
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
          sphereType: state.sphereType,
          breathingPattern: state.breathingPattern,
          meditationTimer: state.meditationTimer,
        }),
        migrate: migrateState,
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
export const useSphereType = () =>
  useApplicationStore(store => store.sphereType)
export const useBreathingPattern = () =>
  useApplicationStore(store => store.breathingPattern)
export const useMeditationTimer = () =>
  useApplicationStore(store => store.meditationTimer)
export const csActions = vanillaStore.getState().csActions
export const bgActions = vanillaStore.getState().bgActions

export const applicationStoreReadyPromise = wrapStore(vanillaStore)
