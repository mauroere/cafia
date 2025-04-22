'use client'

import { useState } from 'react'
import { Product, Category } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

type ProductWithCategory = Product & {
  category: Category
}

interface ProductListProps {
  products: ProductWithCategory[]
  categories: Category[]
}

export default function ProductList({ products, categories }: ProductListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (productId: string) => {
    try {
      setIsDeleting(productId)
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el producto')
      }

      toast.success('Producto eliminado correctamente')
      router.refresh()
    } catch (error) {
      toast.error('Error al eliminar el producto')
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative w-full h-48">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.category.name}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">${product.price}</span>
              <div className="space-x-2">
                <button
                  onClick={() => router.push(`/vendor/products/${product.id}/edit`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting === product.id}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting === product.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 