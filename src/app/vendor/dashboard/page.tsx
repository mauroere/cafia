'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function VendorDashboard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user) {
    redirect('/auth/vendor/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border-4 border-dashed border-gray-200 p-4">
                <div className="text-center">
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Bienvenido, {session.user.name || session.user.email}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este es tu panel de control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 