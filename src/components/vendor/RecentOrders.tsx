'use client'

import { Order, OrderStatus, User } from '@prisma/client'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { OrderStatusBadge } from './OrderStatusBadge'

interface OrderWithCustomer extends Order {
  customer: Pick<User, 'name' | 'email'>
}

interface RecentOrdersProps {
  orders: OrderWithCustomer[]
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY_FOR_PICKUP: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-gray-100 text-gray-800',
  PICKED_UP: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-red-100 text-red-800'
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No hay pedidos recientes</p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200">
        {orders.map((order) => (
          <li key={order.id} className="py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-4">
                  <Link
                    href={`/vendor/orders/${order.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Pedido #{order.id.slice(0, 8)}
                  </Link>
                  <div className="mt-1 text-sm text-gray-500">
                    {order.customer.name} • {order.customer.email}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <OrderStatusBadge status={order.status} />
                <div className="text-sm font-medium text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href="/vendor/orders"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Ver todos los pedidos
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  )
} 