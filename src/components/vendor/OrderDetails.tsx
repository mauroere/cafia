'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { OrderStatus } from '@prisma/client'
import axios from 'axios'
import { toast } from 'react-hot-toast'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    imageUrl: string | null
  }
}

type Order = {
  id: string
  shortId: string
  status: OrderStatus
  totalAmount: number
  createdAt: string
  customer: {
    name: string | null
    email: string
    phone: string | null
  }
  items: OrderItem[]
  deliveryAddress: string | null
  deliveryInstructions: string | null
  paymentMethod: string
  paymentStatus: string
}

interface OrderDetailsProps {
  order: Order
  onStatusChange?: (newStatus: OrderStatus) => void
}

export default function OrderDetails({ order, onStatusChange }: OrderDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status)

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setLoading(true)
      await axios.patch(`/api/vendor/orders/${order.id}`, { status: newStatus })
      setCurrentStatus(newStatus)
      toast.success('Estado del pedido actualizado correctamente')
      if (onStatusChange) {
        onStatusChange(newStatus)
      }
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error)
      toast.error('Error al actualizar el estado del pedido')
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      PREPARING: 'Preparando',
      READY_FOR_PICKUP: 'Listo para recoger',
      OUT_FOR_DELIVERY: 'En reparto',
      DELIVERED: 'Entregado',
      PICKED_UP: 'Recogido',
      CANCELLED: 'Cancelado',
      REJECTED: 'Rechazado'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-indigo-100 text-indigo-800',
      READY_FOR_PICKUP: 'bg-purple-100 text-purple-800',
      OUT_FOR_DELIVERY: 'bg-pink-100 text-pink-800',
      DELIVERED: 'bg-green-100 text-green-800',
      PICKED_UP: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REJECTED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getNextStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    const statusFlow: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.CONFIRMED, OrderStatus.REJECTED],
      CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      PREPARING: [OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY],
      READY_FOR_PICKUP: [OrderStatus.PICKED_UP],
      OUT_FOR_DELIVERY: [OrderStatus.DELIVERED],
      DELIVERED: [],
      PICKED_UP: [],
      CANCELLED: [],
      REJECTED: []
    }
    return statusFlow[currentStatus] || []
  }

  const nextStatusOptions = getNextStatusOptions(currentStatus)

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Pedido #{order.shortId}</h2>
          <p className="text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {getStatusLabel(currentStatus)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Información del Cliente</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><span className="font-medium">Nombre:</span> {order.customer.name || 'No especificado'}</p>
            <p><span className="font-medium">Email:</span> {order.customer.email}</p>
            {order.customer.phone && (
              <p><span className="font-medium">Teléfono:</span> {order.customer.phone}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Información de Entrega</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {order.deliveryAddress ? (
              <>
                <p><span className="font-medium">Dirección:</span> {order.deliveryAddress}</p>
                {order.deliveryInstructions && (
                  <p><span className="font-medium">Instrucciones:</span> {order.deliveryInstructions}</p>
                )}
              </>
            ) : (
              <p>Recogida en tienda</p>
            )}
            <p><span className="font-medium">Método de pago:</span> {order.paymentMethod}</p>
            <p><span className="font-medium">Estado del pago:</span> {order.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Productos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.product.imageUrl && (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.product.imageUrl}
                            alt={item.product.name}
                          />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right font-medium">
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {nextStatusOptions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Actualizar Estado</h3>
          <div className="flex flex-wrap gap-2">
            {nextStatusOptions.map((status) => (
              <Button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={loading}
                className={`${getStatusColor(status)}`}
              >
                {loading ? 'Actualizando...' : `Marcar como ${getStatusLabel(status)}`}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
} 