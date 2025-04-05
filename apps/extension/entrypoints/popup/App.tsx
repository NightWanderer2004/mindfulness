import React, { useState } from "react"
import themes from "../../assets/icons/themes.png"
import openness from "../../assets/icons/openness.png"
import meditate from "../../assets/icons/meditate.png"
import cogwheel from "../../assets/icons/cogwheel.png"
import harmony from "../../assets/icons/harmony.png"
import exploration from "../../assets/icons/exploration.png"
import confidence from "../../assets/icons/confidence.png"
import softness from "../../assets/icons/softness.png"
import tiredness from "../../assets/icons/tiredness.png"
import { AnimatedButton } from "@repo/ui/components/ui/animated-btn"
import { MeditateButton } from "@repo/ui/components/ui/meditate-btn"
import { Modal } from "@repo/ui/components/ui/modal"
import { ThemeSelector } from "@repo/ui/components/ui/theme-selector"

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("Harmony")

  const icons = {
    harmony: harmony,
    exploration: exploration,
    openness: openness,
    confidence: confidence,
    softness: softness,
    tiredness: tiredness
  }

  const getThemeIcon = () => {
    if (!selectedTheme) return themes
    const themeKey = selectedTheme.toLowerCase()
    return icons[themeKey as keyof typeof icons]
  }

  return (
    <div className="relative w-[350px] py-7 px-11 overflow-hidden flex flex-col items-center justify-center text-white">
      <div className="absolute pointer-events-none inset-0 bg-sky-bg-popup bg-cover bg-center filter brightness-90" />
      <div className="relative z-10 bg-background/90 border-[1.5px] border-primary/20 shadow-smooth backdrop-blur-sm h-full w-full flex flex-col gap-6 rounded-3xl p-4">
        <h1 className="mt-1 text-4xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]">
          Mindful Tab
        </h1>

        <MeditateButton
          icon={meditate}
          onClick={() => console.log("Meditate clicked")}
        />
        <div className="space-y-2">
          <AnimatedButton
            label="Themes"
            icon={getThemeIcon()}
            onClick={() => setIsModalOpen(true)}
          />
          <AnimatedButton
            label="Settings"
            icon={cogwheel}
            onClick={() => console.log("Settings clicked")}
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ThemeSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          icons={icons}
        />
      </Modal>
    </div>
  )
}

export default App
