'use client'

import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

type BusinessStatus = {
  isOpen: boolean
  enableDelivery: boolean
  enableTakeaway: boolean
  estimatedPrepTime: number | null
  deliveryFee: number
}

export default function BusinessStatus() {
  const [status, setStatus] = useState<BusinessStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/vendor/business/status')
        setStatus(response.data)
        setError(null)
      } catch (err) {
        console.error('Error al obtener estado del negocio:', err)
        setError('No se pudo cargar el estado del negocio')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  const updateStatus = async (field: keyof BusinessStatus, value: boolean | number) => {
    if (!status) return

    try {
      setUpdating(true)
      const response = await axios.patch('/api/vendor/business/status', {
        [field]: value
      })
      setStatus(response.data)
      toast.success('Estado actualizado correctamente')
    } catch (err) {
      console.error('Error al actualizar estado:', err)
      toast.error('Error al actualizar el estado')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Estado del Negocio</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    )
  }

  if (error || !status) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Estado del Negocio</h2>
        <div className="text-center text-red-500">
          <p>{error || 'Error desconocido'}</p>
        </div>
      </Card>
    )
  }

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
            checked={status.isOpen}
            onChange={(checked) => updateStatus('isOpen', checked)}
            disabled={updating}
            className={`${status.isOpen ? 'bg-green-600' : 'bg-gray-200'}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Delivery</p>
            <p className="text-sm text-gray-500">Permitir pedidos a domicilio</p>
          </div>
          <Switch
            checked={status.enableDelivery}
            onChange={(checked) => updateStatus('enableDelivery', checked)}
            disabled={updating}
            className={`${status.enableDelivery ? 'bg-green-600' : 'bg-gray-200'}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Take Away</p>
            <p className="text-sm text-gray-500">Permitir pedidos para llevar</p>
          </div>
          <Switch
            checked={status.enableTakeaway}
            onChange={(checked) => updateStatus('enableTakeaway', checked)}
            disabled={updating}
            className={`${status.enableTakeaway ? 'bg-green-600' : 'bg-gray-200'}`}
          />
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            Tiempo estimado de preparación: {status.estimatedPrepTime || 25} minutos
          </p>
          <p className="text-sm text-gray-500">
            Tarifa de delivery: ${status.deliveryFee.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  )
} 