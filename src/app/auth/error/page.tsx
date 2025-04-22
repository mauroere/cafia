'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    if (error === 'OAuthAccountNotLinked') {
      // Limpiar el error después de 5 segundos
      const timer = setTimeout(() => {
        window.location.href = '/auth/login'
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Error de autenticación
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error === 'OAuthAccountNotLinked'
              ? 'Esta cuenta ya está vinculada a otro método de inicio de sesión. Serás redirigido en 5 segundos...'
              : 'Ha ocurrido un error durante el proceso de autenticación.'}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/auth/login"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
} 