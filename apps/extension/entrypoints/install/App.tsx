import React, { useState } from "react"
import openness from "../../assets/icons/openness.png"
import harmony from "../../assets/icons/harmony.png"
import exploration from "../../assets/icons/exploration.png"
import confidence from "../../assets/icons/confidence.png"
import tiredness from "../../assets/icons/tiredness.png"
import soft from "../../assets/icons/soft.png"
import { AnimatedButton } from "@repo/ui/components/ui/animated-btn"
import { Modal } from "@repo/ui/components/ui/modal"
import { motion } from "framer-motion"
import { animations, cn } from "@repo/ui/src/lib/utils"

const App: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div className="h-screen relative flex flex-col items-center justify-center pb-20 text-center text-primary overflow-hidden">
      <div className="absolute inset-0 bg-sky-bg-main bg-cover bg-center bg-no-repeat blur-sm scale-105 pointer-events-none brightness-110 z-0" />
      <div className="z-20 max-w-sm mx-auto">
        <h1 className="mb-2.5 text-6xl leading-none text-center font-sans font-semibold bg-gradient-to-br from-background/90 via-background/65 to-background/55 bg-clip-text text-transparent bg-[length:250%_250%] bg-[position:0%_0%]">
          Mindful Tab
        </h1>
        <p className="mb-8 text-xl text-background/85 max-w-md">
          Welcome! Let's start from choosing theme
        </p>
        <div className="flex items-center">
          <AnimatedButton
            className="max-w-[260px] mx-auto !bg-background/90"
            label="Choose Theme"
            icon={openness}
            onClick={() => setIsModalOpen(true)}
          />
          <motion.button
            whileHover={animations.button.whileHover}
            whileTap={animations.button.whileTap}
            transition={animations.button.transition}
            disabled={!selectedTheme}
            className={cn(
              "flex items-center justify-between bg-white/85 rounded-2xl px-5 py-1.5 shadow-smooth border-[1.5px]",
              selectedTheme
                ? "bg-primary/80 border-background/35"
                : "bg-background/20 border-background/25 cursor-not-allowed border-dashed"
            )}
            onClick={() => {
              if (selectedTheme) {
                console.log("Continue to next step")
              }
            }}>
            <span
              className={cn(
                "text-lg text-background/75 font-medium",
                selectedTheme && "text-background/90"
              )}>
              Begin
            </span>
          </motion.button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-3xl font-medium mb-1.5 bg-gradient-to-br from-primary/70 via-primary to-primary bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_0%]">
          Choose Your Theme
        </h2>
        <p className="text-base text-primary/85 mb-6">
          Select a theme that resonates with your mood
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: "Harmony",
              icon: harmony,
              color: "border-amber-300/30 bg-amber-200/20",
              hover: "hover:border-amber-300/20 hover:bg-amber-200/10",
              text: "text-amber-600/50"
            },
            {
              name: "Exploration",
              icon: exploration,
              color: "border-indigo-300/30 bg-indigo-200/20",
              hover: "hover:border-indigo-300/20 hover:bg-indigo-200/10",
              text: "text-indigo-600/50"
            },
            {
              name: "Openness",
              icon: openness,
              color: "border-pink-300/30 bg-pink-200/20",
              hover: "hover:border-pink-300/20 hover:bg-pink-200/10",
              text: "text-pink-600/50"
            },
            {
              name: "Confidence",
              icon: confidence,
              color: "border-green-300/30 bg-green-200/20",
              hover: "hover:border-green-300/20 hover:bg-green-200/10",
              text: "text-green-600/50"
            },
            {
              name: "Soft",
              icon: soft,
              color: "border-blue-300/30 bg-blue-200/20",
              hover: "hover:border-blue-300/20 hover:bg-blue-200/10",
              text: "text-blue-600/50"
            },
            {
              name: "Tiredness",
              icon: tiredness,
              color: "border-red-300/30 bg-red-200/20",
              hover: "hover:border-red-300/20 hover:bg-red-200/10",
              text: "text-red-600/50"
            }
          ].map((theme) => (
            <motion.button
              key={theme.name}
              whileHover={animations.button.whileHover}
              whileTap={animations.button.whileTap}
              className={cn(
                "py-3 px-2.5 rounded-xl border-2 transition-colors",
                selectedTheme === theme.name
                  ? `${theme.color} shadow-smooth`
                  : `border-transparent ${theme.hover}`
              )}
              onClick={() => setSelectedTheme(theme.name)}>
              <div
                className={cn(
                  "w-full rounded-lg mb-2 flex items-center justify-center"
                )}>
                <img
                  src={theme.icon}
                  alt={theme.name}
                  className="size-16 object-contain pointer-events-none"
                />
              </div>
              <span className={cn("text-base font-medium", theme.text)}>
                {theme.name}
              </span>
            </motion.button>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default App
