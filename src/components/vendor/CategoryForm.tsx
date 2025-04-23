'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CategoryFormProps {
  businessId: string
  initialData?: {
    id?: string
    name: string
    description?: string
    order?: number
  }
}

export default function CategoryForm({ businessId, initialData }: CategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    order: initialData?.order || 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const url = initialData?.id 
        ? `/api/vendor/categories/${initialData.id}`
        : '/api/vendor/categories'
      
      const response = await fetch(url, {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          businessId,
          order: Number(formData.order)
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al guardar la categoría')
      }

      router.push('/vendor/menu')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la categoría')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre de la categoría
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
        <p className="mt-1 text-sm text-gray-500">
          Opcional. Agrega una descripción para ayudar a tus clientes a entender qué tipo de productos encontrarán en esta categoría.
        </p>
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Orden de visualización
        </label>
        <input
          type="number"
          name="order"
          id="order"
          min="0"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          Las categorías se mostrarán ordenadas de menor a mayor. Las categorías con el mismo orden se ordenarán alfabéticamente.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Guardando...' : initialData?.id ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
} 