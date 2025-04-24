'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import OrderDetails from '@/components/vendor/OrderDetails'
import { OrderStatus, OrderType } from '@prisma/client'
import { toast } from 'react-hot-toast'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { OrderStatusBadge } from '@/components/vendor/OrderStatusBadge'
import { OrderActions } from '@/components/vendor/OrderActions'

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
  createdAt: Date
  updatedAt: Date
  businessId: string
  customerId: string
  customer: {
    name: string | null
    email: string
  }
  items: OrderItem[]
  deliveryAddress: string | null
  customerPhone: string | null
  notes: string | null
  type: OrderType
  mercadoPagoPaymentId: string | null
  mercadoPagoStatus: string | null
}

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'En preparación',
  READY_FOR_PICKUP: 'Listo para recoger',
  OUT_FOR_DELIVERY: 'En reparto',
  DELIVERED: 'Entregado',
  PICKED_UP: 'Recogido',
  CANCELLED: 'Cancelado',
  REJECTED: 'Rechazado'
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const business = await prisma.business.findUnique({
    where: {
      ownerId: session.user.id
    }
  })

  if (!business) redirect('/vendor/settings')

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      businessId: business.id
    },
    select: {
      id: true,
      shortId: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      updatedAt: true,
      businessId: true,
      customerId: true,
      deliveryAddress: true,
      customerPhone: true,
      notes: true,
      type: true,
      mercadoPagoPaymentId: true,
      mercadoPagoStatus: true,
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      },
      customer: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Pedido no encontrado</h1>
          <p className="mt-2 text-sm text-gray-700">
            El pedido que buscas no existe o no tienes permiso para verlo.
          </p>
          <div className="mt-6">
            <a
              href="/vendor/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Volver a Pedidos
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Pedido #{order.id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Creado el {format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <OrderStatusBadge status={order.status} />
            <OrderActions order={order} />
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cliente</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.customer.name || 'Cliente sin nombre'} ({order.customer.email})
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dirección de entrega</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.deliveryAddress || 'No especificada'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Método de pago</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.paymentMethod}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notas del cliente</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.customerNotes || 'No hay notas'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200">
          <h4 className="px-4 py-5 sm:px-6 text-lg font-medium text-gray-900">
            Productos
          </h4>
          <div className="px-4 py-5 sm:px-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Subtotal: ${order.subtotal.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              Envío: ${order.deliveryFee.toFixed(2)}
            </div>
            <div className="text-lg font-medium text-gray-900">
              Total: ${order.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 