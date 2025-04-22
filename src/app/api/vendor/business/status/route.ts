import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Esquema de validación para la actualización del estado
const updateStatusSchema = z.object({
  isOpen: z.boolean().optional(),
  enableDelivery: z.boolean().optional(),
  enableTakeaway: z.boolean().optional(),
  estimatedPrepTime: z.number().min(5).max(120).optional(),
  deliveryFee: z.number().min(0).max(100).optional()
})

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

    // Obtener y validar los datos de la solicitud
    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    // Preparar los datos para la actualización
    const updateData: Prisma.BusinessUpdateInput = {
      ...(validatedData.isOpen !== undefined && { isOpen: validatedData.isOpen }),
      ...(validatedData.enableDelivery !== undefined && { enableDelivery: validatedData.enableDelivery }),
      ...(validatedData.enableTakeaway !== undefined && { enableTakeaway: validatedData.enableTakeaway }),
      ...(validatedData.estimatedPrepTime && { estimatedPrepTime: validatedData.estimatedPrepTime }),
      ...(validatedData.deliveryFee && { deliveryFee: validatedData.deliveryFee })
    }

    // Actualizar el estado del negocio
    const updatedBusiness = await prisma.business.update({
      where: { id: business.id },
      data: updateData,
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