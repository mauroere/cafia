import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { Role } from '@/types/database'

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validate role
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json(
        { message: 'Rol inválido' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { message: 'Error al crear usuario' },
      { status: 500 }
    )
  }
} 