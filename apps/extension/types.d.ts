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
