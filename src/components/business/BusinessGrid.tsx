import { Card } from '@/components/ui/Card'
import { StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Business = {
  id: string
  name: string
  description: string
  logoUrl: string
  slug: string
  deliveryTime: string
  deliveryFee: number
  categories: string[]
  orderCount: number
}

type Pagination = {
  total: number
  pages: number
  currentPage: number
  limit: number
}

export default function BusinessGrid() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/businesses')
        setBusinesses(response.data.businesses)
        setPagination(response.data.pagination)
        setError(null)
      } catch (err) {
        console.error('Error al obtener negocios:', err)
        setError('No se pudieron cargar los negocios')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  if (businesses.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 text-gray-500">
          No se encontraron negocios
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <Link href={`/businesses/${business.slug}`} key={business.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-48 w-full">
              <Image
                src={business.logoUrl}
                alt={business.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{business.name}</h3>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">
                    {business.orderCount > 0 ? (4.5).toFixed(1) : 'Nuevo'}
                  </span>
                  {business.orderCount > 0 && (
                    <span className="ml-1 text-sm text-gray-500">
                      ({business.orderCount})
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">{business.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{business.deliveryTime}</span>
                <span className="mx-2">•</span>
                <span>Delivery: ${business.deliveryFee.toFixed(2)}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {business.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
} 