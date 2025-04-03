import React, { useState } from "react"
import themes from "../../assets/icons/themes.png"
import { AnimatedButton } from "@repo/ui/components/ui/animated-btn"
import { motion } from "framer-motion"
import { animations, cn } from "@repo/ui/src/lib/utils"

const App: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<boolean>(true)

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
            icon={themes}
            onClick={() => console.log("Customize Theme")}
          />
          <motion.button
            whileHover={{
              scale: 1.01,
              backgroundColor: "rgba(82, 155, 192, 0.8)"
            }}
            whileTap={animations.button.whileTap}
            transition={animations.button.transition}
            disabled={!selectedTheme}
            className={cn(
              "flex items-center justify-between bg-white/85 rounded-2xl px-5 py-1.5 shadow-smooth border-[1.5px] border-background/25",
              selectedTheme
                ? "bg-primary/20"
                : "bg-background/20 cursor-not-allowed border-dashed"
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
    </div>
  )
}

export default App
