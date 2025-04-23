import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Verificar conexión básica a la base de datos
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json(
      { status: 'ok', timestamp: new Date().toISOString() },
      { status: 200 }
    )
  } catch (error) {
    console.error('Healthcheck failed:', error)
    return NextResponse.json(
      { status: 'error', error: 'Database connection failed' },
      { status: 503 }
    )
  }
} 