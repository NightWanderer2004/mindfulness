import React, { useState, useEffect, useRef } from "react"
import themes from "../../assets/icons/themes.png"

import openness from "../../assets/icons/openness.png"
import harmony from "../../assets/icons/harmony.png"
import exploration from "../../assets/icons/exploration.png"
import confidence from "../../assets/icons/confidence.png"
import tiredness from "../../assets/icons/tiredness.png"
import softness from "../../assets/icons/softness.png"

import { AnimatedButton } from "@repo/ui/components/ui/animated-btn"
import { Modal } from "@repo/ui/components/ui/modal"
import { ThemeSelector } from "@repo/ui/components/ui/theme-selector"
import { SoundTypeSelector } from "@repo/ui/components/ui/sound-type-selector"
import { TransitionPanel } from "@repo/ui/components/ui/transition-panel"
import { motion } from "framer-motion"
import { animations, cn } from "@repo/ui/src/lib/utils"

const App: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const themeIcons = {
    openness,
    harmony,
    exploration,
    confidence,
    tiredness,
    softness
  }

  const getThemeIcon = () => {
    if (!selectedTheme) return themes
    const themeKey = selectedTheme.toLowerCase()
    return themeIcons[themeKey as keyof typeof themeIcons]
  }

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme)
  }

  const handleDone = () => {
    setIsModalOpen(false)
  }

  const canBeginSession = selectedTheme

  const modalTitle = "Choose Your Theme"
  const modalDescription = "Select a theme that resonates with your mood"

  return (
    <div className="h-screen relative flex flex-col items-center justify-center pb-20 text-center text-primary overflow-hidden">
      <div className="absolute inset-0 bg-sky-bg-main bg-cover bg-center bg-no-repeat blur-sm scale-105 pointer-events-none brightness-110 z-0" />
      <div className="z-20 max-w-sm mx-auto">
        <h1 className="mb-2.5 text-6xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-background/90 via-background/65 to-background/55 bg-clip-text text-transparent bg-[length:250%_250%] bg-[position:0%_0%]">
          Mindful Tab
        </h1>
        <p className="mb-8 text-xl text-background/85 max-w-md">
          Welcome! Let's start from choosing theme. <br />
          You can change it later.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <AnimatedButton
              className="max-w-[260px] !bg-background/90"
              label={selectedTheme ? `Theme: ${selectedTheme}` : "Choose Theme"}
              icon={getThemeIcon()}
              onClick={() => {
                setIsModalOpen(true)
              }}
            />
            <motion.button
              whileHover={animations.button.whileHover}
              whileTap={animations.button.whileTap}
              transition={animations.button.transition}
              disabled={!canBeginSession}
              className={cn(
                "flex items-center justify-between bg-white/85 rounded-2xl px-5 py-1.5 shadow-smooth border-[1.5px]",
                canBeginSession
                  ? "bg-primary/80 border-background/35"
                  : "bg-background/20 border-background/25 cursor-not-allowed border-dashed"
              )}
              onClick={() => {
                if (canBeginSession) {
                  console.log("Continue to next step")
                }
              }}>
              <span
                className={cn(
                  "text-lg text-background/75 font-medium line-through",
                  canBeginSession && "text-background/90 no-underline"
                )}>
                Next
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="mb-6">
          <h2 className="text-3xl font-medium mb-1.5 bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]">
            {modalTitle}
          </h2>
          <p className="text-base text-primary/85">{modalDescription}</p>
        </div>

        <ThemeSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={handleThemeSelection}
          icons={themeIcons}
        />
      </Modal>
    </div>
  )
}

export default App
