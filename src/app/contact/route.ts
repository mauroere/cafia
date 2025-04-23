import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
        address: true,
        phone: true,
        whatsappNumber: true,
        description: true,
        isActive: true,
        isOpen: true
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
    console.error('Error al obtener información de contacto:', error)
    return NextResponse.json(
      { error: 'Error al obtener información de contacto' },
      { status: 500 }
    )
  }
} 