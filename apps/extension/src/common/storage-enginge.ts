import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { localExtStorage } from '@webext-core/storage'
import { vanillaStore } from '../bg/state'

// Custom storage object
export const webextStorage: StateStorage = {
  getItem: async (name: string) => {
    return (await localExtStorage.getItem(name)) || null
  },
  setItem: async (name: string, value: string) => {
    await localExtStorage.setItem(name, value)
  },
  removeItem: async (name: string) => {
    await localExtStorage.removeItem(name)
  },
}

export const clearStorage = async () => {
  await localExtStorage.clear()

  vanillaStore.setState({
    user: undefined,
    count: 0,
    secretText: undefined,
    loginStatus: 'idle',
    theme: '',
    soundType: '',
    reminderType: '',
    meditationTimer: 10,
    sphereType: 'zen',
  })
}
