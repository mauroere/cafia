import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import {
  BanknotesIcon,
  ShoppingBagIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { RecentOrders } from '@/components/vendor/RecentOrders'
import { SalesChart } from '@/components/vendor/SalesChart'
import { ProductStats } from '@/components/vendor/ProductStats'
import { OrderStats } from '@/components/vendor/OrderStats'
import { SalesTrends } from '@/components/vendor/SalesTrends'
import { OrderStatus } from '@prisma/client'

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const business = await prisma.business.findUnique({
    where: {
      ownerId: session.user.id,
    },
    include: {
      orders: {
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      products: {
        include: {
          _count: {
            select: {
              orderItems: true
            }
          }
        }
      }
    },
  })

  if (!business) {
    return (
      <div className="text-center py-12">
        <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay negocio configurado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza configurando tu negocio para empezar a recibir pedidos.
        </p>
        <div className="mt-6">
          <a
            href="/vendor/settings"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            Configurar Negocio
          </a>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Ventas Totales',
      value: `$${business.orders
        .reduce((acc, order) => acc + order.totalAmount, 0)
        .toFixed(2)}`,
      icon: BanknotesIcon,
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Pedidos Totales',
      value: business.orders.length,
      icon: ShoppingBagIcon,
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Pedidos Pendientes',
      value: business.orders.filter((order) => order.status === OrderStatus.PENDING).length,
      icon: ClockIcon,
      change: '-3%',
      changeType: 'negative'
    },
    {
      name: 'Productos Activos',
      value: business.products.length,
      icon: ChartBarIcon,
      change: '+5%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          {business.name}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Panel de control de tu negocio
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas del Mes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart orders={business.orders} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tendencias de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesTrends orders={business.orders} />
          </CardContent>
        </Card>
      </div>

      <OrderStats orders={business.orders} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productos más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductStats products={business.products} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={business.orders.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 