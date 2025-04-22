import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { useState } from 'react'

export default function BusinessStatus() {
  const [isOpen, setIsOpen] = useState(false)
  const [enableDelivery, setEnableDelivery] = useState(true)
  const [enableTakeaway, setEnableTakeaway] = useState(true)

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Estado del Negocio</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Negocio Abierto</p>
            <p className="text-sm text-gray-500">Activar para recibir pedidos</p>
          </div>
          <Switch
            checked={isOpen}
            onChange={setIsOpen}
            className={`${isOpen ? 'bg-green-600' : 'bg-gray-200'}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Delivery</p>
            <p className="text-sm text-gray-500">Permitir pedidos a domicilio</p>
          </div>
          <Switch
            checked={enableDelivery}
            onChange={setEnableDelivery}
            className={`${enableDelivery ? 'bg-green-600' : 'bg-gray-200'}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Take Away</p>
            <p className="text-sm text-gray-500">Permitir pedidos para llevar</p>
          </div>
          <Switch
            checked={enableTakeaway}
            onChange={setEnableTakeaway}
            className={`${enableTakeaway ? 'bg-green-600' : 'bg-gray-200'}`}
          />
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            Tiempo estimado de preparación: 25 minutos
          </p>
          <p className="text-sm text-gray-500">
            Tarifa de delivery: $5.00
          </p>
        </div>
      </div>
    </Card>
  )
} 