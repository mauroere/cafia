'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface BusinessSettingsFormProps {
  initialData: {
    name: string
    description: string | null
    isActive: boolean
    address: string | null
    phone: string | null
    whatsappNumber: string | null
    isOpen: boolean
    enableDelivery: boolean
    enableTakeaway: boolean
    deliveryFee: number
    estimatedPrepTime: number | null
  }
}

export default function BusinessSettingsForm({ initialData }: BusinessSettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData.name,
    description: initialData.description || '',
    isActive: initialData.isActive,
    address: initialData.address || '',
    phone: initialData.phone || '',
    whatsappNumber: initialData.whatsappNumber || '',
    isOpen: initialData.isOpen,
    enableDelivery: initialData.enableDelivery,
    enableTakeaway: initialData.enableTakeaway,
    deliveryFee: initialData.deliveryFee,
    estimatedPrepTime: initialData.estimatedPrepTime || 30
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/vendor/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al guardar la configuración')
      }

      toast.success('Configuración guardada correctamente')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar la configuración')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del Negocio
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          type="text"
          name="address"
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
          Número de WhatsApp
        </label>
        <input
          type="tel"
          name="whatsappNumber"
          id="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700">
          Costo de Envío
        </label>
        <input
          type="number"
          name="deliveryFee"
          id="deliveryFee"
          min="0"
          step="0.01"
          value={formData.deliveryFee}
          onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="estimatedPrepTime" className="block text-sm font-medium text-gray-700">
          Tiempo Estimado de Preparación (minutos)
        </label>
        <input
          type="number"
          name="estimatedPrepTime"
          id="estimatedPrepTime"
          min="0"
          value={formData.estimatedPrepTime}
          onChange={(e) => setFormData({ ...formData, estimatedPrepTime: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Menú Activo
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="isOpen"
            name="isOpen"
            type="checkbox"
            checked={formData.isOpen}
            onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-900">
            Negocio Abierto
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="enableDelivery"
            name="enableDelivery"
            type="checkbox"
            checked={formData.enableDelivery}
            onChange={(e) => setFormData({ ...formData, enableDelivery: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="enableDelivery" className="ml-2 block text-sm text-gray-900">
            Habilitar Delivery
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="enableTakeaway"
            name="enableTakeaway"
            type="checkbox"
            checked={formData.enableTakeaway}
            onChange={(e) => setFormData({ ...formData, enableTakeaway: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="enableTakeaway" className="ml-2 block text-sm text-gray-900">
            Habilitar Takeaway
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
} 