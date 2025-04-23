import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
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

    // Obtener el negocio del usuario
    const business = await prisma.business.findUnique({
      where: {
        ownerId: session.user.id
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'No se encontró el negocio asociado' },
        { status: 404 }
      )
    }

    const data = await request.json()

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.available,
        categoryId: data.categoryId,
        businessId: business.id
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error al crear el producto:', error)
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    )
  }
} 