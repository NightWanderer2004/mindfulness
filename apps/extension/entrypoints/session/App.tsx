import React, { useEffect, useState, useRef } from 'react'
import { useApplicationStore, vanillaStore } from '../../src/bg/state'
import { motion } from 'framer-motion'
import { AnimatedButton } from '@repo/ui/components/ui/animated-btn'
import { Modal } from '@repo/ui/components/ui/modal'
import { ThemeSelector } from '@repo/ui/components/ui/theme-selector'
import { SoundTypeSelector } from '@repo/ui/components/ui/sound-type-selector'
import { appIcons, animations } from '@repo/ui/src/lib/utils'
type ImageImport = {
  default: string
}

type ThemeType =
  | 'harmony'
  | 'wandering'
  | 'openness'
  | 'confidence'
  | 'softness'
  | 'tiredness'

type SoundType = 'ambient' | 'nature' | 'mono'

const audioLoaders: Record<
  SoundType,
  Record<ThemeType, () => Promise<ImageImport>>
> = {
  ambient: {
    harmony: () => import('../../assets/music/harmony.mp3'),
    wandering: () => import('../../assets/music/wandering.mp3'),
    openness: () => import('../../assets/music/openness.mp3'),
    confidence: () => import('../../assets/music/confidence.mp3'),
    softness: () => import('../../assets/music/softness.mp3'),
    tiredness: () => import('../../assets/music/tiredness.mp3'),
  },
  nature: {
    harmony: () => import('../../assets/nature/harmony.mp3'),
    wandering: () => import('../../assets/nature/wandering.mp3'),
    openness: () => import('../../assets/nature/openness.mp3'),
    confidence: () => import('../../assets/nature/confidence.mp3'),
    softness: () => import('../../assets/nature/softness.mp3'),
    tiredness: () => import('../../assets/nature/tiredness.mp3'),
  },
  mono: {
    harmony: () => import('../../assets/mono/harmony.mp3'),
    wandering: () => import('../../assets/mono/wandering.mp3'),
    openness: () => import('../../assets/mono/openness.mp3'),
    confidence: () => import('../../assets/mono/confidence.mp3'),
    softness: () => import('../../assets/mono/softness.mp3'),
    tiredness: () => import('../../assets/mono/tiredness.mp3'),
  },
}

const imageMap: Record<
  ThemeType,
  Record<number, () => Promise<ImageImport>>
> = {
  harmony: {
    1: () => import('../../assets/wall/harmony-1.png'),
    2: () => import('../../assets/wall/harmony-2.png'),
    3: () => import('../../assets/wall/harmony-3.png'),
  },
  wandering: {
    1: () => import('../../assets/wall/wandering-1.png'),
    2: () => import('../../assets/wall/wandering-2.png'),
    3: () => import('../../assets/wall/wandering-3.png'),
  },
  openness: {
    1: () => import('../../assets/wall/openness-1.png'),
    2: () => import('../../assets/wall/openness-2.png'),
    3: () => import('../../assets/wall/openness-3.png'),
  },
  confidence: {
    1: () => import('../../assets/wall/confidence-1.png'),
    2: () => import('../../assets/wall/confidence-2.png'),
    3: () => import('../../assets/wall/confidence-3.png'),
  },
  softness: {
    1: () => import('../../assets/wall/softness-1.png'),
    2: () => import('../../assets/wall/softness-2.png'),
    3: () => import('../../assets/wall/softness-3.png'),
  },
  tiredness: {
    1: () => import('../../assets/wall/tiredness-1.png'),
    2: () => import('../../assets/wall/tiredness-2.png'),
    3: () => import('../../assets/wall/tiredness-3.png'),
  },
}

const movementMultiplier = 0.025

