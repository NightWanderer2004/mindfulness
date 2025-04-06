import React from "react"
import { motion } from "framer-motion"
import { animations, cn } from "../../lib/utils"

interface IconsMap {
  [key: string]: string
}

interface SoundTypeSelectorProps {
  selectedSoundType: string | null
  setSelectedSoundType: (soundType: string) => void
  icons: IconsMap
}

export const SoundTypeSelector: React.FC<SoundTypeSelectorProps> = ({
  selectedSoundType,
  setSelectedSoundType,
  icons
}) => {
  const soundTypes = [
    {
      name: "Music",
      icon: icons.music || "",
      color: "border-purple-400/40 bg-purple-200/20",
      hover: "hover:border-purple-300/30 hover:bg-purple-100/20",
      text: "text-purple-600/50"
    },
    {
      name: "Nature",
      icon: icons.nature || "",
      color: "border-green-400/30 bg-green-200/20",
      hover: "hover:border-green-400/20 hover:bg-green-100/20",
      text: "text-green-600/50"
    },
    {
      name: "White Noise",
      icon: icons.whitenoise || "",
      color: "border-gray-400/30 bg-gray-200/20",
      hover: "hover:border-gray-400/20 hover:bg-gray-100/20",
      text: "text-gray-600/50"
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center gap-1.5 lg:gap-4">
      {soundTypes.map((soundType) => (
        <motion.button
          key={soundType.name}
          whileHover={animations.button.whileHover}
          whileTap={animations.button.whileTap}
          transition={animations.button.transition}
          className={cn(
            "p-1.5 lg:py-3 lg:px-2.5 rounded-xl border-2 transition-colors duration-200 w-full flex lg:block items-center gap-2.5 justify-start",
            selectedSoundType === soundType.name
              ? `${soundType.color} shadow-smooth`
              : `border-transparent ${soundType.hover}`
          )}
          onClick={() => setSelectedSoundType(soundType.name)}>
          <div
            className={cn(
              "lg:w-full rounded-lg lg:mb-2 flex items-center justify-center"
            )}>
            <img
              src={soundType.icon}
              alt={soundType.name}
              className={cn(
                "size-7 lg:size-16 object-contain pointer-events-none"
              )}
            />
          </div>
          <span className={cn("text-base font-medium", soundType.text)}>
            {soundType.name}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
