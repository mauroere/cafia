import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getVendorStats, getRecentOrders, getTopProducts } from '@/lib/vendor'
import { formatCurrency } from '@/lib/utils'
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions)
  const stats = await getVendorStats(session?.user?.id as string)
  const recentOrders = await getRecentOrders(session?.user?.id as string)
  const topProducts = await getTopProducts(session?.user?.id as string)

  const statCards = [
    {
      name: 'Ventas del día',
      value: formatCurrency(stats.sales.value),
      icon: CurrencyDollarIcon,
      change: stats.sales.change.toFixed(2) + '%',
      changeType: stats.sales.change >= 0 ? 'positive' : 'negative',
    },
    {
      name: 'Pedidos pendientes',
      value: stats.pendingOrders.value.toString(),
      icon: ShoppingCartIcon,
      change: stats.pendingOrders.change.toFixed(2) + '%',
      changeType: stats.pendingOrders.change <= 0 ? 'positive' : 'negative',
    },
    {
      name: 'Clientes nuevos',
      value: stats.newCustomers.value.toString(),
      icon: UserGroupIcon,
      change: stats.newCustomers.change.toFixed(2) + '%',
      changeType: stats.newCustomers.change >= 0 ? 'positive' : 'negative',
    },
    {
      name: 'Tiempo promedio',
      value: `${stats.avgDeliveryTime.value}m`,
      icon: ClockIcon,
      change: stats.avgDeliveryTime.change.toFixed(2) + '%',
      changeType: stats.avgDeliveryTime.change <= 0 ? 'positive' : 'negative',
    },
  ]

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
            {statCards.map((stat) => (
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
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <li key={order.id} className="py-5">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {order.customer.name}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {order.items.length} productos - {formatCurrency(order.total)}
                            </p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status === 'PENDING' ? 'Pendiente' : 
                               order.status === 'COMPLETED' ? 'Completado' : 
                               order.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Productos más vendidos */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Productos Más Vendidos
                </h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {topProducts.map((product) => (
                      <li key={product.productId} className="py-5">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {product.productId}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              Vendidos: {product._sum.quantity}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 