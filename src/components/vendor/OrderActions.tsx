'use client'

import { Order, OrderStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const nextStatus: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'REJECTED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_PICKUP: ['PICKED_UP', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  PICKED_UP: [],
  CANCELLED: [],
  REJECTED: []
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmar',
  PREPARING: 'En preparación',
  READY_FOR_PICKUP: 'Listo para recoger',
  OUT_FOR_DELIVERY: 'En reparto',
  DELIVERED: 'Entregado',
  PICKED_UP: 'Recogido',
  CANCELLED: 'Cancelar',
  REJECTED: 'Rechazar'
}

interface OrderActionsProps {
  order: Order
}

export function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter()
  const availableStatuses = nextStatus[order.status]

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await axios.patch(`/api/vendor/orders/${order.id}`, {
        status: newStatus
      })
      toast.success('Estado del pedido actualizado')
      router.refresh()
    } catch (error) {
      console.error('Error al actualizar el estado:', error)
      toast.error('Error al actualizar el estado del pedido')
    }
  }

  if (availableStatuses.length === 0) {
    return null
  }

  return (
    <div className="flex space-x-2">
      {availableStatuses.map((status) => (
        <button
          key={status}
          onClick={() => handleStatusChange(status)}
          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
            status === 'CANCELLED' || status === 'REJECTED'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-primary-600 hover:bg-primary-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
        >
          {statusLabels[status]}
        </button>
      ))}
    </div>
  )
} 