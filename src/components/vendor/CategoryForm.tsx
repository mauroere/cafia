'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import axios from 'axios'

type Category = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  businessId: string
}

interface CategoryFormProps {
  businessId: string
  category?: Category
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CategoryForm({ businessId, category, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '')
  const [description, setDescription] = useState(category?.description || '')
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    try {
      setLoading(true)
      
      const categoryData = {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        businessId
      }

      if (category) {
        // Actualizar categoría existente
        await axios.patch(`/api/vendor/categories/${category.id}`, categoryData)
        toast.success('Categoría actualizada correctamente')
      } else {
        // Crear nueva categoría
        await axios.post('/api/vendor/categories', categoryData)
        toast.success('Categoría creada correctamente')
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error al guardar la categoría:', error)
      toast.error('Error al guardar la categoría')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          URL de la imagen
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
} 