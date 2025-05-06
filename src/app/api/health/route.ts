import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { config } from '@/lib/config'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`
    const dbResponseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.app.env,
      database: {
        status: 'connected',
        responseTime: dbResponseTime,
        url: config.database.url ? 'configured' : 'not configured'
      },
      auth: {
        url: config.auth.url ? 'configured' : 'not configured'
      },
      app: {
        url: config.app.url
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.app.env,
      database: {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        url: config.database.url ? 'configured' : 'not configured'
      },
      auth: {
        url: config.auth.url ? 'configured' : 'not configured'
      },
      app: {
        url: config.app.url
      }
    }, { status: 503 })
  } finally {
    await prisma.$disconnect()
  }
} 