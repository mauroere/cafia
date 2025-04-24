'use client'

import { Order, OrderStatus, Product } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Package, Star } from 'lucide-react'
import Link from 'next/link'

interface AlertsProps {
  orders: Order[]
  products: Product[]
}

export function Alerts({ orders, products }: AlertsProps) {
  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING)
  const lowStockProducts = products.filter(product => product.stock <= 5)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas y Notificaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingOrders.length > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
            <div>
              <p className="font-medium text-yellow-800">
                {pendingOrders.length} pedidos pendientes de confirmación
              </p>
              <Link 
                href="/vendor/orders?status=PENDING"
                className="text-sm text-yellow-600 hover:underline"
              >
                Ver pedidos pendientes
              </Link>
            </div>
          </div>
        )}
        
        {lowStockProducts.length > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
            <Package className="h-5 w-5 text-red-500 mt-1" />
            <div>
              <p className="font-medium text-red-800">
                {lowStockProducts.length} productos con bajo stock
              </p>
              <Link 
                href="/vendor/products"
                className="text-sm text-red-600 hover:underline"
              >
                Gestionar inventario
              </Link>
            </div>
          </div>
        )}
        
        {pendingOrders.length === 0 && lowStockProducts.length === 0 && (
          <div className="flex items-center justify-center p-4 text-gray-500">
            No hay alertas pendientes
          </div>
        )}
      </CardContent>
    </Card>
  )
} 