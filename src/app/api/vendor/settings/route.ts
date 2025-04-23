import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      )
    }

    const business = await prisma.business.findUnique({
      where: {
        ownerId: session.user.id
      },
      select: {
        name: true,
        description: true,
        logoUrl: true,
        address: true,
        phone: true,
        whatsappNumber: true,
        isActive: true,
        isOpen: true,
        enableDelivery: true,
        enableTakeaway: true,
        deliveryFee: true,
        estimatedPrepTime: true,
        mercadoPagoPublicKey: true,
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
    console.error('Error al obtener la configuración:', error)
    return NextResponse.json(
      { error: 'Error al obtener la configuración' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const business = await prisma.business.update({
      where: {
        ownerId: session.user.id
      },
      data: {
        name: data.name,
        description: data.description,
        logoUrl: data.logoUrl,
        address: data.address,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        isActive: data.isActive,
        isOpen: data.isOpen,
        enableDelivery: data.enableDelivery,
        enableTakeaway: data.enableTakeaway,
        deliveryFee: data.deliveryFee,
        estimatedPrepTime: data.estimatedPrepTime,
      }
    })

    return NextResponse.json(business)
  } catch (error) {
    console.error('Error al actualizar la configuración:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la configuración' },
      { status: 500 }
    )
  }
} 