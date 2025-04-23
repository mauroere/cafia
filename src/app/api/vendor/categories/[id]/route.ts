import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        business: {
          include: {
            owner: true
          }
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario es dueño del negocio
    if (category.business.owner.id !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error al obtener categoría:', error)
    return NextResponse.json(
      { error: 'Error al obtener categoría' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        business: {
          include: {
            owner: true
          }
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario es dueño del negocio
    if (category.business.owner.id !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: validatedData,
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al actualizar categoría:', error)
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que la categoría existe y pertenece al negocio del usuario
    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        business: {
          ownerId: session.user.id
        }
      },
      include: {
        products: {
          select: { id: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Verificar si la categoría tiene productos
    if (category.products.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría que tiene productos' },
        { status: 400 }
      )
    }

    // Eliminar la categoría
    await prisma.category.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar la categoría:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la categoría' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Verificar que la categoría existe y pertenece al negocio del usuario
    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        business: {
          ownerId: session.user.id
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar la categoría
    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id
      },
      data: {
        name: data.name,
        description: data.description,
        order: data.order
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error al actualizar la categoría:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la categoría' },
      { status: 500 }
    )
  }
} 