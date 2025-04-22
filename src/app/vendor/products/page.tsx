import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProductList from '@/components/vendor/ProductList'
import Link from 'next/link'

export default async function ProductsPage() {
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

  // Obtener productos y categorías
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { businessId: business.id },
      include: { category: true },
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/vendor/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Producto
        </Link>
      </div>

      <ProductList products={products} categories={categories} />
    </div>
  )
} 