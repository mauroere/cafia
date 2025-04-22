import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Esquema de validación para los parámetros de búsqueda
const searchParamsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  delivery: z.string().optional(),
  price: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
})

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Obtener y validar los parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const validatedParams = searchParamsSchema.parse(Object.fromEntries(searchParams))
    
    // Construir la consulta
    const where: Prisma.BusinessWhereInput = {
      isActive: true,
      ...(validatedParams.search && {
        OR: [
          { name: { contains: validatedParams.search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: validatedParams.search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(validatedParams.category && {
        categories: {
          some: {
            name: { equals: validatedParams.category, mode: Prisma.QueryMode.insensitive }
          }
        }
      }),
    }

    // Obtener negocios
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip: (validatedParams.page - 1) * validatedParams.limit,
        take: validatedParams.limit,
        orderBy: { name: 'asc' },
        include: {
          categories: true,
          _count: {
            select: { orders: true }
          }
        }
      }),
      prisma.business.count({ where })
    ])

    // Formatear la respuesta
    const formattedBusinesses = businesses.map(business => ({
      id: business.id,
      name: business.name,
      description: business.description,
      logoUrl: business.logoUrl || '/images/default-business.jpg',
      slug: business.slug,
      deliveryTime: business.deliveryTime || '30-45 min',
      deliveryFee: business.deliveryFee || 5,
      categories: business.categories.map(cat => cat.name),
      orderCount: business._count.orders
    }))

    return NextResponse.json({
      businesses: formattedBusinesses,
      pagination: {
        total,
        pages: Math.ceil(total / validatedParams.limit),
        currentPage: validatedParams.page,
        limit: validatedParams.limit
      }
    })
  } catch (error) {
    console.error('Error al obtener negocios:', error)
    return NextResponse.json(
      { error: 'Error al obtener negocios' },
      { status: 500 }
    )
  }
} 