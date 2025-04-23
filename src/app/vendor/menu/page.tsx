import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import QRCodeDisplay from '@/components/vendor/QRCodeDisplay'
import MenuStatusToggle from '@/components/vendor/MenuStatusToggle'
import ProductCategoryManager from '@/components/vendor/ProductCategoryManager'

export default async function VendorMenu() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return (
      <div className="p-4 text-red-600">
        Error: No se pudo obtener la información del usuario
      </div>
    )
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: {
      categories: {
        include: {
          products: true
        }
      }
    }
  })

  if (!business) {
    return (
      <div className="p-4 text-red-600">
        Error: No se encontró el negocio asociado
      </div>
    )
  }

  return (
    <>
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Menú Digital
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Panel de QR y Estado */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2 className="text-base font-semibold leading-6 text-gray-900">
                    Código QR de tu Menú
                  </h2>
                  <div className="mt-4">
                    <QRCodeDisplay businessId={business.id} />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2 className="text-base font-semibold leading-6 text-gray-900">
                    Estado del Menú
                  </h2>
                  <div className="mt-4">
                    <MenuStatusToggle 
                      businessId={business.id} 
                      initialStatus={business.isActive} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gestor de Productos y Categorías */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-base font-semibold leading-6 text-gray-900">
                  Gestionar Menú
                </h2>
                <div className="mt-4">
                  <ProductCategoryManager 
                    businessId={business.id}
                    categories={business.categories}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 