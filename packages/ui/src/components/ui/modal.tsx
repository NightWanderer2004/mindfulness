import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { animations, cn } from "../../lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className
}) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50" onClick={onClose}>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(10px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-0"
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          />

          {/* Modal Content */}
          <div
            className={cn(
              "fixed inset-0 bottom-[100px] flex items-center justify-center z-10",
              className
            )}>
            <motion.div
              className="text-center bg-white/85 rounded-2xl p-5 shadow-smooth border border-white/35"
              initial={{ opacity: 0, scale: 0.99, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: 5,
                transition: { duration: 0.8, ease: animations.easing.smooth }
              }}
              transition={{ duration: 0.75, ease: animations.easing.smooth }}
              onClick={(e) => e.stopPropagation()}>
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
