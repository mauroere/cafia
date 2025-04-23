import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para actualizar productos
const updateProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
  categoryId: z.string().optional(),
  isAvailable: z.boolean().optional(),
  preparationTime: z.number().min(1).max(120).optional(),
  allergens: z.array(z.string()).optional(),
  nutritionalInfo: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
  }).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Obtener el producto
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
        businessId: business.id
      },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error al obtener producto:', error)
    return NextResponse.json(
      { error: 'Error al obtener producto' },
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

    // Verificar que el producto existe y pertenece al negocio
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: params.id,
        businessId: business.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Obtener y validar los datos de la solicitud
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    // Actualizar el producto
    const product = await prisma.product.update({
      where: {
        id: params.id
      },
      data: validatedData,
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al actualizar producto:', error)
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
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

    // Verificar que el producto existe y pertenece al negocio del usuario
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        business: {
          ownerId: session.user.id
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la categoría pertenece al negocio
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
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

    // Actualizar el producto
    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable,
        categoryId: data.categoryId
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error al actualizar el producto:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
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

    // Verificar que el producto existe y pertenece al negocio del usuario
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        business: {
          ownerId: session.user.id
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar el producto
    await prisma.product.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar el producto:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    )
  }
} 