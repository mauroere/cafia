'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return 'No tienes permiso para acceder a esta página.'
      case 'Verification':
        return 'El enlace de verificación ha expirado o ya ha sido usado.'
      case 'Configuration':
        return 'Hay un problema con la configuración del servidor.'
      case 'InvalidCredentials':
        return 'Las credenciales proporcionadas no son válidas.'
      default:
        return 'Ocurrió un error durante la autenticación.'
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Error de autenticación
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getErrorMessage()}
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/auth/vendor/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
} 