'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Role } from '@/types/database'
import { signIn } from 'next-auth/react'
import RegisterForm from '@/components/auth/RegisterForm'

export const dynamic = 'force-dynamic'

function RegisterFormWrapper() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  
  return <RegisterForm callbackUrl={callbackUrl} />
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando...</p>
          </div>
        }>
          <RegisterFormWrapper />
        </Suspense>
      </div>
    </div>
  )
} 