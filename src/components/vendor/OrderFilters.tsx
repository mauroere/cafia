'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { OrderStatus } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const statusOptions = [
  { value: OrderStatus.PENDING, label: 'Pendiente' },
  { value: OrderStatus.CONFIRMED, label: 'Confirmado' },
  { value: OrderStatus.PREPARING, label: 'En preparación' },
  { value: OrderStatus.READY_FOR_PICKUP, label: 'Listo para recoger' },
  { value: OrderStatus.OUT_FOR_DELIVERY, label: 'En camino' },
  { value: OrderStatus.DELIVERED, label: 'Entregado' },
  { value: OrderStatus.PICKED_UP, label: 'Recogido' },
  { value: OrderStatus.CANCELLED, label: 'Cancelado' },
  { value: OrderStatus.REJECTED, label: 'Rechazado' }
]

export function OrderFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('search', value)
    params.set('page', '1')
    router.push(`/vendor/orders?${params.toString()}`)
  }

  const handleStatusChange = (value: OrderStatus) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', value)
    params.set('page', '1')
    router.push(`/vendor/orders?${params.toString()}`)
  }

  const handleDateChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', value)
    params.set('page', '1')
    router.push(`/vendor/orders?${params.toString()}`)
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Input
        type="text"
        placeholder="Buscar por ID, nombre o email..."
        defaultValue={searchParams.get('search') || ''}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />

      <Select
        value={searchParams.get('status') || ''}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        defaultValue={searchParams.get('date') || ''}
        onChange={(e) => handleDateChange(e.target.value)}
        className="w-full"
      />
    </div>
  )
} 