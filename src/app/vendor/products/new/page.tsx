import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/vendor/ProductForm'

export default async function NewProductPage() {
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

  // Obtener categorías
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Nuevo Producto</h1>
      <ProductForm categories={categories} businessId={business.id} />
    </div>
  )
} 