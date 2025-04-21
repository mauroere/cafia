import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Square3Stack3DIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Panel', href: '/vendor', icon: HomeIcon },
  { name: 'Pedidos', href: '/vendor/orders', icon: ClipboardDocumentListIcon },
  { name: 'Menú', href: '/vendor/menu', icon: Square3Stack3DIcon },
  { name: 'Categorías', href: '/vendor/categories', icon: TagIcon },
  { name: 'Mercado Pago', href: '/vendor/mercadopago', icon: QrCodeIcon },
  { name: 'Configuración', href: '/vendor/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link href="/vendor" className="text-xl font-bold text-primary-600">
          Cafia
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <ArrowLeftOnRectangleIcon
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
} 