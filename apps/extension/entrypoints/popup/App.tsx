import React from "react"
import themes from "../../assets/icons/themes.png"
import meditate from "../../assets/icons/meditate.png"
import cogwheel from "../../assets/icons/cogwheel.png"
import { AnimatedButton } from "@repo/ui/components/ui/animated-btn"
import { MeditateButton } from "@repo/ui/components/ui/meditate-btn"

const App: React.FC = () => {
  return (
    <div className="relative w-[330px] p-6 px-11 overflow-hidden flex flex-col items-center justify-center text-white">
      <div className="absolute pointer-events-none inset-0 bg-sky-bg-popup bg-cover bg-center filter brightness-90" />
      <div className="relative z-10 bg-background/95 border-[1.5px] border-primary/20 shadow-smooth backdrop-blur-sm h-full w-full flex flex-col gap-6 rounded-3xl p-4">
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
            icon={themes}
            onClick={() => console.log("Themes clicked")}
          />
          <AnimatedButton
            label="Settings"
            icon={cogwheel}
            onClick={() => console.log("Settings clicked")}
          />
        </div>
      </div>
    </div>
  )
}

export default App
