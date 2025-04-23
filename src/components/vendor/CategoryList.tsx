'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import CategoryForm from './CategoryForm'

type Category = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  businessId: string
}

interface CategoryListProps {
  businessId: string
}

export default function CategoryList({ businessId }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/vendor/categories?businessId=${businessId}`)
      setCategories(response.data)
      setError(null)
    } catch (error) {
      console.error('Error al cargar las categorías:', error)
      setError('Error al cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [businessId])

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return
    }

    try {
      setDeletingId(id)
      await axios.delete(`/api/vendor/categories/${id}`)
      toast.success('Categoría eliminada correctamente')
      fetchCategories()
    } catch (error) {
      console.error('Error al eliminar la categoría:', error)
      toast.error('Error al eliminar la categoría')
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCategory(null)
    fetchCategories()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  if (loading) {
    return <div className="text-center py-4">Cargando categorías...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Categorías</h2>
        <Button onClick={() => setShowForm(true)}>
          Nueva Categoría
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-medium mb-4">
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          <CategoryForm
            businessId={businessId}
            initialData={editingCategory ? {
              id: editingCategory.id,
              name: editingCategory.name,
              description: editingCategory.description || '',
              order: 0
            } : undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No hay categorías. Crea una nueva categoría para comenzar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow">
              {category.imageUrl && (
                <div className="mb-2">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              <h3 className="font-medium">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              )}
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  disabled={deletingId === category.id}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 