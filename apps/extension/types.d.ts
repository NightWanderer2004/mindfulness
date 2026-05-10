/// <reference types="chrome" />

// No need to redeclare Window.chrome as it's already in chrome types
// The declaration below was causing errors

declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.wav' {
  const src: string
  export default src
}

declare module '*.ogg' {
  const src: string
  export default src
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

// Virtual module provided by @wxt-dev/analytics
declare module '#analytics' {
  export const analytics: {
    track: (eventName: string, props?: Record<string, unknown>) => Promise<void>
    identify?: (
      userId: string,
      traits?: Record<string, unknown>,
    ) => Promise<void>
    page?: (name?: string, props?: Record<string, unknown>) => Promise<void>
  }
}

interface ImportMetaEnv {
  readonly WXT_GA_MEASUREMENT_ID?: string
  readonly WXT_GA_API_SECRET?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
