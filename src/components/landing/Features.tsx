import Link from 'next/link'
import { 
  DevicePhoneMobileIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Menú Digital QR',
    description: 'Crea tu menú digital con códigos QR. Actualiza precios y disponibilidad en tiempo real.',
    icon: DevicePhoneMobileIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Gestión de Pedidos',
    description: 'Recibe y gestiona pedidos en tiempo real. Notificaciones instantáneas y seguimiento de estado.',
    icon: ShieldCheckIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Pagos Integrados',
    description: 'Acepta pagos online de forma segura. Integración con Mercado Pago y otros métodos de pago.',
    icon: CurrencyDollarIcon,
    color: 'bg-yellow-500',
  },
  {
    name: 'Análisis de Ventas',
    description: 'Visualiza el rendimiento de tu negocio con gráficos y estadísticas detalladas.',
    icon: ChartBarIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Gestión de Clientes',
    description: 'Mantén un registro de tus clientes y sus preferencias para mejorar su experiencia.',
    icon: UserGroupIcon,
    color: 'bg-pink-500',
  },
  {
    name: 'Horarios de Entrega',
    description: 'Configura tus horarios de entrega y disponibilidad para cada día de la semana.',
    icon: ClockIcon,
    color: 'bg-indigo-500',
  },
  {
    name: 'Chat con Clientes',
    description: 'Comunícate directamente con tus clientes a través de nuestra plataforma integrada.',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-red-500',
  },
  {
    name: 'Notificaciones',
    description: 'Recibe alertas instantáneas de nuevos pedidos y actualizaciones importantes.',
    icon: BellAlertIcon,
    color: 'bg-orange-500',
  },
]

export default function Features() {
  return (
    <div className="landing-features">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-base font-semibold leading-7 text-primary-600">Todo lo que necesitas</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Una plataforma completa para tu negocio
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Gestiona pedidos, menús y pagos en un solo lugar. Sin comisiones, sin complicaciones.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col group">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className={`feature-icon ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  {feature.description}
                </p>
                <p className="mt-6">
                  <Link href="/features" className="text-sm font-semibold leading-6 text-primary-600 group-hover:text-primary-500 transition-colors">
                    Saber más <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
} 