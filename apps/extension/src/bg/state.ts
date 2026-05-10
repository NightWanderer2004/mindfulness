import { create, useStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { webextStorage } from '../common/storage-enginge'
// @ts-ignore
import { wrapStore } from 'webext-zustand'

import { getExampleService } from './example-service'

export type UserT = {
  id: string
  email: string
  name: string
  image: string
}

export interface BreathingPatternConfig {
  duration: number
  inhale: number
  exhale: number
  hold: number
  holdAfterExhale: number
}

interface ApplicationState {
  user: UserT | undefined
  secretText: string | undefined
  loginStatus: 'idle' | 'loading' | 'success' | 'error'
  hasPlus: boolean
  reminder: {
    enabled: boolean
    frequency: number // in minutes
    lastShown: number | null // timestamp
  }
  customBreathingPatterns: Record<string, BreathingPatternConfig>
  setUser: (user: UserT | undefined) => void
  setLoginStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void
  togglePlus: () => void
  resetPlusFeatures: () => void
  toggleReminder: (enabled?: boolean) => void
  setReminderFrequency: (minutes: number) => void
  addCustomBreathingPattern: (
    name: string,
    config: BreathingPatternConfig,
  ) => void
  removeCustomBreathingPattern: (name: string) => void
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

  // Ensure hasPlus exists; legacy states forced to true

  if (state && !state.reminder) {
    state.reminder = {
      enabled: false,
      frequency: 60, // default to hourly
      lastShown: null,
    }
  }

  if (state && !state.customBreathingPatterns) {
    state.customBreathingPatterns = {}
  }

  // Force Plus enabled across all versions
  if (state) {
    state.hasPlus = true
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
        hasPlus: true,
        reminder: {
          enabled: false,
          frequency: 60, // Default to hourly reminders
          lastShown: null,
        },
        customBreathingPatterns: {},
        theme: 'Softness',
        soundType: 'Ambient',
        sphereType: 'zen',
        breathingPattern: 'Equal',
        meditationTimer: 4,
        setUser: user => set({ user }),
        setLoginStatus: loginStatus => set({ loginStatus }),
        togglePlus: () => set(() => ({ hasPlus: true })),
        resetPlusFeatures: () =>
          set(state => ({
            hasPlus: true,
            theme: 'Softness',
            soundType: 'Ambient',
            breathingPattern: 'Equal',
            customBreathingPatterns: {},
            reminder: {
              ...state.reminder,
              enabled: false,
            },
          })),
        toggleReminder: enabled =>
          set(state => ({
            reminder: {
              ...state.reminder,
              enabled:
                enabled !== undefined ? enabled : !state.reminder.enabled,
            },
          })),
        setReminderFrequency: minutes =>
          set(state => ({
            reminder: {
              ...state.reminder,
              frequency: minutes,
            },
          })),
        addCustomBreathingPattern: (name, config) =>
          set(state => ({
            customBreathingPatterns: {
              ...state.customBreathingPatterns,
              [name]: config,
            },
          })),
        removeCustomBreathingPattern: name =>
          set(state => {
            const patterns = { ...state.customBreathingPatterns }
            delete patterns[name]
            return { customBreathingPatterns: patterns }
          }),
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
        version: 1,
        partialize: state => ({
          user: state.user,
          count: state.count,
          secretText: state.secretText,
          loginStatus: state.loginStatus,
          hasPlus: state.hasPlus,
          reminder: state.reminder,
          customBreathingPatterns: state.customBreathingPatterns,
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
export const useHasPlus = () => useApplicationStore(store => store.hasPlus)
export const useReminder = () => useApplicationStore(store => store.reminder)
export const useCustomBreathingPatterns = () =>
  useApplicationStore(store => store.customBreathingPatterns)
export const csActions = vanillaStore.getState().csActions
export const bgActions = vanillaStore.getState().bgActions

export const applicationStoreReadyPromise = wrapStore(vanillaStore)
