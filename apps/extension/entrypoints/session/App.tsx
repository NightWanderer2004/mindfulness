import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useApplicationStore, vanillaStore } from '../../src/bg/state'
import { motion } from 'framer-motion'
import { Modal } from '@repo/ui/components/ui/modal'
import { ThemeSelector } from '@repo/ui/components/ui/theme-selector'
import { SoundTypeSelector } from '@repo/ui/components/ui/sound-type-selector'
import { ThemeSoundControls } from '@repo/ui/components/ui/theme-sound-controls'
import { BreathingSphere } from '@repo/ui/components/ui/breathing-sphere'
import { FlashScreen } from '@repo/ui/components/ui/flash-screen'
import { MeditationTimer } from '@repo/ui/components/ui/meditation-timer'
import { appIcons, cn, type ChromeTab } from '@repo/ui/src/lib/utils'
// import { PlusPackContent } from '@repo/ui/components/ui/plus-pack-modal'

type ImageImport = {
  default: string
}

type ThemeType =
  | 'harmony'
  | 'wandering'
  | 'openness'
  | 'confident'
  | 'softness'
  | 'tiredness'

type SoundType = 'ambient' | 'nature'

const loadMusicTrack = (theme: ThemeType, trackNumber: number) => {
  return import(
    `../../assets/music/${theme}/${theme.toUpperCase()}_0${trackNumber}.mp3`
  )
}

const loadSingleTrack = (soundType: SoundType, theme: ThemeType) => {
  return import(`../../assets/${soundType}/${theme}.mp3`)
}

// Get random track number between 1 and maxTracks
const getRandomTrackNumber = (maxTracks = 2) => {
  return Math.floor(Math.random() * maxTracks) + 1
}

const imageMap: Record<
  ThemeType,
  Record<number, () => Promise<ImageImport>>
> = {
  harmony: {
    1: () => import('../../assets/wall/harmony-1.png'),
    2: () => import('../../assets/wall/harmony-2.png'),
  },
  wandering: {
    1: () => import('../../assets/wall/wandering-1.png'),
    2: () => import('../../assets/wall/wandering-2.png'),
  },
  openness: {
    1: () => import('../../assets/wall/openness-1.png'),
    2: () => import('../../assets/wall/openness-2.png'),
  },
  confident: {
    1: () => import('../../assets/wall/confident-1.png'),
    2: () => import('../../assets/wall/confident-2.png'),
  },
  softness: {
    1: () => import('../../assets/wall/softness-1.png'),
    2: () => import('../../assets/wall/softness-2.png'),
  },
  tiredness: {
    1: () => import('../../assets/wall/tiredness-1.png'),
    2: () => import('../../assets/wall/tiredness-2.png'),
  },
}

