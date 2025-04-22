import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import { Role } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/auth/vendor/login',
    error: '/auth/error',
    signOut: '/auth/vendor/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          throw new Error('User not found')
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        if (user.role !== Role.VENDOR) {
          throw new Error('AccessDenied')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      }
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, la convertimos en absoluta
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Si la URL ya es absoluta y pertenece al mismo dominio, la permitimos
      else if (url.startsWith(baseUrl)) {
        return url
      }
      // Por defecto, redirigimos a la página principal
      return baseUrl
    }
  },
}

export const isAdmin = (role?: string) => role === Role.ADMIN
export const isVendor = (role?: string) => role === Role.VENDOR
export const isCustomer = (role?: string) => role === Role.CUSTOMER 