const App: React.FC = () => {
  const theme = useApplicationStore(state => state.theme)
  const soundType = useApplicationStore(state => state.soundType)
  const setTheme = useApplicationStore(state => state.setTheme)
  const setSoundType = useApplicationStore(state => state.setSoundType)

  const [backgroundUrl, setBackgroundUrl] = useState<string>('')
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false)
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false)

  const imageNumberRef = useRef<number>(0)
  const previousThemeRef = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isAudioTransitioning = useRef<boolean>(false)

  const [isHovering, setIsHovering] = useState<boolean>(false)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const backgroundRef = useRef<HTMLDivElement>(null)

  const stopAudioSmoothly = async (audio: HTMLAudioElement): Promise<void> => {
    return new Promise<void>(resolve => {
      if (!audio) {
        resolve()
        return
      }

      const fadeOutInterval = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1
        } else {
          clearInterval(fadeOutInterval)
          audio.pause()
          audio.currentTime = 0
          resolve()
        }
      }, 50)
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window

        const x = (clientX / innerWidth) * 100
        const y = (clientY / innerHeight) * 100

        setMousePosition({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!theme) {
      const store = vanillaStore.getState()
      vanillaStore.setState({ ...store, theme: 'Softness' })
    }

    if (!soundType) {
      const store = vanillaStore.getState()
      vanillaStore.setState({ ...store, soundType: 'Ambient' })
    }
  }, [])

  useEffect(() => {
    if (!theme) return

    const themeName = theme.toLowerCase() as ThemeType
    const maxImages = Object.keys(imageMap[themeName] || {}).length
    imageNumberRef.current = Math.floor(Math.random() * maxImages) + 1
    const imageNum = imageNumberRef.current

    const imageLoader = imageMap[themeName]?.[imageNum]

    if (imageLoader) {
      imageLoader()
        .then((module: ImageImport) => {
          setBackgroundUrl(`url(${module.default})`)
        })
        .catch((error: Error) => {
          console.error('Failed to load image:', error)
        })
    } else {
      console.error(
        `No image found for theme: ${themeName}, number: ${imageNum}`,
      )
    }
  }, [theme])

  useEffect(() => {
    if (!theme || !soundType) return

    const themeChanged = previousThemeRef.current !== theme
    previousThemeRef.current = theme

    if (themeChanged && audioRef.current) {
      stopAudioSmoothly(audioRef.current).then(() => {
        audioRef.current = null
      })
      return
    }

    if (isAudioTransitioning.current) return
    isAudioTransitioning.current = true

    const loadAndPlayAudio = async () => {
      try {
        if (audioRef.current) {
          await stopAudioSmoothly(audioRef.current)
        }

        const themeName = theme.toLowerCase() as ThemeType
        const currentSoundType = soundType.toLowerCase() as SoundType

        const soundTypeLoaders = audioLoaders[currentSoundType]
        const audioLoader = soundTypeLoaders?.[themeName]

        if (audioLoader) {
          const audioModule = await audioLoader()
          const newAudio = new Audio(audioModule.default)

          newAudio.loop = true
          newAudio.volume = 0.7
          newAudio.preload = 'auto'

          audioRef.current = newAudio

          await newAudio.play()
        }
      } catch (error) {
        console.error('Audio error:', error)
      } finally {
        isAudioTransitioning.current = false
      }
    }

    loadAndPlayAudio()

    return () => {
      if (audioRef.current) {
        stopAudioSmoothly(audioRef.current)
      }
    }
  }, [theme, soundType])

  const parallaxX = (50 - mousePosition.x) * movementMultiplier
  const parallaxY = (50 - mousePosition.y) * movementMultiplier

  const handleThemeSelection = (selectedTheme: string) => {
    setTheme(selectedTheme)
    setIsThemeModalOpen(false)
  }

  const handleSoundTypeSelection = (selectedSoundType: string) => {
    setSoundType(selectedSoundType)
    setIsSoundModalOpen(false)
  }

  const getThemeIcon = () => {
    if (!theme) return appIcons.utility.themes
    const themeKey = theme.toLowerCase()
    return (
      appIcons.themeIcons[themeKey as keyof typeof appIcons.themeIcons] ||
      appIcons.utility.themes
    )
  }

  const getSoundIcon = () => {
    if (!soundType) return appIcons.utility.sound
    const soundKey = soundType.toLowerCase().replace(/\s+/g, '')
    return (
      appIcons.soundIcons[soundKey as keyof typeof appIcons.soundIcons] ||
      appIcons.utility.sound
    )
  }

  return (
    <div
      ref={backgroundRef}
      className='overflow-hidden flex min-h-screen flex-col items-center justify-end bg-background bg-no-repeat bg-[100%] lg:bg-[105%]'
      style={{
        backgroundImage: backgroundUrl,
        backgroundPosition: `calc(50% + ${parallaxX}px) calc(50% + ${parallaxY}px)`,
        transition:
          'background-position 0.1s ease-out, background-image 0.1s ease-out',
      }}
    >
      <motion.div
        className='absolute inset-0 bg-background pointer-events-none'
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: 'easeInOut' }}
      />
      <div className='relative max-w-md w-full'>
        <motion.div
          className='relative w-full h-[55px] overflow-hidden'
          transition={{ duration: 0.3, ease: animations.easing.smooth }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <motion.div
            className='absolute w-full flex items-center justify-center bottom-3 pointer-events-none'
            initial={{ opacity: 1 }}
            animate={{
              opacity: isHovering ? 0 : 1,
              y: [-1.35, 1.35, -1.35, 1.35],
            }}
            transition={{
              y: {
                duration: 5.25,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
              opacity: { duration: 0.2, ease: 'linear' },
            }}
          >
            <div className='w-12 h-1.5 bg-background/70 rounded-full' />
          </motion.div>

          <motion.div
            className='flex items-end justify-center gap-5'
            initial={{ y: 55 }}
            animate={{ y: isHovering ? 0 : 55 }}
            transition={{ duration: 0.5, ease: animations.easing.smooth }}
          >
            <AnimatedButton
              className='max-w-[180px] !bg-background/90'
              label={theme ? `${theme}` : 'Choose Theme'}
              icon={getThemeIcon()}
              onClick={() => setIsThemeModalOpen(true)}
            />
            <AnimatedButton
              className='max-w-[180px] !bg-background/90'
              label={soundType ? `${soundType}` : 'Choose Sound'}
              icon={getSoundIcon()}
              onClick={() => setIsSoundModalOpen(true)}
            />
          </motion.div>
        </motion.div>
      </div>

      <Modal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      >
        <ThemeSelector
          selectedTheme={theme}
          setSelectedTheme={handleThemeSelection}
          icons={appIcons.themeIcons}
        />
      </Modal>

      <Modal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
      >
        <SoundTypeSelector
          selectedSoundType={soundType}
          setSelectedSoundType={handleSoundTypeSelection}
          icons={appIcons.soundIcons}
        />
      </Modal>
    </div>
  )
}

export default App
