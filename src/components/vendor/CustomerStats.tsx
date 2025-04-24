'use client'

import { Order } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, UserCheck, DollarSign } from 'lucide-react'

interface CustomerStatsProps {
  orders: Order[]
}

export function CustomerStats({ orders }: CustomerStatsProps) {
  // Calcular estadísticas de clientes
  const customerOrders = orders.reduce((acc, order) => {
    if (!acc[order.customerEmail]) {
      acc[order.customerEmail] = {
        count: 0,
        total: 0,
        firstOrder: order.createdAt,
        lastOrder: order.createdAt
      }
    }
    acc[order.customerEmail].count++
    acc[order.customerEmail].total += order.total
    if (order.createdAt < acc[order.customerEmail].firstOrder) {
      acc[order.customerEmail].firstOrder = order.createdAt
    }
    if (order.createdAt > acc[order.customerEmail].lastOrder) {
      acc[order.customerEmail].lastOrder = order.createdAt
    }
    return acc
  }, {} as Record<string, { count: number; total: number; firstOrder: Date; lastOrder: Date }>)

  const totalCustomers = Object.keys(customerOrders).length
  const returningCustomers = Object.values(customerOrders).filter(c => c.count > 1).length
  const newCustomers = totalCustomers - returningCustomers
  const averageOrderValue = orders.length > 0
    ? orders.reduce((acc, order) => acc + order.total, 0) / orders.length
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Clientes</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Clientes</p>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <UserPlus className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Nuevos Clientes</p>
            <p className="text-2xl font-bold">{newCustomers}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <UserCheck className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Clientes Recurrentes</p>
            <p className="text-2xl font-bold">{returningCustomers}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <DollarSign className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Valor Promedio</p>
            <p className="text-2xl font-bold">
              ${averageOrderValue.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 