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

    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
      select: {
        name: true,
        description: true,
        isActive: true,
        address: true,
        phone: true,
        whatsappNumber: true,
        isOpen: true,
        enableDelivery: true,
        enableTakeaway: true,
        deliveryFee: true,
        estimatedPrepTime: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(business)
  } catch (error) {
    console.error('Error al obtener configuración:', error)
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    const business = await prisma.business.update({
      where: { ownerId: session.user.id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        address: data.address,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        isOpen: data.isOpen,
        enableDelivery: data.enableDelivery,
        enableTakeaway: data.enableTakeaway,
        deliveryFee: data.deliveryFee,
        estimatedPrepTime: data.estimatedPrepTime
      }
    })

    return NextResponse.json(business)
  } catch (error) {
    console.error('Error al actualizar configuración:', error)
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    )
  }
} 