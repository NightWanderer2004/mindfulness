import React from 'react'
import { bgActions } from '../bg/state'

interface ResetButtonProps {
  label?: string
  className?: string
}

export default function ResetButton({
  label = 'Reset App',
  className = '',
}: ResetButtonProps) {
  const handleReset = async () => {
    try {
      await bgActions.resetStorage()
      window.location.reload()
    } catch (error) {
      console.error('Error resetting storage:', error)
    }
  }

  return (
    <button onClick={handleReset} className={`reset-button ${className}`}>
      {label}
    </button>
  )
}
