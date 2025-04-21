import 'next-auth'
import { Role } from './database'

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
  }

  interface Session {
    user: User
  }
} 