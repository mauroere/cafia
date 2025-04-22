import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function SearchBar() {
  const [search, setSearch] = useState('')

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        placeholder="Buscar negocios, platos o categorías..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
} 