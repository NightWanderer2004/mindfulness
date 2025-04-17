import React from 'react'
import '@repo/ui/src/style/styles.css'

interface BaseAppProps {
  children: React.ReactNode
}

export function BaseApp({ children }: BaseAppProps) {
  return <React.StrictMode>{children}</React.StrictMode>
}
