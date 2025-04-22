import { Card } from '@/components/ui/Card'
import { StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

type Business = {
  id: string
  name: string
  description: string
  logoUrl: string
  rating: number
  reviewCount: number
  deliveryTime: string
  minOrder: number
  categories: string[]
}

// TODO: Replace with real data from API
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Restaurante El Sabor',
    description: 'Comida tradicional con un toque moderno',
    logoUrl: '/placeholder.jpg',
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '25-35 min',
    minOrder: 15,
    categories: ['Restaurante', 'Tradicional'],
  },
  // Add more mock businesses...
]

export default function BusinessGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockBusinesses.map((business) => (
        <Link href={`/businesses/${business.id}`} key={business.id}>
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
                  <span className="ml-1 text-sm font-medium">{business.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({business.reviewCount})
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">{business.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{business.deliveryTime}</span>
                <span className="mx-2">•</span>
                <span>Mín. ${business.minOrder}</span>
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