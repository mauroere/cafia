import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardStats from '@/components/vendor/DashboardStats'
import RecentOrders from '@/components/vendor/RecentOrders'
import BusinessStatus from '@/components/vendor/BusinessStatus'

export const metadata: Metadata = {
  title: 'Dashboard | Cafia',
  description: 'Panel de control para vendedores',
}

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'VENDOR') {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <BusinessStatus />
        </div>
      </div>
    </div>
  )
} 