import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const businessStatusSchema = z.object({
  isOpen: z.boolean().optional(),
  enableDelivery: z.boolean().optional(),
  enableTakeaway: z.boolean().optional(),
  estimatedPrepTime: z.number().min(1).max(120).optional(),
  deliveryFee: z.number().min(0).optional()
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const business = await prisma.business.findFirst({
      where: {
        vendorId: session.user.id
      },
      select: {
        isOpen: true,
        enableDelivery: true,
        enableTakeaway: true,
        estimatedPrepTime: true,
        deliveryFee: true
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
    console.error('Error al obtener estado del negocio:', error)
    return NextResponse.json(
      { error: 'Error al obtener estado del negocio' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = businessStatusSchema.parse(body)

    const business = await prisma.business.findFirst({
      where: {
        vendorId: session.user.id
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    const updatedBusiness = await prisma.business.update({
      where: {
        id: business.id
      },
      data: validatedData,
      select: {
        isOpen: true,
        enableDelivery: true,
        enableTakeaway: true,
        estimatedPrepTime: true,
        deliveryFee: true
      }
    })

    return NextResponse.json(updatedBusiness)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al actualizar estado del negocio:', error)
    return NextResponse.json(
      { error: 'Error al actualizar estado del negocio' },
      { status: 500 }
    )
  }
} 