import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que el negocio pertenece al usuario
    const business = await prisma.business.findUnique({
      where: {
        id: params.businessId,
        ownerId: session.user.id
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    const data = await request.json()

    // Actualizar el estado del menú
    const updatedBusiness = await prisma.business.update({
      where: {
        id: params.businessId
      },
      data: {
        isMenuActive: data.isActive
      }
    })

    return NextResponse.json(updatedBusiness)
  } catch (error) {
    console.error('Error al actualizar el estado del menú:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el estado del menú' },
      { status: 500 }
    )
  }
} 