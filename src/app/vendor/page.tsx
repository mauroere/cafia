import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import {
  BanknotesIcon,
  ShoppingBagIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

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
            gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Últimos 30 días
          },
        },
      },
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
    },
    {
      name: 'Pedidos Totales',
      value: business.orders.length,
      icon: ShoppingBagIcon,
    },
    {
      name: 'Pedidos Pendientes',
      value: business.orders.filter((order) => order.status === 'PENDING').length,
      icon: ClockIcon,
    },
  ]

  return (
    <div>
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          {business.name}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Panel de control de tu negocio
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Aquí irán más secciones como pedidos recientes, productos populares, etc. */}
    </div>
  )
} 