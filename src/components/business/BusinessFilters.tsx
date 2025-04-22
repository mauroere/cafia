import { Card } from '@/components/ui/Card'
import { useState } from 'react'

type FilterOption = {
  id: string
  label: string
}

const deliveryOptions: FilterOption[] = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'takeaway', label: 'Take Away' },
]

const priceRanges: FilterOption[] = [
  { id: 'low', label: '$' },
  { id: 'medium', label: '$$' },
  { id: 'high', label: '$$$' },
]

const categories: FilterOption[] = [
  { id: 'restaurant', label: 'Restaurantes' },
  { id: 'cafe', label: 'Cafeterías' },
  { id: 'bakery', label: 'Panaderías' },
  { id: 'fastfood', label: 'Comida Rápida' },
]

export default function BusinessFilters() {
  const [selectedDelivery, setSelectedDelivery] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleFilter = (
    value: string,
    current: string[],
    setter: (value: string[]) => void
  ) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value))
    } else {
      setter([...current, value])
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Tipo de Servicio</h3>
          <div className="space-y-2">
            {deliveryOptions.map((option) => (
              <label key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={selectedDelivery.includes(option.id)}
                  onChange={() => toggleFilter(option.id, selectedDelivery, setSelectedDelivery)}
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Rango de Precio</h3>
          <div className="space-y-2">
            {priceRanges.map((option) => (
              <label key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={selectedPrice.includes(option.id)}
                  onChange={() => toggleFilter(option.id, selectedPrice, setSelectedPrice)}
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Categorías</h3>
          <div className="space-y-2">
            {categories.map((option) => (
              <label key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={selectedCategories.includes(option.id)}
                  onChange={() => toggleFilter(option.id, selectedCategories, setSelectedCategories)}
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 