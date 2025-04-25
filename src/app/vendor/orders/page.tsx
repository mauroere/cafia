'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import { OrderStatus } from '@prisma/client'
import { toast } from 'react-hot-toast'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, formatStatus } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { OrderList } from '@/components/vendor/OrderList'
import { OrderFilters } from '@/components/vendor/OrderFilters'

interface OrdersPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: OrderStatus
    date?: string
  }
}

const ITEMS_PER_PAGE = 10

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const business = await prisma.business.findUnique({
    where: {
      ownerId: session.user.id
    }
  })

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">No hay negocio configurado</h1>
          <p className="mt-2 text-sm text-gray-700">
            Por favor, configura tu negocio antes de ver los pedidos.
          </p>
          <div className="mt-6">
            <a
              href="/vendor/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Configurar Negocio
            </a>
          </div>
        </div>
      </div>
    )
  }

  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const status = searchParams.status
  const date = searchParams.date

  // Primero, buscar los IDs de los clientes que coincidan con la búsqueda
  let customerIds: string[] = []
  if (search) {
    const customers = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } }
        ]
      },
      select: { id: true }
    })
    customerIds = customers.map(c => c.id)
  }

  const where = {
    businessId: business.id,
    ...(search && {
      OR: [
        { id: { contains: search } },
        ...(customerIds.length > 0 ? [{ customerId: { in: customerIds } }] : [])
      ]
    }),
    ...(status && { status }),
    ...(date && {
      createdAt: {
        gte: new Date(date)
      }
    })
  }

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE
    }),
    prisma.order.count({ where })
  ])

  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE)

  if (page > totalPages && totalPages > 0) {
    redirect('/vendor/orders?page=1')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Pedidos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos los pedidos realizados en tu restaurante.
          </p>
        </div>
      </div>

      <OrderFilters />

      <OrderList
        orders={orders}
        totalPages={totalPages}
        currentPage={page}
      />
    </div>
  )
} 