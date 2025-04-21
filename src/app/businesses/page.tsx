import { prisma } from '@/lib/prisma'

export default async function BusinessesPage() {
  const businesses = await prisma.business.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explorar Negocios</h1>
        
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay negocios registrados aún.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">{business.name}</h2>
                <p className="mt-2 text-gray-500">{business.description}</p>
                <div className="mt-4">
                  <a
                    href={`/businesses/${business.id}`}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Ver Menú →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 