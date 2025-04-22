import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Esquema de validación para los parámetros de búsqueda
const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  enableTakeaway: z.coerce.boolean().optional(),
  enableDelivery: z.coerce.boolean().optional(),
})

export async function GET(request: Request) {
  try {
    // Obtener y validar parámetros de la URL
    const { searchParams } = new URL(request.url)
    const validatedParams = searchParamsSchema.parse(Object.fromEntries(searchParams))

    // Construir la consulta de búsqueda
    const where: Prisma.BusinessWhereInput = {
      isActive: true,
    }

    // Agregar filtros opcionales
    if (validatedParams.search) {
      const searchTerm = validatedParams.search.toLowerCase()
      where.OR = [
        { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      ]
    }

    if (validatedParams.categoryId) {
      where.categories = {
        some: {
          id: validatedParams.categoryId
        }
      }
    }

    if (validatedParams.enableTakeaway !== undefined) {
      where.enableTakeaway = validatedParams.enableTakeaway
    }

    if (validatedParams.enableDelivery !== undefined) {
      where.enableDelivery = validatedParams.enableDelivery
    }

    // Obtener negocios y total
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        take: validatedParams.limit,
        skip: (validatedParams.page - 1) * validatedParams.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: true,
          _count: {
            select: { orders: true }
          }
        }
      }),
      prisma.business.count({ where })
    ])

    // Calcular paginación
    const totalPages = Math.ceil(total / validatedParams.limit)

    return NextResponse.json({
      businesses: businesses.map(business => ({
        ...business,
        orderCount: business._count.orders
      })),
      pagination: {
        total,
        pages: totalPages,
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