const movementMultiplier = 0.025

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const App: React.FC = () => {
  const theme = useApplicationStore(state => state.theme)
  const soundType = useApplicationStore(state => state.soundType)
  const sphereType = useApplicationStore(state => state.sphereType)
  const breathingPattern = useApplicationStore(state => state.breathingPattern)
  const customBreathingPatterns = useApplicationStore(
    state => state.customBreathingPatterns,
  )
  const meditationTimer =
    useApplicationStore(state => state.meditationTimer) ?? 10
  const hasPlus = useApplicationStore(state => state.hasPlus)
  const togglePlus = useApplicationStore(state => state.togglePlus)
  const resetPlusFeatures = useApplicationStore(
    state => state.resetPlusFeatures,
  )

  const setTheme = useApplicationStore(state => state.setTheme)
  const setSoundType = useApplicationStore(state => state.setSoundType)

  const [backgroundUrl, setBackgroundUrl] = useState<string>('')
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false)
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false)
  const [isPlusModalOpen, setIsPlusModalOpen] = useState<boolean>(false)
  const [currentTrackNumber, setCurrentTrackNumber] = useState<number>(
    getRandomTrackNumber(),
  )
  const [isAutoChangeEnabled, setIsAutoChangeEnabled] = useState<boolean>(true)
  const [showFlashScreen, setShowFlashScreen] = useState<boolean>(false)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(true)
  const [isBottomAreaHovering, setIsBottomAreaHovering] = useState(false)

  const imageNumberRef = useRef<number>(0)
  const previousThemeRef = useRef<string | null>(null)
  const previousSoundTypeRef = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isAudioTransitioning = useRef<boolean>(false)

  const backgroundRef = useRef<HTMLDivElement>(null)
  const autoChangeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleTimerComplete = useCallback(() => {
    setShowFlashScreen(true)
  }, [])

  const handleEndSession = useCallback(() => {
    const openNewTabAndCloseCurrent = () => {
      try {
        const chromeAPI =
          typeof window !== 'undefined' ? window.chrome : undefined
        if (chromeAPI?.tabs) {
          chromeAPI.tabs.query(
            { active: true, currentWindow: true },
            (tabs: ChromeTab[]) => {
              const currentTabId = tabs?.[0]?.id
              chromeAPI.tabs.create({}, () => {
                if (currentTabId) {
                  chromeAPI.tabs.remove(currentTabId)
                } else if (typeof window !== 'undefined') {
                  window.close()
                }
              })
            },
          )
          return
        }
      } catch {}

      if (typeof window !== 'undefined') {
        window.close()
      }
    }

    if (audioRef.current) {
      stopAudioSmoothly(audioRef.current, true).finally(
        openNewTabAndCloseCurrent,
      )
    } else {
      openNewTabAndCloseCurrent()
    }
  }, [])

  const handleFlashComplete = useCallback(() => {
    // Reuse the same logic as manual end: stop audio, open new tab, close current
    handleEndSession()
  }, [handleEndSession])

  const handlePauseBreathing = useCallback(() => {
    setIsBreathingActive(false)
  }, [])

  const handleResumeBreathing = useCallback(() => {
    setIsBreathingActive(true)
  }, [])

  const handleFadeAudioNearEnd = useCallback(() => {
    if (audioRef.current && audioRef.current.volume > 0.1) {
      // Gradually fade out over 3 seconds
      const fadeOutInterval = setInterval(() => {
        if (audioRef.current) {
          if (audioRef.current.volume > 0.1) {
            audioRef.current.volume -= 0.1
          } else {
            clearInterval(fadeOutInterval)
          }
        } else {
          clearInterval(fadeOutInterval)
        }
      }, 300)
    }
  }, [])

  const stopAudioSmoothly = async (
    audio: HTMLAudioElement,
    shouldFade = true,
  ): Promise<void> => {
    return new Promise<void>(resolve => {
      if (!audio) {
        resolve()
        return
      }

      if (shouldFade) {
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
      } else {
        audio.pause()
        audio.currentTime = 0
        resolve()
      }
    })
  }

  useEffect(() => {
    if (!theme) {
      const store = vanillaStore.getState()
      vanillaStore.setState({ ...store, theme: 'Softness' })
    }

    if (!soundType) {
      const store = vanillaStore.getState()
      vanillaStore.setState({ ...store, soundType: 'Ambient' })
    }

    if (!sphereType) {
      const store = vanillaStore.getState()
      vanillaStore.setState({ ...store, sphereType: 'Light' })
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
    if (!theme || !isAutoChangeEnabled) return

    const changeBackground = () => {
      const themeName = theme.toLowerCase() as ThemeType
      const maxImages = Object.keys(imageMap[themeName] || {}).length

      let nextImageNum = (imageNumberRef.current % maxImages) + 1
      imageNumberRef.current = nextImageNum

      const imageLoader = imageMap[themeName]?.[nextImageNum]

      if (imageLoader) {
        imageLoader()
          .then((module: ImageImport) => {
            setBackgroundUrl(`url(${module.default})`)
          })
          .catch((error: Error) => {
            console.error('Failed to load image:', error)
          })
      }
    }

    autoChangeIntervalRef.current = setInterval(changeBackground, 90000) // 90 seconds

    return () => {
      if (autoChangeIntervalRef.current) {
        clearInterval(autoChangeIntervalRef.current)
        autoChangeIntervalRef.current = null
      }
    }
  }, [theme, isAutoChangeEnabled])

  useEffect(() => {
    if (!theme || !soundType) return

    const themeChanged = previousThemeRef.current !== theme
    const soundTypeChanged = previousSoundTypeRef.current !== soundType
    const currentSoundType = soundType.toLowerCase() as SoundType

    previousThemeRef.current = theme
    previousSoundTypeRef.current = soundType

    if (themeChanged || soundTypeChanged) {
      if (audioRef.current) {
        const shouldFade = currentSoundType === 'ambient'
        stopAudioSmoothly(audioRef.current, shouldFade).then(() => {
          audioRef.current = null
          if (currentSoundType === 'ambient') {
            setCurrentTrackNumber(getRandomTrackNumber())
          } else {
            setCurrentTrackNumber(1)
          }
          playAudio()
        })
      } else {
        if (currentSoundType === 'ambient') {
          setCurrentTrackNumber(getRandomTrackNumber())
        } else {
          setCurrentTrackNumber(1)
        }
        playAudio()
      }
    }

    async function playAudio() {
      if (isAudioTransitioning.current || !theme || !soundType) return
      isAudioTransitioning.current = true

      try {
        if (audioRef.current) {
          const shouldFade = currentSoundType === 'ambient'
          await stopAudioSmoothly(audioRef.current, shouldFade)
        }

        const themeName = theme.toLowerCase() as ThemeType

        try {
          let audioModule

          if (currentSoundType === 'ambient') {
            audioModule = await loadMusicTrack(themeName, currentTrackNumber)
          } else {
            audioModule = await loadSingleTrack(currentSoundType, themeName)
          }

          const newAudio = new Audio(audioModule.default)
          newAudio.volume = 0.7
          newAudio.preload = 'auto'

          if (currentSoundType === 'ambient') {
            newAudio.addEventListener('ended', () => {
              const nextTrack = getRandomTrackNumber()
              setCurrentTrackNumber(nextTrack)
            })
          } else {
            newAudio.loop = true
          }

          audioRef.current = newAudio
          await newAudio.play()
        } catch (error) {
          console.error(
            `Failed to load audio for theme ${themeName} with sound type ${currentSoundType}:`,
            error,
          )

          if (currentSoundType === 'ambient') {
            setCurrentTrackNumber(getRandomTrackNumber())
          }
        }
      } catch (error) {
        console.error('Audio error:', error)
      } finally {
        isAudioTransitioning.current = false
      }
    }

    playAudio()

    return () => {
      if (audioRef.current) {
        const shouldFade = currentSoundType === 'ambient'
        stopAudioSmoothly(audioRef.current, shouldFade)
      }
    }
  }, [theme, soundType, currentTrackNumber])

  const handleThemeSelection = (selectedTheme: string) => {
    setTheme(selectedTheme)
    setIsThemeModalOpen(false)
  }

  const handleSoundTypeSelection = (selectedSoundType: string) => {
    setSoundType(selectedSoundType)
    setIsSoundModalOpen(false)
  }

  const handlePlusToggle = () => {
    if (hasPlus) {
      resetPlusFeatures()
    } else {
      togglePlus()
    }
    setIsPlusModalOpen(false)
  }

  const handleShowPlusModal = () => {
    setIsPlusModalOpen(true)
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
      className='overflow-hidden flex min-h-screen flex-col items-center justify-between bg-background bg-no-repeat bg-cover'
      style={{
        backgroundImage: backgroundUrl,
        transition: 'background-image 0.75s ease-out',
      }}
    >
      {/* Start splash */}
      <motion.div
        className='absolute inset-0 z-50 bg-background pointer-events-none'
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: 'easeInOut' }}
      />

      <div className='absolute inset-0 flex items-center justify-center'>
        <BreathingSphere
          theme={theme}
          breathingPattern={breathingPattern}
          customPatterns={hasPlus ? customBreathingPatterns : {}}
          isActive={isBreathingActive}
        />
      </div>

      {/* Flash screen for timer completion */}
      <FlashScreen
        isActive={showFlashScreen}
        onFlashComplete={handleFlashComplete}
        duration={1500}
      />

      <div
        className={cn(
          'absolute bottom-0 w-full z-10 flex flex-col items-center transition-all duration-300',
          isBottomAreaHovering ? 'gap-3' : 'gap-5',
        )}
      >
        <MeditationTimer
          meditationTimer={meditationTimer}
          theme={theme || undefined}
          onTimerComplete={handleTimerComplete}
          onPause={handlePauseBreathing}
          onResume={handleResumeBreathing}
          fadeAudioNearEnd={handleFadeAudioNearEnd}
          isHovering={isBottomAreaHovering}
        />

        <ThemeSoundControls
          theme={theme}
          soundType={soundType}
          getThemeIcon={getThemeIcon}
          getSoundIcon={getSoundIcon}
          onThemeClick={() => setIsThemeModalOpen(true)}
          onSoundClick={() => setIsSoundModalOpen(true)}
          onHoverStateChange={setIsBottomAreaHovering}
          onEndSession={handleEndSession}
        />
      </div>

      <Modal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      >
        <ThemeSelector
          selectedTheme={theme}
          setSelectedTheme={handleThemeSelection}
          icons={appIcons.themeIcons}
          hasPro={hasPlus}
          onProToggle={handleShowPlusModal}
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
          hasPro={hasPlus}
          onProToggle={handleShowPlusModal}
        />
      </Modal>

      {/* <Modal
        isOpen={isPlusModalOpen}
        onClose={() => setIsPlusModalOpen(false)}
        showDefaultButton={false}
      >
        <PlusPackContent
          onGetPlus={handlePlusToggle}
          onClose={() => setIsPlusModalOpen(false)}
          hasPlus={hasPlus}
        />
      </Modal> */}
    </div>
  )
}

export default App
