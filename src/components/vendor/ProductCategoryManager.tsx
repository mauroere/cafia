'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { Category, Product } from '@prisma/client'
import { formatCurrency } from '@/lib/utils'

interface ProductWithCategory extends Product {
  category: Category | null
}

interface CategoryWithProducts extends Category {
  products: Product[]
}

interface ProductCategoryManagerProps {
  businessId: string
  categories: CategoryWithProducts[]
}

export default function ProductCategoryManager({ businessId, categories }: ProductCategoryManagerProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'products'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'categories'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Categorías
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'products' ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Lista de Productos</h3>
              <Link
                href="/vendor/menu/products/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nuevo Producto
              </Link>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {category.products.map((product) => (
                      <div
                        key={product.id}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="truncate text-sm text-gray-500">{formatCurrency(product.price)}</p>
                        </div>
                        <Link
                          href={`/vendor/menu/products/${product.id}/edit`}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Lista de Categorías</h3>
              <Link
                href="/vendor/menu/categories/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nueva Categoría
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="truncate text-sm text-gray-500">
                      {category.products.length} productos
                    </p>
                  </div>
                  <Link
                    href={`/vendor/menu/categories/${category.id}/edit`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 