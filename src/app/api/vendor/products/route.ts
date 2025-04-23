import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Esquema de validación para crear/actualizar productos
const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
  categoryId: z.string().optional(),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number().min(1).max(120).optional(),
  allergens: z.array(z.string()).optional(),
  nutritionalInfo: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
  }).optional(),
})

export const dynamic = 'force-dynamic'

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
    const categoryId = searchParams.get('categoryId')
    const isAvailable = searchParams.get('isAvailable') === 'true' ? true : 
                        searchParams.get('isAvailable') === 'false' ? false : undefined

    // Construir la consulta
    const where: Prisma.ProductWhereInput = {
      businessId: business.id,
      ...(categoryId ? { categoryId } : {}),
      ...(isAvailable !== undefined ? { isAvailable } : {})
    }

    // Obtener productos
    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        category: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Verificar que el negocio pertenece al usuario
    const business = await prisma.business.findUnique({
      where: {
        id: data.businessId,
        ownerId: session.user.id
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Negocio no encontrado o no autorizado' },
        { status: 404 }
      )
    }

    // Verificar que la categoría pertenece al negocio
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
        businessId: business.id
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable,
        categoryId: data.categoryId,
        businessId: business.id
      }
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