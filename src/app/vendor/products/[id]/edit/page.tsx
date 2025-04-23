import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/vendor/ProductForm'
import { notFound } from 'next/navigation'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'VENDOR') {
    redirect('/auth/signin')
  }

  // Obtener el negocio del vendedor
  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id }
  })

  if (!business) {
    redirect('/vendor/business/create')
  }

  // Obtener el producto y las categorías
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: params.id,
        businessId: business.id
      },
      include: {
        category: true
      }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Editar Producto</h1>
      <ProductForm 
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          isAvailable: product.isAvailable,
          categoryId: product.category.id
        }}
        categories={categories} 
        businessId={business.id} 
      />
    </div>
  )
} 