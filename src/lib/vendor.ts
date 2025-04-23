import { prisma } from './prisma'

export async function getVendorStats(vendorId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Obtener ventas del día
  const todaySales = await prisma.order.aggregate({
    where: {
      vendorId,
      status: 'COMPLETED',
      createdAt: {
        gte: today,
      },
    },
    _sum: {
      total: true,
    },
  })

  // Obtener ventas de ayer
  const yesterdaySales = await prisma.order.aggregate({
    where: {
      vendorId,
      status: 'COMPLETED',
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
    _sum: {
      total: true,
    },
  })

  // Obtener pedidos pendientes
  const pendingOrders = await prisma.order.count({
    where: {
      vendorId,
      status: 'PENDING',
    },
  })

  // Obtener pedidos pendientes de ayer
  const yesterdayPendingOrders = await prisma.order.count({
    where: {
      vendorId,
      status: 'PENDING',
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
  })

  // Obtener clientes nuevos del día
  const newCustomers = await prisma.order.groupBy({
    by: ['customerId'],
    where: {
      vendorId,
      createdAt: {
        gte: today,
      },
    },
    _count: true,
  })

  // Obtener clientes nuevos de ayer
  const yesterdayNewCustomers = await prisma.order.groupBy({
    by: ['customerId'],
    where: {
      vendorId,
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
    _count: true,
  })

  // Calcular tiempo promedio de entrega
  const completedOrders = await prisma.order.findMany({
    where: {
      vendorId,
      status: 'COMPLETED',
      createdAt: {
        gte: today,
      },
    },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  })

  const avgDeliveryTime = completedOrders.reduce((acc, order) => {
    return acc + (order.updatedAt.getTime() - order.createdAt.getTime())
  }, 0) / (completedOrders.length || 1)

  // Calcular tiempo promedio de entrega de ayer
  const yesterdayCompletedOrders = await prisma.order.findMany({
    where: {
      vendorId,
      status: 'COMPLETED',
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  })

  const yesterdayAvgDeliveryTime = yesterdayCompletedOrders.reduce((acc, order) => {
    return acc + (order.updatedAt.getTime() - order.createdAt.getTime())
  }, 0) / (yesterdayCompletedOrders.length || 1)

  // Calcular cambios porcentuales
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  return {
    sales: {
      value: todaySales._sum.total || 0,
      change: calculateChange(
        todaySales._sum.total || 0,
        yesterdaySales._sum.total || 0
      ),
    },
    pendingOrders: {
      value: pendingOrders,
      change: calculateChange(pendingOrders, yesterdayPendingOrders),
    },
    newCustomers: {
      value: newCustomers.length,
      change: calculateChange(newCustomers.length, yesterdayNewCustomers.length),
    },
    avgDeliveryTime: {
      value: Math.round(avgDeliveryTime / 1000 / 60), // Convertir a minutos
      change: calculateChange(avgDeliveryTime, yesterdayAvgDeliveryTime),
    },
  }
}

export async function getRecentOrders(vendorId: string) {
  const business = await prisma.business.findUnique({
    where: {
      ownerId: vendorId
    }
  })

  if (!business) {
    throw new Error('Negocio no encontrado')
  }

  return prisma.order.findMany({
    where: {
      businessId: business.id
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })
}

export async function getTopProducts(vendorId: string) {
  const business = await prisma.business.findUnique({
    where: {
      ownerId: vendorId
    }
  })

  if (!business) {
    throw new Error('Negocio no encontrado')
  }

  return prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      product: {
        businessId: business.id
      }
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
    include: {
      product: {
        select: {
          name: true,
          price: true
        }
      }
    }
  })
} 