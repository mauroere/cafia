import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener el negocio del vendedor
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    // Obtener estadísticas
    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalProducts,
      activeProducts
    ] = await Promise.all([
      // Total de pedidos
      prisma.order.count({
        where: { businessId: business.id }
      }),
      // Ingresos totales
      prisma.order.aggregate({
        where: { 
          businessId: business.id,
          status: OrderStatus.DELIVERED
        },
        _sum: {
          totalAmount: true
        }
      }),
      // Pedidos pendientes
      prisma.order.count({
        where: { 
          businessId: business.id,
          status: OrderStatus.PENDING
        }
      }),
      // Pedidos completados
      prisma.order.count({
        where: { 
          businessId: business.id,
          status: {
            in: [OrderStatus.DELIVERED, OrderStatus.PICKED_UP]
          }
        }
      }),
      // Total de productos
      prisma.product.count({
        where: { businessId: business.id }
      }),
      // Productos activos
      prisma.product.count({
        where: { 
          businessId: business.id,
          isAvailable: true
        }
      })
    ])

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      completedOrders,
      totalProducts,
      activeProducts
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
} 