import { prisma } from './prisma'
import { OrderStatus } from '@prisma/client'

export async function getVendorStats(userId: string) {
  const business = await prisma.business.findUnique({
    where: {
      ownerId: userId
    }
  })

  if (!business) {
    throw new Error('Negocio no encontrado')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Obtener ventas del día (pedidos entregados o recogidos)
  const todaySales = await prisma.order.aggregate({
    where: {
      businessId: business.id,
      status: {
        in: [OrderStatus.DELIVERED, OrderStatus.PICKED_UP]
      },
      createdAt: {
        gte: today,
      },
    },
    _sum: {
      totalAmount: true,
    },
  })

  // Obtener ventas de ayer
  const yesterdaySales = await prisma.order.aggregate({
    where: {
      businessId: business.id,
      status: {
        in: [OrderStatus.DELIVERED, OrderStatus.PICKED_UP]
      },
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
    _sum: {
      totalAmount: true,
    },
  })

  // Obtener pedidos pendientes
  const pendingOrders = await prisma.order.count({
    where: {
      businessId: business.id,
      status: OrderStatus.PENDING,
    },
  })

  // Obtener pedidos pendientes de ayer
  const yesterdayPendingOrders = await prisma.order.count({
    where: {
      businessId: business.id,
      status: OrderStatus.PENDING,
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
      businessId: business.id,
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
      businessId: business.id,
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
      businessId: business.id,
      status: {
        in: [OrderStatus.DELIVERED, OrderStatus.PICKED_UP]
      },
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
      businessId: business.id,
      status: {
        in: [OrderStatus.DELIVERED, OrderStatus.PICKED_UP]
      },
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
      value: todaySales._sum.totalAmount || 0,
      change: calculateChange(
        todaySales._sum.totalAmount || 0,
        yesterdaySales._sum.totalAmount || 0
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

  // Primero obtenemos los IDs de los productos más vendidos
  const topProductIds = await prisma.orderItem.groupBy({
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
  })

  // Luego obtenemos los detalles de esos productos
  const productsWithDetails = await Promise.all(
    topProductIds.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          price: true,
        },
      })
      return {
        ...item,
        product,
      }
    })
  )

  return productsWithDetails
} 