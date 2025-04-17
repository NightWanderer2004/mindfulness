import React from 'react'
import { cn } from '../../lib/utils'

interface PlusFeatureProps {
  children: React.ReactNode
  isPro: boolean
  feature: 'custom-breathing' | 'reminder' | 'themes'
  onClick?: () => void
  className?: string
}

export const PlusFeature: React.FC<PlusFeatureProps> = ({
  children,
  isPro,
  feature,
  onClick,
  className,
}) => {
  const featureLabels = {
    'custom-breathing': 'Custom patterns',
    reminder: 'Mindful reminder',
    themes: 'Item',
  }

  if (isPro) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      <div
        className='absolute inset-0 bg-background/65 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer z-10'
        onClick={onClick}
      >
        <div className='text-xs font-medium bg-primary/10 px-1.5 py-1 rounded-lg text-primary flex items-center'>
          <span>Plus Pack Item</span>
        </div>
        <p className='hidden md:block text-xs mt-2 text-primary/90 text-center'>
          {featureLabels[feature]} is available with Plus Pack subscription
        </p>
      </div>
      <div className='opacity-35 pointer-events-none'>{children}</div>
    </div>
  )
}
