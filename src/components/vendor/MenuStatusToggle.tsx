'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

interface MenuStatusToggleProps {
  businessId: string
  initialStatus: boolean
}

export default function MenuStatusToggle({ businessId, initialStatus }: MenuStatusToggleProps) {
  const [enabled, setEnabled] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/vendor/business/${businessId}/menu-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !enabled }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del menú')
      }

      setEnabled(!enabled)
    } catch (error) {
      console.error('Error:', error)
      // Revertir el estado en caso de error
      setEnabled(enabled)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Switch.Group>
        <div className="flex items-center justify-between">
          <Switch.Label className="mr-4">
            <span className="text-sm font-medium text-gray-900">
              {enabled ? 'Menú Activo' : 'Menú Inactivo'}
            </span>
          </Switch.Label>
          <Switch
            checked={enabled}
            onChange={handleToggle}
            disabled={isLoading}
            className={`${
              enabled ? 'bg-primary-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </Switch.Group>

      <p className="text-sm text-gray-500">
        {enabled 
          ? 'Tu menú está visible para los clientes. Pueden escanearlo y realizar pedidos.'
          : 'Tu menú está oculto. Los clientes no podrán realizar pedidos hasta que lo actives.'}
      </p>
    </div>
  )
} 