import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'

const filters = [
  {
    id: 'delivery',
    name: 'Tiempo de entrega',
    options: [
      { value: 'fast', label: 'Rápido (15-30 min)' },
      { value: 'medium', label: 'Normal (30-45 min)' },
      { value: 'slow', label: 'Lento (45+ min)' },
    ],
  },
  {
    id: 'price',
    name: 'Precio',
    options: [
      { value: 'low', label: '$' },
      { value: 'medium', label: '$$' },
      { value: 'high', label: '$$$' },
    ],
  },
  {
    id: 'category',
    name: 'Categoría',
    options: [
      { value: 'restaurant', label: 'Restaurante' },
      { value: 'cafe', label: 'Cafetería' },
      { value: 'bakery', label: 'Panadería' },
      { value: 'grocery', label: 'Supermercado' },
    ],
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function BusinessFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filterId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(filterId, value)
    } else {
      params.delete(filterId)
    }
    
    // Mantener otros filtros existentes
    router.push(`/businesses?${params.toString()}`)
  }

  return (
    <Disclosure as="section" aria-labelledby="filter-heading" className="border-b border-gray-200 py-6">
      {({ open }) => (
        <>
          <h2 id="filter-heading" className="sr-only">
            Filtros de negocios
          </h2>

          <div className="relative col-start-1 row-start-1 py-4">
            <div className="mx-auto flex max-w-7xl space-x-4 divide-x divide-gray-200 px-4 sm:px-6 lg:px-8">
              <div>
                <Disclosure.Button className="group inline-flex items-center bg-white py-2 text-sm font-medium text-gray-900">
                  <span>Filtros</span>
                  <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {filters.reduce((count, filter) => {
                      return count + (searchParams.get(filter.id) ? 1 : 0)
                    }, 0)}
                  </span>
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="border-t border-gray-200 py-6">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
              {filters.map((section) => (
                <div key={section.id} className="border-b border-gray-200 py-6">
                  <h3 className="flow-root -my-3">
                    <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">{section.name}</span>
                      <span className="ml-6 flex items-center">
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <div className="pt-6">
                    <div className="space-y-4">
                      {section.options.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${section.id}-${option.value}`}
                            name={`${section.id}[]`}
                            value={option.value}
                            type="radio"
                            checked={searchParams.get(section.id) === option.value}
                            onChange={() => handleFilterChange(section.id, option.value)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label
                            htmlFor={`filter-${section.id}-${option.value}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
} 