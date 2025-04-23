import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'VENDOR') {
    redirect('/auth/vendor/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        {children}
      </div>
    </div>
  )
} 