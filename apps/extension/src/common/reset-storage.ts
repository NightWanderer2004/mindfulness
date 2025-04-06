import { localExtStorage } from '@webext-core/storage'
import { vanillaStore } from '../bg/state'

/**
 * Resets all application storage to its initial state
 * This includes:
 * - Zustand store (applicationState)
 * - React Query cache (tanstack-query-cache)
 * - Any other extension storage
 */
export async function resetAllStorage() {
  try {
    // 1. Clear Zustand state from storage
    await localExtStorage.removeItem('applicationState')

    // 2. Reset in-memory state to default values
    vanillaStore.setState({
      user: undefined,
      count: 0,
      secretText: undefined,
      loginStatus: 'idle',
      theme: '',
      soundType: '',
    })

    // 3. Clear React Query persister cache
    await localExtStorage.removeItem('tanstack-query-cache')

    // 4. For development, log confirmation
    console.log('✅ Storage reset completed successfully')

    return true
  } catch (error) {
    console.error('❌ Failed to reset storage:', error)
    return false
  }
}
