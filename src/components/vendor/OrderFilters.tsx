'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { OrderStatus } from '@prisma/client'

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: OrderStatus.PENDING, label: 'Pendiente' },
  { value: OrderStatus.CONFIRMED, label: 'Confirmado' },
  { value: OrderStatus.PREPARING, label: 'En preparación' },
  { value: OrderStatus.READY, label: 'Listo' },
  { value: OrderStatus.DELIVERED, label: 'Entregado' },
  { value: OrderStatus.CANCELLED, label: 'Cancelado' },
  { value: OrderStatus.REJECTED, label: 'Rechazado' }
]

export function OrderFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/vendor/orders?${params.toString()}`)
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Buscar
          </label>
          <input
            type="text"
            name="search"
            id="search"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="ID, nombre o email del cliente"
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue={searchParams.get('status') || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Fecha desde
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue={searchParams.get('date') || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
} 