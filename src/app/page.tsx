import Link from 'next/link'
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  DevicePhoneMobileIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Stats from '@/components/landing/Stats'
import Testimonials from '@/components/landing/Testimonials'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import Features from '@/components/landing/Features'
import CTA from '@/components/landing/CTA'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Gestiona tus pedidos online de manera eficiente
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Optimiza tu negocio con nuestro sistema integral de gestión de pedidos. 
              Desde el menú digital hasta la entrega, todo en un solo lugar.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/auth/vendor/register"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Comenzar Ahora
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Saber más <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <DashboardPreview />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <Stats />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTA />
    </main>
  )
} 