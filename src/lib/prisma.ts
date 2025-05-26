import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Opciones de conexión para mejorar la resistencia en producción
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'minimal',
    // Estas opciones mejoran la resistencia de la conexión en producción
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // En producción, agregar reintento de consultas
    ...(process.env.NODE_ENV === 'production' && {
      // Estas propiedades son válidas para Prisma Client Extensions
      $extends: {
        client: {
          $allOperations: async ({ operation, model, args, query }, next) => {
            const MAX_RETRIES = 3
            let retries = 0
            
            while (true) {
              try {
                return await next({ operation, model, args, query })
              } catch (e) {
                // Solo reintentar errores de conexión
                if (e.code?.startsWith('P1') && retries < MAX_RETRIES) {
                  retries++
                  await new Promise(r => setTimeout(r, 1000 * retries))
                  continue
                }
                throw e
              }
            }
          }
        }
      }
    })
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma