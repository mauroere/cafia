import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Ventas del día',
    value: '$2,500',
    icon: CurrencyDollarIcon,
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Pedidos pendientes',
    value: '12',
    icon: ShoppingCartIcon,
    change: '+54.02%',
    changeType: 'negative',
  },
  {
    name: 'Clientes nuevos',
    value: '23',
    icon: UserGroupIcon,
    change: '+2.59%',
    changeType: 'positive',
  },
  {
    name: 'Tiempo promedio',
    value: '24.5m',
    icon: ClockIcon,
    change: '-1.87%',
    changeType: 'positive',
  },
]

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className={`flex items-center text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? '↑' : '↓'} {stat.change}
                    <span className="ml-2">vs ayer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contenido principal */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pedidos recientes */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Pedidos Recientes
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  Lista de los últimos pedidos recibidos...
                </div>
              </div>
            </div>

            {/* Productos más vendidos */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Productos Más Vendidos
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  Lista de productos más populares...
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 