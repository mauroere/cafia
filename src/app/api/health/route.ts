import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const startTime = Date.now()
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: {
        status: 'ok',
        responseTime: 0
      }
    }
  }

  try {
    // Verificar conexión básica a la base de datos
    const dbStartTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbEndTime = Date.now()
    
    health.checks.database.responseTime = dbEndTime - dbStartTime
    health.checks.database.status = 'ok'
    
    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    console.error('Healthcheck failed:', error)
    health.status = 'error'
    health.checks.database.status = 'error'
    health.checks.database.error = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(health, { status: 503 })
  }
} 