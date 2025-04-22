import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Obtener la fecha de inicio del día actual
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Obtener ventas del día
    const todayOrders = await prisma.order.findMany({
      where: {
        businessId: business.id,
        createdAt: {
          gte: today
        },
        status: {
          in: ['DELIVERED', 'PICKED_UP']
        }
      },
      select: {
        totalAmount: true
      }
    })

    // Calcular ventas totales del día
    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Obtener pedidos pendientes
    const pendingOrders = await prisma.order.count({
      where: {
        businessId: business.id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY']
        }
      }
    })

    // Obtener tiempo promedio de preparación
    const completedOrders = await prisma.order.findMany({
      where: {
        businessId: business.id,
        status: {
          in: ['DELIVERED', 'PICKED_UP']
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
        }
      },
      select: {
        createdAt: true,
        updatedAt: true
      }
    })

    // Calcular tiempo promedio (en minutos)
    const avgPrepTime = completedOrders.length > 0
      ? Math.round(completedOrders.reduce((sum, order) => {
          const prepTime = (order.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 60)
          return sum + prepTime
        }, 0) / completedOrders.length)
      : 0

    // Obtener nuevos clientes (últimos 7 días)
    const newCustomers = await prisma.user.count({
      where: {
        orders: {
          some: {
            businessId: business.id,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }
      }
    })

    return NextResponse.json({
      todaySales,
      pendingOrders,
      avgPrepTime,
      newCustomers
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
} 