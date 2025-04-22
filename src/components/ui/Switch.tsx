'use client'

import { Switch as HeadlessSwitch } from '@headlessui/react'
import { ReactNode } from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  children?: ReactNode
}

export function Switch({ 
  checked, 
  onChange, 
  disabled = false, 
  className = '',
  children 
}: SwitchProps) {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`
        ${checked ? 'bg-primary-600' : 'bg-gray-200'}
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <span
        className={`
          ${checked ? 'translate-x-6' : 'translate-x-1'}
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        `}
      />
      {children}
    </HeadlessSwitch>
  )
} 