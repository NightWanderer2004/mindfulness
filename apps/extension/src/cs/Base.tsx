import React from "react"
import { CssBaseline } from "@mui/material"
import { repoTheme } from "@repo/ui/theme"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { localExtStorage } from "@webext-core/storage"
import { CacheProvider, ThemeProvider } from "@emotion/react"
import { Toaster } from "sonner"
import createCache from "@emotion/cache"
import "@repo/ui/src/style/styles.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24
    }
  }
})

const persister = createAsyncStoragePersister({
  storage: localExtStorage
})

interface BaseAppProps {
  children: React.ReactNode
  styleCache: ReturnType<typeof createCache>
}

export function BaseApp({ children, styleCache }: BaseAppProps) {
  return (
    <React.StrictMode>
      <CacheProvider value={styleCache}>
        <ThemeProvider theme={repoTheme}>
          <CssBaseline />
          <Toaster richColors />
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}>
            {children}
          </PersistQueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>
  )
}

export { createCache, queryClient }
