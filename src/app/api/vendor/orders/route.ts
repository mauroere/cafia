import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
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

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    // Construir la consulta
    const where = {
      businessId: business.id,
      ...(status ? { status: status } : {})
    }

    // Obtener pedidos recientes
    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      select: {
        id: true,
        shortId: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        customer: {
          select: {
            name: true
          }
        }
      }
    })

    // Formatear los resultados
    const formattedOrders = orders.map(order => ({
      id: order.id,
      shortId: order.shortId,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      customerName: order.customer.name || 'Cliente'
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
} 