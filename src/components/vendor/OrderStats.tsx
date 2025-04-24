'use client'

import { Order, OrderStatus } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusBadge } from './OrderStatusBadge'

interface OrderStatsProps {
  orders: Order[]
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendientes',
  CONFIRMED: 'Confirmados',
  PREPARING: 'En preparación',
  READY_FOR_PICKUP: 'Listos para recoger',
  OUT_FOR_DELIVERY: 'En reparto',
  DELIVERED: 'Entregados',
  PICKED_UP: 'Recogidos',
  CANCELLED: 'Cancelados',
  REJECTED: 'Rechazados'
}

export function OrderStats({ orders }: OrderStatsProps) {
  const stats = Object.values(OrderStatus).map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
    total: orders.filter((order) => order.status === status)
      .reduce((acc, order) => acc + order.totalAmount, 0)
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.status}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <OrderStatusBadge status={stat.status} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {statusLabels[stat.status]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stat.count} pedidos
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${stat.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Total
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 