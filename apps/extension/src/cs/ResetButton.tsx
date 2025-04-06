import React, { useState } from 'react'
import { bgActions } from '../bg/state'

interface ResetButtonProps {
  label?: string
  confirmText?: string
  onReset?: () => void
  className?: string
}

/**
 * A button that resets all application storage
 * Includes confirmation step to prevent accidental resets
 */
export default function ResetButton({
  label = 'Reset App',
  confirmText = 'Are you sure? This will reset all your data!',
  onReset,
  className = '',
}: ResetButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async () => {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }

    try {
      setIsResetting(true)
      const result = await bgActions.resetStorage()

      if (result) {
        console.log('Storage reset successful')
        if (onReset) onReset()
        // Optional: refresh the page to ensure clean state
        window.location.reload()
      } else {
        console.error('Failed to reset storage')
      }
    } catch (error) {
      console.error('Error during storage reset:', error)
    } finally {
      setIsResetting(false)
      setIsConfirming(false)
    }
  }

  // Cancel confirmation if user clicks away
  const handleCancel = () => {
    setIsConfirming(false)
  }

  return (
    <div className={`reset-button-container ${className}`}>
      {isConfirming && !isResetting ? (
        <div className='reset-confirmation'>
          <p>{confirmText}</p>
          <div className='reset-actions'>
            <button onClick={handleReset} className='reset-confirm-button'>
              Yes, Reset
            </button>
            <button onClick={handleCancel} className='reset-cancel-button'>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleReset}
          disabled={isResetting}
          className={`reset-button ${isResetting ? 'resetting' : ''}`}
        >
          {isResetting ? 'Resetting...' : label}
        </button>
      )}
    </div>
  )
}
