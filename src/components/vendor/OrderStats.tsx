'use client'

import { Order, OrderStatus } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface OrderStatsProps {
  orders: Order[]
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PREPARING: '#8b5cf6',
  READY_FOR_PICKUP: '#10b981',
  OUT_FOR_DELIVERY: '#6366f1',
  DELIVERED: '#10b981',
  PICKED_UP: '#10b981',
  CANCELLED: '#ef4444',
  REJECTED: '#ef4444'
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'En Preparación',
  READY_FOR_PICKUP: 'Listo para recoger',
  OUT_FOR_DELIVERY: 'En camino',
  DELIVERED: 'Entregado',
  PICKED_UP: 'Recogido',
  CANCELLED: 'Cancelado',
  REJECTED: 'Rechazado'
}

export function OrderStats({ orders }: OrderStatsProps) {
  // Calcular distribución por estado
  const statusData = Object.values(OrderStatus).map(status => ({
    name: statusLabels[status],
    value: orders.filter(order => order.status === status).length
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Pedidos por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[Object.keys(statusLabels)[index] as OrderStatus]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 