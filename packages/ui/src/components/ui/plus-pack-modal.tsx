import React from 'react'
import { motion } from 'framer-motion'
import { animations } from '../../lib/utils'
import { AnimatedButton } from './animated-btn'

interface PlusPackModalProps {
  onGetPlus: () => void
  onClose: () => void
  hasPlus?: boolean
}

export const PlusPackContent: React.FC<PlusPackModalProps> = ({
  onGetPlus,
  onClose,
  hasPlus = true,
}) => {
  if (!hasPlus) {
    return (
      <div className='pt-1.5 max-w-xs mx-auto'>
        <h2 className='text-3xl font-semibold text-primary mb-3'>Plus Pack</h2>
        <p className='text-primary/85 text-base mb-5'>
          Plus Pack unlocks mindful features that enhance your mindfulness
          experience
        </p>
        <div className='space-y-2 mb-1.5'>
          <div className='flex items-center justify-center text-left gap-1.5'>
            <span className='text-primary/85 text-base'>✦</span>
            <div>
              <h3 className='font-normal text-primary text-base'>
                Mindful reminder while browsing
              </h3>
            </div>
          </div>
          <div className='flex items-center justify-center text-left gap-1.5'>
            <span className='text-primary/85 text-base'>✦</span>
            <h3 className='font-normal text-primary text-base'>
              New themes that resonate with you
            </h3>
          </div>
          <div className='flex items-center justify-center text-left gap-1.5'>
            <span className='text-primary/85 text-base'>✦</span>
            <h3 className='font-normal text-primary text-base'>
              Custom breathing patterns
            </h3>
          </div>
        </div>

        <div className='flex justify-center'>
          <AnimatedButton
            className='mt-2.5 lg:mt-4 text-base lg:text-lg text-primary/90 justify-center'
            label='Get Plus Pack'
            onClick={onGetPlus}
          />
        </div>
      </div>
    )
  }

  // Content for users who already have Plus
  return (
    <div className='pt-1.5 max-w-xs mx-auto'>
      <h2 className='text-3xl font-semibold text-primary mb-3'>
        Plus Pack Enabled
      </h2>
      <p className='text-primary/85 text-base mb-1.5'>
        You're enjoying the mindful features of Mindfulness. You can disable the
        Plus Pack at any time if you want
      </p>

      <div className='flex items-center justify-center gap-3.5'>
        <AnimatedButton
          className='w-auto mt-2.5 lg:mt-4 text-base lg:text-lg text-red-400/90 justify-center'
          label='Cancel Plus Pack'
          onClick={onGetPlus}
        />
        <AnimatedButton
          className='w-auto mt-2.5 lg:mt-4 text-base lg:text-lg text-primary/90 justify-center'
          label='Done'
          onClick={onClose}
        />
      </div>
    </div>
  )
}
