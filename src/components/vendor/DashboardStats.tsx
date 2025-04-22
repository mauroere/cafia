'use client'

import { Card } from '@/components/ui/Card'
import { CurrencyDollarIcon, ShoppingBagIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Stats = {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  totalProducts: number
  activeProducts: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/vendor/stats')
        setStats(response.data)
        setError(null)
      } catch (err) {
        console.error('Error al obtener estadísticas:', err)
        setError('No se pudieron cargar las estadísticas')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </>
    )
  }

  if (error) {
    return (
      <Card className="p-6 col-span-4">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
            <p className="text-2xl font-semibold">
              ${stats?.totalRevenue.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pedidos Pendientes</p>
            <p className="text-2xl font-semibold">{stats?.pendingOrders || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Pedidos</p>
            <p className="text-2xl font-semibold">{stats?.totalOrders || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Productos Activos</p>
            <p className="text-2xl font-semibold">{stats?.activeProducts || 0}</p>
          </div>
        </div>
      </Card>
    </>
  )
} 