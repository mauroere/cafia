'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  QrCodeIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: HomeIcon },
  { name: 'Pedidos', href: '/vendor/orders', icon: ClipboardDocumentListIcon },
  { name: 'Menú Digital', href: '/vendor/menu', icon: QrCodeIcon },
  { name: 'Estadísticas', href: '/vendor/stats', icon: ChartBarIcon },
  { name: 'Configuración', href: '/vendor/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <img
          className="h-8 w-auto"
          src="/logo.png"
          alt="Cafia"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 px-6 py-4">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                        ${isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/vendor/login' })}
              className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
            >
              <ArrowLeftOnRectangleIcon
                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600"
                aria-hidden="true"
              />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
} 