import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Por ahora solo devolvemos información básica de contacto
    const contactInfo = {
      email: 'contacto@cafia.com',
      phone: '+1234567890',
      address: 'Dirección de la empresa',
      businessHours: 'Lunes a Viernes 9:00 AM - 6:00 PM'
    }

    return NextResponse.json(contactInfo)
  } catch (error) {
    console.error('Error al obtener información de contacto:', error)
    return NextResponse.json(
      { error: 'Error al obtener información de contacto' },
      { status: 500 }
    )
  }
} 