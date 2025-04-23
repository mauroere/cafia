import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

async function getProducts(vendorId: string) {
  return prisma.product.findMany({
    where: {
      vendorId,
    },
    include: {
      category: true,
    },
    orderBy: {
      category: {
        name: 'asc',
      },
    },
  })
}

export default async function MenuPage() {
  const session = await getServerSession(authOptions)
  const products = await getProducts(session?.user?.id as string)

  // Agrupar productos por categoría
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.category?.name || 'Sin categoría'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(product)
    return acc
  }, {} as Record<string, typeof products>)

  return (
    <>
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Menú Digital
            </h1>
            <Link
              href="/vendor/menu/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Nuevo Producto
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {Object.entries(productsByCategory).map(([category, products]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
                  >
                    {product.imageUrl && (
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={product.imageUrl} alt="" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <Link href={`/vendor/menu/${product.id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="truncate text-sm text-gray-500">{formatCurrency(product.price)}</p>
                      </Link>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.available ? 'Disponible' : 'No disponible'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
} 