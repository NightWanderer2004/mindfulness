import React from 'react'
import { PlusFeature } from './plus-feature'

interface ReminderSettings {
  enabled: boolean
  frequency: number
}

interface ReminderSettingsProps {
  settings: ReminderSettings
  onToggle: (enabled: boolean) => void
  onChangeFrequency: (minutes: number) => void
  hasPro: boolean
  onProToggle?: () => void
}

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  settings,
  onToggle,
  onChangeFrequency,
  hasPro,
  onProToggle,
}) => {
  const frequencyOptions = [
    { value: 0.083, label: '5 sec' },
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
  ]

  const handleToggle = () => {
    if (!hasPro) {
      if (onProToggle) onProToggle()
      return
    }
    onToggle(!settings.enabled)
  }

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFrequency(Number(e.target.value))
  }

  return (
    <div className='space-y-4'>
      <PlusFeature
        isPro={hasPro}
        feature='reminder'
        onClick={onProToggle}
        className='w-full'
      >
        <div className='p-4 bg-primary/5 rounded-xl border border-primary/20'>
          <div className='flex items-center justify-between'>
            <h3 className='text-base font-medium text-primary/90'>
              Get reminded to take a break
            </h3>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.enabled}
                onChange={handleToggle}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-primary/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {settings.enabled && (
            <div className='mt-4 pt-3 border-t border-primary/10'>
              <div className='flex items-center gap-3'>
                <label className='block whitespace-nowrap text-base font-medium text-primary/90'>
                  Reminder Frequency
                </label>
                <select
                  value={settings.frequency}
                  onChange={handleFrequencyChange}
                  className='w-full py-1 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-sm text-primary/90 text-center'
                >
                  {frequencyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </PlusFeature>
    </div>
  )
}
