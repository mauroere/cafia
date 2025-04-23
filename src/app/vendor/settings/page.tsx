import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import BusinessSettingsForm from '@/components/vendor/BusinessSettingsForm'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'VENDOR') {
    redirect('/auth/signin')
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    select: {
      name: true,
      description: true,
      isActive: true,
      address: true,
      phone: true,
      whatsappNumber: true,
      isOpen: true,
      enableDelivery: true,
      enableTakeaway: true,
      deliveryFee: true,
      estimatedPrepTime: true
    }
  })

  if (!business) {
    redirect('/vendor/business/create')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Configuración del Negocio</h1>
      <BusinessSettingsForm initialData={business} />
    </div>
  )
} 