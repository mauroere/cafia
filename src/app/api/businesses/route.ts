import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para los parámetros de búsqueda
const searchParamsSchema = z.object({
  search: z.string().optional(),
  delivery: z.enum(['delivery', 'takeaway']).optional(),
  price: z.enum(['low', 'medium', 'high']).optional(),
  category: z.string().optional(),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1)
})

export async function GET(request: Request) {
  try {
    // Obtener y validar parámetros de la URL
    const { searchParams } = new URL(request.url)
    const validatedParams = searchParamsSchema.parse(Object.fromEntries(searchParams))
    
    // Construir la consulta
    const where = {
      isActive: true,
      ...(validatedParams.search ? {
        OR: [
          { name: { contains: validatedParams.search, mode: 'insensitive' } },
          { description: { contains: validatedParams.search, mode: 'insensitive' } }
        ]
      } : {}),
      ...(validatedParams.delivery === 'delivery' ? { enableDelivery: true } : {}),
      ...(validatedParams.delivery === 'takeaway' ? { enableTakeaway: true } : {}),
      ...(validatedParams.category ? {
        categories: {
          some: {
            name: { contains: validatedParams.category, mode: 'insensitive' }
          }
        }
      } : {})
    }

    // Obtener negocios con paginación
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        take: validatedParams.limit,
        skip: (validatedParams.page - 1) * validatedParams.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          logoUrl: true,
          slug: true,
          estimatedPrepTime: true,
          deliveryFee: true,
          categories: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              orders: true
            }
          }
        }
      }),
      prisma.business.count({ where })
    ])

    // Formatear los resultados
    const formattedBusinesses = businesses.map(business => ({
      id: business.id,
      name: business.name,
      description: business.description,
      logoUrl: business.logoUrl || '/placeholder.jpg',
      slug: business.slug,
      deliveryTime: `${business.estimatedPrepTime || 25} min`,
      deliveryFee: business.deliveryFee,
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al obtener negocios:', error)
    return NextResponse.json(
      { error: 'Error al obtener negocios' },
      { status: 500 }
    )
  }
} 