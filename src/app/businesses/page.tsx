import { Metadata } from 'next'
import BusinessPageClient from '@/components/business/BusinessPageClient'

export const metadata: Metadata = {
  title: 'Explorar Negocios | Cafia',
  description: 'Descubre los mejores restaurantes y negocios cerca de ti',
}

export default function BusinessesPage() {
  return <BusinessPageClient />
} 