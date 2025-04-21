import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Role } from '@prisma/client'

export default function Navbar() {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary-600">
            Cafia
          </Link>

          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                {session.user.role === Role.ADMIN && (
                  <Link href="/admin" className="text-gray-600 hover:text-primary-600">
                    Admin
                  </Link>
                )}
                {session.user.role === Role.VENDOR && (
                  <Link href="/vendor" className="text-gray-600 hover:text-primary-600">
                    Mi Negocio
                  </Link>
                )}
                {session.user.role === Role.CUSTOMER && (
                  <Link href="/orders" className="text-gray-600 hover:text-primary-600">
                    Mis Pedidos
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-primary-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600">
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 