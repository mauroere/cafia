import { ChartBarIcon, UserGroupIcon, ShoppingCartIcon, MapPinIcon } from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Negocios activos',
    value: '+500',
    icon: ChartBarIcon,
  },
  {
    name: 'Pedidos procesados',
    value: '+50k',
    icon: ShoppingCartIcon,
  },
  {
    name: 'Clientes satisfechos',
    value: '+10k',
    icon: UserGroupIcon,
  },
  {
    name: 'Ciudades',
    value: '15',
    icon: MapPinIcon,
  },
]

export default function Stats() {
  return (
    <div className="landing-stats">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="stat-item">
              <dt className="stat-label">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600/10">
                  <stat.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                {stat.name}
              </dt>
              <dd className="stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
} 