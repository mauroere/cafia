import { Card } from '@/components/ui/Card'
import { CurrencyDollarIcon, ShoppingBagIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function DashboardStats() {
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Ventas Hoy</p>
            <p className="text-2xl font-semibold">$1,234.56</p>
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
            <p className="text-2xl font-semibold">12</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Tiempo Promedio</p>
            <p className="text-2xl font-semibold">25 min</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Nuevos Clientes</p>
            <p className="text-2xl font-semibold">8</p>
          </div>
        </div>
      </Card>
    </>
  )
} 