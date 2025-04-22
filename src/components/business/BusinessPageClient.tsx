'use client'

import BusinessGrid from '@/components/business/BusinessGrid'
import BusinessFilters from '@/components/business/BusinessFilters'
import SearchBar from '@/components/business/SearchBar'

export default function BusinessPageClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Explorar Negocios</h1>
        
        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <BusinessFilters />
          </div>
          <div className="lg:col-span-3">
            <BusinessGrid />
          </div>
        </div>
      </div>
    </div>
  )
} 