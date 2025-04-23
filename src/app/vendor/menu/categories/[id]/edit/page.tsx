import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CategoryForm from '@/components/vendor/CategoryForm'

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return (
      <div className="p-4 text-red-600">
        Error: No se pudo obtener la información del usuario
      </div>
    )
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id }
  })

  if (!business) {
    return (
      <div className="p-4 text-red-600">
        Error: No se encontró el negocio asociado
      </div>
    )
  }

  const category = await prisma.category.findUnique({
    where: {
      id: params.id,
      businessId: business.id
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <>
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Editar Categoría
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-6 py-8">
            <CategoryForm 
              businessId={business.id}
              initialData={{
                id: category.id,
                name: category.name,
                description: category.description || '',
                order: category.order || 0
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
} 